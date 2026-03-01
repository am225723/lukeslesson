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

interface ConnectedUser {
  socketId: string;
  name: string;
  role: "student" | "instructor";
  color: string;
  joinedAt: string;
}

const connectedUsers: Map<string, ConnectedUser> = new Map();
const typingUsers: Map<string, NodeJS.Timeout> = new Map();

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

    socket.emit("workspace:load", workspaceState);

    socket.on("user:join", (data: { name: string; role: "student" | "instructor" }) => {
      const user: ConnectedUser = {
        socketId: socket.id,
        name: data.name,
        role: data.role,
        color: data.role === "student" ? "#3b82f6" : "#a855f7",
        joinedAt: new Date().toISOString(),
      };
      connectedUsers.set(socket.id, user);
      io.emit("users:update", Array.from(connectedUsers.values()));
    });

    socket.on("user:typing", (isTyping: boolean) => {
      const user = connectedUsers.get(socket.id);
      if (!user) return;

      if (typingUsers.has(socket.id)) {
        clearTimeout(typingUsers.get(socket.id)!);
        typingUsers.delete(socket.id);
      }

      if (isTyping) {
        socket.broadcast.emit("user:typing", { name: user.name, role: user.role, isTyping: true });
        const timeout = setTimeout(() => {
          socket.broadcast.emit("user:typing", { name: user.name, role: user.role, isTyping: false });
          typingUsers.delete(socket.id);
        }, 3000);
        typingUsers.set(socket.id, timeout);
      } else {
        socket.broadcast.emit("user:typing", { name: user.name, role: user.role, isTyping: false });
      }
    });

    socket.on("cursor:move", (data: { line: number; ch: number }) => {
      const user = connectedUsers.get(socket.id);
      if (!user) return;
      socket.broadcast.emit("cursor:move", {
        name: user.name,
        role: user.role,
        color: user.color,
        line: data.line,
        ch: data.ch,
      });
    });

    socket.on("draw:line", (data) => {
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
      connectedUsers.delete(socket.id);
      if (typingUsers.has(socket.id)) {
        clearTimeout(typingUsers.get(socket.id)!);
        typingUsers.delete(socket.id);
      }
      io.emit("users:update", Array.from(connectedUsers.values()));
    });
  });

  // API routes
  app.use(express.json());
  
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/ai-suggestions", async (req, res) => {
    const { goals } = req.body;
    if (!goals || !Array.isArray(goals) || goals.length === 0) {
      return res.status(400).json({ suggestions: [] });
    }
    try {
      const { GoogleGenAI } = await import("@google/genai");
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
      }
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Based on these student learning goals, suggest 4-5 concise talking points an instructor should cover in a tutoring session. Return ONLY a JSON array of strings, each being one talking point (1-2 sentences max).

Goals:
${goals.map((g: string) => `- ${g}`).join("\n")}`,
      });
      const text = response.text || "[]";
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      const suggestions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
      res.json({ suggestions });
    } catch (e) {
      console.error("AI suggestions error:", e);
      res.status(500).json({ error: "Failed to generate suggestions" });
    }
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
        watch: {
          ignored: ['**/.local/**', '**/.cache/**', '**/node_modules/**'],
        },
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
