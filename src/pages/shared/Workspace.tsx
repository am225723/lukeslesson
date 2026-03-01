import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { Stage, Layer, Line } from "react-konva";
import { Play, Bot, AlertTriangle, Code2, PenTool, Eraser, Loader2, MessageSquare, ArrowUp, Save, Download, ClipboardList, CheckCircle2, Sparkles, Briefcase, FileSpreadsheet, X, Terminal, Maximize2, Settings, Share2, Users, Circle } from "lucide-react";
import { chatWithAssistant } from "@/lib/gemini";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface DrawLine {
  tool: string;
  points: number[];
  color: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "instructor" | "ai";
  text: string;
  timestamp: string;
  role?: "student" | "instructor";
  senderName?: string;
}

interface ConnectedUser {
  socketId: string;
  name: string;
  role: "student" | "instructor";
  color: string;
  joinedAt: string;
}

interface TypingIndicator {
  name: string;
  role: "student" | "instructor";
  isTyping: boolean;
}

interface RemoteCursor {
  name: string;
  role: string;
  color: string;
  line: number;
  ch: number;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  goal: string;
  template: string;
}

const ACTIVITIES: Activity[] = [
  {
    id: "automation-1",
    title: "Automated Email Drafter",
    description: "Create a script that takes a list of customer issues and drafts personalized responses using a template.",
    goal: "The script should output 3 unique email drafts based on the provided customer data.",
    template: `import json

customers = [
    {"name": "Alice", "issue": "Late delivery", "tone": "Professional"},
    {"name": "Bob", "issue": "Broken item", "tone": "Empathetic"},
    {"name": "Charlie", "issue": "Billing error", "tone": "Urgent"}
]

def draft_emails(data):
    # TODO: Implement email drafting logic
    for customer in data:
        print(f"Drafting for {customer['name']}...")
        # Hint: Use string formatting to create the draft
    
draft_emails(customers)`
  },
  {
    id: "gemini-1",
    title: "Business Persona Builder",
    description: "Define a specialized AI persona for a boutique coffee shop. The persona should be friendly, knowledgeable about beans, and slightly poetic.",
    goal: "Test your persona by asking it to describe a 'Dark Roast Espresso'.",
    template: `# In this activity, you'll use the @AI chat to test your persona.
# First, write your persona definition below as a comment, 
# then copy it and send it to @AI in the Chat tab.

# PERSONA DEFINITION:
# "You are a master barista at 'The Velvet Bean'..."
`
  },
  {
    id: "integration-1",
    title: "Data Sync Simulation",
    description: "Simulate syncing data between a local Windows file and a cloud-based Google Sheet.",
    goal: "Print a success message for each record synced, including a timestamp.",
    template: `import datetime

local_records = [
    {"id": 101, "value": 500},
    {"id": 102, "value": 750}
]

def sync_to_cloud(records):
    print(f"Starting sync at {datetime.datetime.now()}")
    # TODO: Loop through records and 'sync' them
    pass

sync_to_cloud(local_records)`
  }
];

