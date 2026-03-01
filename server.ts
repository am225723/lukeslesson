import express from "express";
import { createServer as createViteServer } from "vite";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { exec } from "child_process";
import fs from "fs";
import os from "os";

// In-memory state for the workspace
let workspaceState = {
  code: `import json

def generate_report(data):
    """
    Automates report making for business agents.
    """
    print("Initializing Google Pro tools...")
    print("Connecting to Jules.google & AI Studio...")
    
    report = {
        "status": "success",
        "tasks_automated": len(data),
        "insights": "Gemini personalized for your business.",
        "tools_used": ["stitch.withgoogle", "flutter", "Codex"]
    }
    
    return json.dumps(report, indent=2)

# Sample data for the agent
tasks = ["data_entry", "email_sorting", "app_launch"]
print(generate_report(tasks))`,
  lines: [],
  chat: []
};

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });
  const PORT = 5000;

  // Socket.io logic
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Send current state to newly connected user
    socket.emit("workspace:load", workspaceState);

    socket.on("draw:line", (data) => {
      // If the line already exists (based on some ID or just by replacing the last line if it's currently drawing),
      // For simplicity, we'll just append it. But to avoid exponential growth, clients should emit 'draw:end' or we just sync the whole state.
      // Let's change this to sync the whole lines array from the client to be safe and simple.
    });

    socket.on("draw:sync", (lines) => {
      workspaceState.lines = lines;
      socket.broadcast.emit("draw:sync", lines);
    });

    socket.on("draw:clear", () => {
      workspaceState.lines = [];
      socket.broadcast.emit("draw:clear");
    });

    socket.on("code:update", (data) => {
      workspaceState.code = data;
      socket.broadcast.emit("code:update", data);
    });

    socket.on("chat:message", (data) => {
      workspaceState.chat.push(data);
      socket.broadcast.emit("chat:message", data);
    });

    socket.on("workspace:save", (state) => {
      workspaceState = { ...workspaceState, ...state };
      socket.broadcast.emit("workspace:load", workspaceState);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // API routes
  app.use(express.json());
  
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/execute", (req, res) => {
    const { code, language } = req.body;
    
    if (!code) {
      return res.status(400).json({ output: "No code provided." });
    }

    if (language === "python" || !language) {
      const tmpFile = path.join(os.tmpdir(), `script_${Date.now()}.py`);
      fs.writeFileSync(tmpFile, code);
      
      // Try python3 first, fallback to python
      exec(`python3 ${tmpFile}`, { timeout: 5000 }, (error, stdout, stderr) => {
        if (error && error.message.includes("command not found")) {
          exec(`python ${tmpFile}`, { timeout: 5000 }, (err2, stdout2, stderr2) => {
            try { fs.unlinkSync(tmpFile); } catch (e) {}
            if (err2) {
              res.json({ output: stderr2 || err2.message });
            } else {
              res.json({ output: stdout2 });
            }
          });
        } else {
          try { fs.unlinkSync(tmpFile); } catch (e) {}
          if (error) {
            res.json({ output: stderr || error.message });
          } else {
            res.json({ output: stdout });
          }
        }
      });
    } else if (language === "javascript") {
      const tmpFile = path.join(os.tmpdir(), `script_${Date.now()}.js`);
      fs.writeFileSync(tmpFile, code);
      
      exec(`node ${tmpFile}`, { timeout: 5000 }, (error, stdout, stderr) => {
        try { fs.unlinkSync(tmpFile); } catch (e) {}
        if (error) {
          res.json({ output: stderr || error.message });
        } else {
          res.json({ output: stdout });
        }
      });
    } else {
      res.status(400).json({ output: "Unsupported language." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: { server: httpServer },
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve("dist/index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
