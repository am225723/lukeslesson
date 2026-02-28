import { Calendar, Sparkles, Brain, AlertTriangle, Code, FileText, File, Play, ArrowLeft, MoreHorizontal, Share2, Download, Terminal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export default function LessonPlan() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 overflow-y-auto flex flex-col w-full max-w-md mx-auto pb-24 h-full bg-[#0A0A0A] text-white relative"
    >
      {/* Dark Luxury / Atmospheric Background */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-600/10 via-[#0A0A0A] to-transparent -z-10 pointer-events-none" />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-20 -right-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] -z-10 pointer-events-none"
      />

      <div className="px-6 pt-10 pb-6 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <motion.button 
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)} 
            className="p-3 bg-white/5 rounded-2xl text-white/60 hover:text-white border border-white/10 shadow-sm transition-all backdrop-blur-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div className="flex items-center gap-2">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 bg-white/5 rounded-2xl text-white/60 hover:text-blue-400 border border-white/10 shadow-sm transition-all backdrop-blur-md"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 bg-white/5 rounded-2xl text-white/60 hover:text-white border border-white/10 shadow-sm transition-all backdrop-blur-md"
            >
              <MoreHorizontal className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 border border-blue-500/30 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-blue-300 mb-6 shadow-lg shadow-blue-500/10">
            <Calendar className="w-3.5 h-3.5" />
            <span>Today • 2:00 PM</span>
          </div>
          <h1 className="text-4xl font-light leading-none tracking-tighter text-white mb-4">
            AI in Daily <br />
            <span className="font-bold text-blue-400">Workflows</span>
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border border-white/20 bg-black overflow-hidden shadow-sm">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Attendee" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
              Advanced Session • 4 Attendees
            </p>
          </div>
        </motion.div>
      </div>

      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Talking Points</h3>
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-blue-500/30"
          >
            <Sparkles className="w-3 h-3" /> AI Optimized
          </motion.span>
        </div>

        <div className="space-y-4">
          {[
            { icon: Sparkles, color: "blue", title: "Personalizing Gemini & Gems", desc: "Teach Gemini about your business and create custom Gems/Opal for specific tasks." },
            { icon: Brain, color: "purple", title: "Work Automation Agents", desc: "Automate report making and launch apps using free Google Pro resources." },
            { icon: Code, color: "orange", title: "Code Assistants & Integration", desc: "Using Jules.google, Codex, and integrating with Windows/Microsoft workflows." }
          ].map((point, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ x: 5, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              className="group flex gap-5 p-6 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 shadow-sm hover:border-white/20 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className={cn(
                "flex items-center justify-center w-12 h-12 rounded-2xl shrink-0 mt-0.5 border",
                point.color === "blue" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : 
                point.color === "purple" ? "bg-purple-500/20 text-purple-400 border-purple-500/30" : "bg-orange-500/20 text-orange-400 border-orange-500/30"
              )}>
                <point.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-medium text-white mb-1 tracking-tight group-hover:text-blue-400 transition-colors">{point.title}</h4>
                <p className="text-sm font-medium text-white/50 leading-relaxed">{point.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="px-6 py-6">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-6">Interactive Demo</h3>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-[60px] -z-0 group-hover:scale-125 transition-transform duration-700" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-black/40 border border-white/10 text-blue-400 shrink-0">
                <Terminal className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-xl font-medium text-white tracking-tight">Automation Script</h4>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">Python • Google Pro Tools</p>
              </div>
            </div>
            <p className="text-sm font-medium text-white/60 mb-8 leading-relaxed">
              Execute a real-time report generation script to demonstrate the power of AI agents in the workspace.
            </p>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/workspace")}
              className="flex items-center justify-center gap-3 w-full text-sm font-bold uppercase tracking-widest text-black bg-white px-6 py-5 rounded-[2rem] shadow-xl hover:bg-white/90 transition-all"
            >
              <Play className="w-5 h-5 fill-current" />
              Launch Environment
            </motion.button>
          </div>
        </motion.div>
      </div>

      <div className="px-6 py-6">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-6">Resources</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: FileText, color: "red", name: "AI_Overview.pdf", size: "2.4 MB" },
            { icon: File, color: "blue", name: "Workshop_Notes.docx", size: "840 KB" }
          ].map((doc, i) => (
            <motion.a 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              whileHover={{ y: -5, borderColor: doc.color === 'red' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(59, 130, 246, 0.4)' }}
              className="flex flex-col p-5 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 shadow-sm transition-all group hover:bg-white/10" 
              href="#"
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all border",
                doc.color === 'red' ? 'bg-red-500/20 text-red-400 border-red-500/30 group-hover:bg-red-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30 group-hover:bg-blue-500/30'
              )}>
                <doc.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-white line-clamp-1 tracking-tight mb-1">{doc.name}</span>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{doc.size}</span>
                <Download className="w-3 h-3 text-white/30 group-hover:text-white transition-colors" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