export default function Workspace() {
  const [activeTab, setActiveTab] = useState<"code" | "whiteboard" | "chat" | "activities">("code");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [showContextModal, setShowContextModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
  const [typingIndicators, setTypingIndicators] = useState<Map<string, TypingIndicator>>(new Map());
  const [remoteCursors, setRemoteCursors] = useState<Map<string, RemoteCursor>>(new Map());
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [settings, setSettings] = useState({
    theme: "dark",
    fontSize: 14,
    autoSave: true,
  });
  const [businessContext, setBusinessContext] = useState({
    companyName: "Acme Corp",
    industry: "E-commerce",
    tone: "Professional yet friendly"
  });

  const userRole = window.location.pathname.includes("instructor") ? "instructor" : "student";
  const userName = userRole === "student" ? "Luke" : "Aleixander";

  // Code Editor State
  const [code, setCode] = useState(`import json

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
print(generate_report(tasks))`);
  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [isDebugging, setIsDebugging] = useState(false);
  const [aiFeedback, setAiFeedback] = useState("");

  // Whiteboard State
  const [lines, setLines] = useState<DrawLine[]>([]);
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#2563eb");
  const isDrawing = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 300, height: 400 });

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsConnected(true);
      newSocket.emit("user:join", { name: userName, role: userRole });
    });
    newSocket.on("disconnect", () => setIsConnected(false));

    newSocket.on("workspace:load", (state: any) => {
      if (state.code) setCode(state.code);
      if (state.lines) setLines(state.lines);
      if (state.chat) setChatMessages(state.chat);
    });

    newSocket.on("users:update", (users: ConnectedUser[]) => {
      setConnectedUsers(users);
    });

    newSocket.on("user:typing", (data: TypingIndicator) => {
      setTypingIndicators(prev => {
        const next = new Map(prev);
        if (data.isTyping) {
          next.set(data.name, data);
        } else {
          next.delete(data.name);
        }
        return next;
      });
    });

    newSocket.on("cursor:move", (data: RemoteCursor) => {
      setRemoteCursors(prev => {
        const next = new Map(prev);
        next.set(data.name, data);
        return next;
      });
    });

    newSocket.on("draw:sync", (newLines: DrawLine[]) => {
      setLines(newLines);
    });

    newSocket.on("draw:clear", () => {
      setLines([]);
    });

    newSocket.on("code:update", (newCode: string) => {
      setCode(newCode);
    });

    newSocket.on("chat:message", (msg: ChatMessage) => {
      setChatMessages((prev) => [...prev, msg]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    if (activeTab === "whiteboard") {
      updateSize();
      window.addEventListener("resize", updateSize);
      return () => window.removeEventListener("resize", updateSize);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "chat") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, activeTab]);

  const emitTyping = useCallback((isTyping: boolean) => {
    if (!socket) return;
    socket.emit("user:typing", isTyping);
  }, [socket]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    if (socket) {
      socket.emit("code:update", newCode);
      const textarea = e.currentTarget;
      const textBeforeCursor = textarea.value.substring(0, textarea.selectionStart);
      const lineNumber = textBeforeCursor.split("\n").length;
      const ch = textBeforeCursor.split("\n").pop()?.length || 0;
      socket.emit("cursor:move", { line: lineNumber, ch });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const value = e.currentTarget.value;
      const newValue = value.substring(0, start) + "    " + value.substring(end);
      setCode(newValue);
      
      // Reset cursor position
      setTimeout(() => {
        if (e.currentTarget) {
          e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 4;
        }
      }, 0);
      
      if (socket) {
        socket.emit("code:update", newValue);
      }
    }
  };

  const executeCode = async () => {
    setIsExecuting(true);
    setOutput("");
    setAiFeedback("");
    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: "python" })
      });
      const data = await response.json();
      setOutput(data.output || "Execution completed with no output.");
    } catch (error) {
      setOutput("Error executing code. Please check your connection.");
    } finally {
      setIsExecuting(false);
    }
  };

  const debugCode = async () => {
    setIsDebugging(true);
    try {
      const prompt = `I ran the following Python code:\n\n${code}\n\nAnd got this output/error:\n\n${output}\n\nPlease help me debug this. Provide a clear explanation of what went wrong (or how to optimize it if it succeeded), and suggest the corrected code.`;
      const response = await chatWithAssistant([], prompt, "");
      setAiFeedback(response || "I couldn't generate feedback.");
    } catch (error) {
      setAiFeedback("Error connecting to AI Assistant.");
    } finally {
      setIsDebugging(false);
    }
  };

  const handleClearWhiteboard = () => {
    setLines([]);
    if (socket) {
      socket.emit("draw:clear");
    }
  };

  const handleSaveState = () => {
    if (socket) {
      socket.emit("workspace:save", { code, lines, chat: chatMessages });
      toast.success("Workspace state saved to server memory!");
    }
  };

  const handleLoadState = () => {
    toast.info("Workspace state is automatically loaded when you connect.");
  };

  const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatInput(e.target.value);
    if (socket) {
      emitTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => emitTyping(false), 2000);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !socket) return;

    emitTyping(false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: userRole === "instructor" ? "instructor" : "user",
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      role: userRole as "student" | "instructor",
      senderName: userName,
    };

    setChatMessages(prev => [...prev, userMsg]);
    socket.emit("chat:message", userMsg);
    setChatInput("");

    // Check if message is directed to AI
    if (userMsg.text.toLowerCase().includes("@ai")) {
      setIsChatLoading(true);
      try {
        const history = chatMessages.map(m => ({
          role: m.sender === "ai" ? "model" : "user",
          parts: [{ text: m.text }]
        }));
        const context = `Current Workspace Code:\n${code}\n\nBusiness Context (Personalization):\nCompany: ${businessContext.companyName}\nIndustry: ${businessContext.industry}\nTone: ${businessContext.tone}\n\nPlease tailor your responses to fit this business context.`;
        const response = await chatWithAssistant(history as any, userMsg.text, context);
        
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: response || "I'm sorry, I couldn't process that.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setChatMessages(prev => [...prev, aiMsg]);
        socket.emit("chat:message", aiMsg);
      } catch (error) {
        console.error("AI Chat Error:", error);
      } finally {
        setIsChatLoading(false);
      }
    }
  };

  // Whiteboard Handlers
  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, color, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    
    const newLines = lines.slice(0, lines.length - 1).concat(lastLine);
    setLines(newLines);
    
    if (socket) {
      socket.emit("draw:sync", newLines);
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleLoadActivity = (activity: Activity) => {
    if (confirm("This will replace your current code. Continue?")) {
      setCode(activity.template);
      setActiveTab("code");
      if (socket) {
        socket.emit("code:update", activity.template);
      }
    }
  };

  const toggleActivityCompletion = (id: string) => {
    setCompletedActivities(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleExportCsv = () => {
    if (!output) {
      toast.error("No output to export.");
      return;
    }
    const blob = new Blob([output], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "workspace_output.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV exported successfully!");
  };

  const handleSyncMicrosoft = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Simulating connection to Microsoft 365...',
        success: 'Workspace is now synced with your OneDrive and Microsoft Teams.',
        error: 'Failed to sync',
      }
    );
  };

  return (
    <div className="flex-1 flex flex-col w-full max-w-5xl mx-auto bg-slate-950 h-full relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
      
      <AnimatePresence>
        {showContextModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-6 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col border border-slate-800"
            >
              <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                <div className="flex items-center gap-3 text-white font-black uppercase tracking-widest text-xs">
                  <div className="p-2 bg-blue-600/20 rounded-xl">
                    <Briefcase className="w-4 h-4 text-blue-400" />
                  </div>
                  Business Context
                </div>
                <button onClick={() => setShowContextModal(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 flex flex-col gap-5">
                <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-wider">
                  Personalize Gemini by defining your business context. The AI will use this to tailor its responses and code generation.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2">Company Name</label>
                    <input 
                      type="text" 
                      value={businessContext.companyName}
                      onChange={(e) => setBusinessContext({...businessContext, companyName: e.target.value})}
                      className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2">Industry</label>
                    <input 
                      type="text" 
                      value={businessContext.industry}
                      onChange={(e) => setBusinessContext({...businessContext, industry: e.target.value})}
                      className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2">Preferred Tone</label>
                    <input 
                      type="text" 
                      value={businessContext.tone}
                      onChange={(e) => setBusinessContext({...businessContext, tone: e.target.value})}
                      className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-bold"
                    />
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowContextModal(false)}
                  className="w-full mt-2 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] py-4 rounded-2xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                >
                  Save Configuration
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettingsModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-6 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col border border-slate-800"
            >
              <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                <div className="flex items-center gap-3 text-white font-black uppercase tracking-widest text-xs">
                  <div className="p-2 bg-slate-800 rounded-xl">
                    <Settings className="w-4 h-4 text-slate-400" />
                  </div>
                  Workspace Settings
                </div>
                <button onClick={() => setShowSettingsModal(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 flex flex-col gap-5">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2">Theme</label>
                    <select 
                      value={settings.theme}
                      onChange={(e) => setSettings({...settings, theme: e.target.value})}
                      className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-bold appearance-none"
                    >
                      <option value="dark">Dark Mode</option>
                      <option value="light">Light Mode</option>
                      <option value="system">System Default</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2">Font Size (px)</label>
                    <input 
                      type="number" 
                      value={settings.fontSize}
                      onChange={(e) => setSettings({...settings, fontSize: parseInt(e.target.value) || 14})}
                      className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-bold"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Auto Save</label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={settings.autoSave}
                        onChange={(e) => setSettings({...settings, autoSave: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowSettingsModal(false);
                    toast.success("Settings saved successfully");
                  }}
                  className="w-full mt-2 bg-slate-800 text-white font-black text-xs uppercase tracking-[0.2em] py-4 rounded-2xl hover:bg-slate-700 transition-colors shadow-lg shadow-slate-900/20"
                >
                  Apply Changes
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-6 pt-8 pb-4 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black leading-tight tracking-tight text-white font-display">
              Dev <span className="text-blue-500">Workspace</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className={cn("w-2 h-2 rounded-full animate-pulse", isConnected ? "bg-emerald-500" : "bg-red-500")} />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                {isConnected ? "Live Session Active" : "Connecting..."}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {connectedUsers.length > 0 && (
              <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-2xl px-3 py-2">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <div className="flex -space-x-2">
                  {connectedUsers.map((user) => (
                    <div
                      key={user.socketId}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black text-white border-2 border-slate-950 relative"
                      style={{ backgroundColor: user.color }}
                      title={`${user.name} (${user.role})`}
                    >
                      {user.name[0]}
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950" />
                    </div>
                  ))}
                </div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  {connectedUsers.length} online
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <motion.button 
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowContextModal(true)} 
              className="p-3 bg-slate-900 rounded-2xl text-slate-400 hover:text-blue-400 border border-slate-800 transition-all shadow-xl"
            >
              <Briefcase className="w-4 h-4" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.9 }}
              onClick={handleSyncMicrosoft} 
              className="p-3 bg-slate-900 rounded-2xl text-slate-400 hover:text-blue-400 border border-slate-800 transition-all shadow-xl"
            >
              <FileSpreadsheet className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
        
        <div className="flex p-1.5 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl">
          {[
            { id: "code", icon: Code2, label: "Code" },
            { id: "whiteboard", icon: PenTool, label: "Board" },
            { id: "chat", icon: MessageSquare, label: "Chat" },
            { id: "activities", icon: ClipboardList, label: "Tasks" }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all relative",
                activeTab === tab.id ? "text-white" : "text-slate-500 hover:text-slate-300"
              )}
            >
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="active-tab-bg"
                  className="absolute inset-0 bg-blue-600 rounded-xl -z-10 shadow-lg shadow-blue-600/20"
                />
              )}
              <tab.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col px-6 pb-24 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === "code" && (
            <motion.div 
              key="code-tab"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col gap-4 h-full"
            >
              <div className="flex-1 bg-slate-900/80 backdrop-blur-md rounded-3xl p-5 shadow-2xl border border-slate-800 relative flex flex-col overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-50" />
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600/10 rounded-lg">
                      <Terminal className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">main.py</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setShowSettingsModal(true)}
                      className="p-2 text-slate-500 hover:text-white transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={executeCode}
                      disabled={isExecuting}
                      className="flex items-center gap-2 bg-emerald-500 text-slate-950 hover:bg-emerald-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20"
                    >
                      {isExecuting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      Run
                    </motion.button>
                  </div>
                </div>
                <textarea
                  value={code}
                  onChange={handleCodeChange}
                  onKeyDown={handleKeyDown}
                  style={{ fontSize: `${settings.fontSize}px` }}
                  className="flex-1 w-full bg-transparent text-blue-100 font-mono resize-none outline-none leading-relaxed selection:bg-blue-500/30"
                  spellCheck={false}
                />
              </div>

              {(output || aiFeedback) && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-1/3 min-h-[180px] bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl p-5 flex flex-col overflow-hidden"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-slate-700" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Console Output</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={handleExportCsv}
                        className="p-2 text-slate-500 hover:text-blue-400 transition-colors"
                        title="Export CSV"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => { setOutput(""); setAiFeedback(""); }}
                        className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                        title="Clear"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {output && !aiFeedback && (
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={debugCode}
                          disabled={isDebugging}
                          className="flex items-center gap-2 text-blue-400 bg-blue-400/10 hover:bg-blue-400/20 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-blue-400/20"
                        >
                          {isDebugging ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bot className="w-3.5 h-3.5" />}
                          Debug
                        </motion.button>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto">
                    {output && !aiFeedback && (
                      <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">{output}</pre>
                    )}

                    {aiFeedback && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-blue-100 bg-blue-600/10 p-4 rounded-2xl border border-blue-600/20"
                      >
                        <div className="flex items-center gap-2 mb-3 text-blue-400 font-black uppercase tracking-widest text-[10px]">
                          <Bot className="w-4 h-4" /> AI Diagnostics
                        </div>
                        <div className="whitespace-pre-wrap leading-relaxed font-medium">{aiFeedback}</div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === "whiteboard" && (
            <motion.div 
              key="whiteboard-tab"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col gap-4 h-full"
            >
              <div className="flex items-center gap-3 bg-slate-900/80 backdrop-blur-xl p-3 rounded-2xl border border-slate-800 shadow-2xl">
                <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800">
                  <button 
                    onClick={() => setTool("pen")}
                    className={cn(
                      "p-2.5 rounded-lg transition-all",
                      tool === "pen" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    <PenTool className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setTool("eraser")}
                    className={cn(
                      "p-2.5 rounded-lg transition-all",
                      tool === "eraser" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    <Eraser className="w-5 h-5" />
                  </button>
                </div>
                <div className="w-px h-8 bg-slate-800 mx-1" />
                <div className="flex gap-2">
                  {["#3b82f6", "#ef4444", "#10b981", "#ffffff"].map(c => (
                    <button
                      key={c}
                      onClick={() => { setColor(c); setTool("pen"); }}
                      className={cn(
                        "w-7 h-7 rounded-full border-2 transition-all hover:scale-110",
                        color === c && tool === "pen" ? "border-white scale-110 shadow-lg shadow-white/10" : "border-transparent"
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="flex-1" />
                <button 
                  onClick={handleClearWhiteboard}
                  className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-400/10 px-4 py-2 rounded-xl transition-all"
                >
                  Clear
                </button>
              </div>
              
              <div ref={containerRef} className="flex-1 bg-white rounded-[2.5rem] border-4 border-slate-900 shadow-2xl overflow-hidden touch-none relative">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50" />
                <Stage
                  width={stageSize.width}
                  height={stageSize.height}
                  onMouseDown={handleMouseDown}
                  onMousemove={handleMouseMove}
                  onMouseup={handleMouseUp}
                  onTouchStart={(e) => {
                    e.evt.preventDefault();
                    handleMouseDown(e);
                  }}
                  onTouchMove={(e) => {
                    e.evt.preventDefault();
                    handleMouseMove(e);
                  }}
                  onTouchEnd={handleMouseUp}
                >
                  <Layer>
                    {lines.map((line, i) => (
                      <Line
                        key={i}
                        points={line.points}
                        stroke={line.tool === "eraser" ? "#ffffff" : line.color}
                        strokeWidth={line.tool === "eraser" ? 30 : 4}
                        tension={0.5}
                        lineCap="round"
                        lineJoin="round"
                        globalCompositeOperation={
                          line.tool === "eraser" ? "destination-out" : "source-over"
                        }
                      />
                    ))}
                  </Layer>
                </Stage>
              </div>
            </motion.div>
          )}

          {activeTab === "chat" && (
            <motion.div 
              key="chat-tab"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col gap-4 h-full bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="text-center py-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 bg-slate-950 px-4 py-2 rounded-full border border-slate-800">
                    Encrypted Session
                  </span>
                  <p className="text-[11px] font-bold text-slate-400 mt-4">Mention <span className="text-blue-400">@AI</span> for intelligent assistance.</p>
                </div>
                
                {chatMessages.map((msg) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id} 
                    className={`flex gap-4 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xl relative overflow-hidden",
                      msg.sender === "ai" ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white" : 
                      msg.sender === "instructor" ? "bg-purple-600 text-white" : "bg-slate-800 text-slate-400 border border-slate-700"
                    )}>
                      {msg.sender === "ai" ? <Bot className="w-5 h-5" /> : <span className="text-xs font-black">{msg.senderName ? msg.senderName[0] : msg.sender[0].toUpperCase()}</span>}
                    </div>
                    <div className={`flex flex-col gap-2 max-w-[80%] ${msg.sender === "user" ? "items-end" : ""}`}>
                      {msg.senderName && (
                        <div className={`flex items-center gap-2 mx-2 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                          <span className="text-[10px] font-black text-slate-400">{msg.senderName}</span>
                          <span className={cn(
                            "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                            msg.role === "instructor" ? "bg-purple-500/20 text-purple-400" : "bg-blue-500/20 text-blue-400"
                          )}>
                            {msg.role === "instructor" ? "Instructor" : "Student"}
                          </span>
                        </div>
                      )}
                      <div className={cn(
                        "p-4 text-sm font-medium leading-relaxed shadow-xl",
                        msg.sender === "user" ? "bg-blue-600 text-white rounded-[1.5rem] rounded-tr-sm" : 
                        msg.sender === "ai" ? "bg-slate-800 border border-slate-700 text-blue-50 rounded-[1.5rem] rounded-tl-sm" :
                        "bg-slate-800 border border-slate-700 text-slate-200 rounded-[1.5rem] rounded-tl-sm"
                      )}>
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mx-2">{msg.timestamp}</span>
                    </div>
                  </motion.div>
                ))}
                {Array.from(typingIndicators.values()).map((indicator) => (
                  <motion.div
                    key={`typing-${indicator.name}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center gap-3 px-2"
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-black text-white"
                      style={{ backgroundColor: indicator.role === "instructor" ? "#a855f7" : "#3b82f6" }}
                    >
                      {indicator.name[0]}
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-800/60 border border-slate-700/50 px-3 py-2 rounded-full">
                      <span className="text-[10px] font-bold text-slate-400">{indicator.name} is typing</span>
                      <div className="flex gap-0.5">
                        <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" />
                        <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                        <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isChatLoading && (
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-xl text-white">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div className="bg-slate-800 border border-slate-700 p-4 rounded-[1.5rem] rounded-tl-sm flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              
              <div className="p-5 bg-slate-950/50 border-t border-slate-800">
                <div className="flex items-center gap-3 bg-slate-900 rounded-2xl border-2 border-slate-800 p-2 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/10 transition-all">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={handleChatInputChange}
                    onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                    placeholder="Type a message or @AI..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold px-3 outline-none text-white placeholder:text-slate-600"
                  />
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendChatMessage}
                    disabled={!chatInput.trim() || isChatLoading}
                    className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center disabled:opacity-50 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                  >
                    <ArrowUp className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "activities" && (
            <motion.div 
              key="activities-tab"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col gap-4 h-full overflow-y-auto pb-4"
            >
              <div className="bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-800 shadow-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-600/20 rounded-2xl">
                    <ClipboardList className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white font-display uppercase tracking-tight">Learning Tasks</h2>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Master AI Automation</p>
                  </div>
                </div>
                
                <div className="space-y-5">
                  {ACTIVITIES.map((activity) => (
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      key={activity.id} 
                      className={cn(
                        "p-6 rounded-[2rem] border-2 transition-all duration-300",
                        completedActivities.includes(activity.id) 
                          ? "bg-emerald-500/5 border-emerald-500/30" 
                          : "bg-slate-950 border-slate-800 hover:border-blue-500/50"
                      )}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className={cn(
                          "font-black text-lg font-display tracking-tight",
                          completedActivities.includes(activity.id) ? "text-emerald-400" : "text-white"
                        )}>
                          {activity.title}
                        </h3>
                        <button onClick={() => toggleActivityCompletion(activity.id)}>
                          <CheckCircle2 className={cn(
                            "w-6 h-6 transition-all",
                            completedActivities.includes(activity.id) ? "text-emerald-500 fill-emerald-500/10" : "text-slate-700 hover:text-slate-500"
                          )} />
                        </button>
                      </div>
                      <p className="text-xs font-bold text-slate-400 mb-6 leading-relaxed uppercase tracking-wider">{activity.description}</p>
                      <div className="bg-slate-900 rounded-2xl p-4 mb-6 border border-slate-800">
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 block mb-2">Objective</span>
                        <p className="text-xs font-bold text-slate-300 leading-relaxed">{activity.goal}</p>
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.02, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleLoadActivity(activity)}
                        className="w-full py-3.5 bg-slate-900 border-2 border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-all flex items-center justify-center gap-3"
                      >
                        <Code2 className="w-4 h-4" />
                        Load Template
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-900/40 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -z-10 group-hover:scale-150 transition-transform duration-700" />
                <div className="flex items-center gap-5 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xl border border-white/20">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl font-display tracking-tight">Need a challenge?</h3>
                    <p className="text-xs font-bold text-blue-100 uppercase tracking-widest mt-1">Ask @AI for a custom task!</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
