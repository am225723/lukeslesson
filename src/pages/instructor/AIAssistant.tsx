import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, MessageSquare, Plus, ArrowLeft, Loader2, Zap, Target, Brain, ShieldCheck, Cpu, Globe, Terminal, Settings, Share2, Maximize2, X, ArrowUp, ThumbsUp, ThumbsDown, ChevronRight, PlusCircle, MonitorPlay } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { chatWithAssistant } from "@/lib/gemini";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

export default function AIAssistant() {
  const navigate = useNavigate();
  const location = useLocation();
  const isStudent = location.pathname.startsWith("/student");

  const getInitialMessages = (): Message[] => {
    if (isStudent) {
      return [
        {
          id: "1",
          role: "assistant",
          content: "Hey Luke! I'm your AI learning coach. I can help you understand topics, practice concepts, or prepare for your session with Aleixander. What would you like to work on today?",
          timestamp: "10:23 AM"
        }
      ];
    }
    return [
      {
        id: "1",
        role: "assistant",
        content: "Hello Aleixander! I've analyzed the resources for your meeting with Luke. I'm ready to help with lesson plans, AI topics, or homework generation. What would you like to focus on?",
        timestamp: "10:23 AM"
      },
      {
        id: "2",
        role: "user",
        content: "Can you suggest a practical exercise for explaining Work Automation to a beginner student using Google Pro tools?",
        timestamp: "10:25 AM"
      },
      {
        id: "3",
        role: "assistant",
        content: "Based on the **\"Work Automation Agents\"** module, a \"Report Generator\" activity is recommended.\n\nAsk the student to run the Python script in the Workspace to automate a mock report. This builds intuition for how AI agents handle data entry and email sorting.",
        timestamp: "10:26 AM"
      }
    ];
  };

  const [messages, setMessages] = useState<Message[]>(getInitialMessages());
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Format history for Gemini
      const history = messages.map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }));

      const studentSubmissionContext = `Luke's current code submission for 'automation_agent.py':
import json
import antigravity

def generate_report(data):
    print("Initializing Google Pro tools...")
    print("Connecting to Jules.google & AI Studio...")
    
    report = {
        "status": "success",
        "tasks_automated": len(data),
        "insights": "Gemini personalized for your business.",
        "tools_used": ["stitch.withgoogle", "flutter", "Codex"]
    }
    
    return json.dumps(report, indent=2)`;

      const response = await chatWithAssistant(history, userMessage.content, studentSubmissionContext);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response || "I'm sorry, I couldn't process that request.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col w-full max-w-md mx-auto bg-slate-950 h-full relative overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="px-6 pt-10 pb-4 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <motion.button 
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)} 
            className="p-3 bg-slate-900 rounded-2xl text-slate-400 hover:text-white border border-slate-800 transition-all shadow-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div className="flex flex-col items-center">
            <h1 className="text-xl font-black text-white font-display uppercase tracking-[0.2em]">AI Intelligence</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Link Active</span>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 bg-slate-900 rounded-2xl text-slate-400 hover:text-white border border-slate-800 transition-all shadow-xl"
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { icon: Brain, label: "Logic", color: "text-blue-400", bg: "bg-blue-400/10" },
            { icon: ShieldCheck, label: "Safety", color: "text-emerald-400", bg: "bg-emerald-400/10" },
            { icon: Cpu, label: "Compute", color: "text-purple-400", bg: "bg-purple-400/10" },
            { icon: Globe, label: "Context", color: "text-amber-400", bg: "bg-amber-400/10" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-2 p-3 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl"
            >
              <div className={cn("p-2 rounded-xl", stat.bg)}>
                <stat.icon className={cn("w-4 h-4", stat.color)} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 space-y-6 relative z-10 pb-4">
        {messages.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-blue-600/20 blur-3xl rounded-full animate-pulse" />
              <div className="relative w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center border-2 border-slate-800 shadow-2xl rotate-6 group hover:rotate-0 transition-transform duration-500">
                <Bot className="w-12 h-12 text-blue-500" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-slate-950 shadow-lg">
                <Zap className="w-4 h-4 text-slate-950 fill-current" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-white mb-3 font-display tracking-tight">System Initialized</h2>
            <p className="text-slate-500 text-sm font-bold leading-relaxed max-w-[240px] mx-auto uppercase tracking-wider">
              Ready to optimize your teaching workflow. How can I assist you today?
            </p>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id} 
              className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-xl relative overflow-hidden",
                msg.role === "assistant" ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white" : "bg-slate-800 text-slate-400 border border-slate-700"
              )}>
                {msg.role === "assistant" ? <Bot className="w-5 h-5" /> : <span className="text-xs font-black">U</span>}
              </div>
              <div className={`flex flex-col gap-2 max-w-[80%] ${msg.role === "user" ? "items-end" : ""}`}>
                <div className={cn(
                  "p-4 text-sm font-medium leading-relaxed shadow-xl",
                  msg.role === "user" ? "bg-blue-600 text-white rounded-[1.5rem] rounded-tr-sm" : "bg-slate-900 border border-slate-800 text-blue-50 rounded-[1.5rem] rounded-tl-sm"
                )}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mx-2">{msg.timestamp}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-xl text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-[1.5rem] rounded-tl-sm flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 bg-slate-950/50 backdrop-blur-xl border-t border-slate-900 relative z-20">
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          {(isStudent ? [
            { icon: Target, label: "My Goals", text: "Help me refine my learning goals for the next session." },
            { icon: Zap, label: "Practice", text: "Give me a quick practice exercise on AI automation." },
            { icon: MessageSquare, label: "Explain", text: "Explain how work automation agents work in simple terms." }
          ] : [
            { icon: Target, label: "Session Goals", text: "What are the learning goals for my next session?" },
            { icon: Zap, label: "Quick Quiz", text: "Generate a 5-question quiz on AI ethics." },
            { icon: MessageSquare, label: "Feedback", text: "Draft feedback for Luke's latest project." }
          ]).map((action, i) => (
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
              whileTap={{ scale: 0.95 }}
              key={i}
              onClick={() => { setInput(action.text); handleSend(); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl whitespace-nowrap text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-400 transition-all shadow-lg"
            >
              <action.icon className="w-3.5 h-3.5" />
              {action.label}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-3 bg-slate-900 rounded-[2rem] border-2 border-slate-800 p-2 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/10 transition-all shadow-2xl">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Command the AI..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold px-4 outline-none text-white placeholder:text-slate-600"
          />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="h-12 w-12 rounded-[1.5rem] bg-blue-600 text-white flex items-center justify-center disabled:opacity-50 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
