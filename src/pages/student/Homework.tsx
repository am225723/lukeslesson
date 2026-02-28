import { Check, Link, Bot, PlayCircle, BookOpen, MessageSquare, ArrowRight, MonitorPlay, Star, Trophy, Target, FileText, Download, Sparkles, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Homework() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 overflow-y-auto flex flex-col w-full max-w-md mx-auto pb-24 h-full bg-[#0A0A0A] text-white relative"
    >
      {/* Dark Luxury / Atmospheric Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] bg-blue-600/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-purple-600/20 blur-[100px] rounded-full" />
      </div>
      
      <div className="px-6 pt-10 pb-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-light tracking-tight text-white mb-1">Your <span className="font-bold text-blue-400">Path</span></h1>
            <p className="text-xs font-medium text-white/50 uppercase tracking-widest">Module 5 • AI Ethics</p>
          </div>
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/10 shadow-2xl">
            <img alt="Student Luke" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYA455Ml624fv617DhU--WS50K-YjnfoY-BrSyLzkJofuOp6GqMgggo0VI0Fy7GGlHLpuFcxzsvZpkRgvY8WX7Yx9ltefxVk6C5wlpPnpI2TteJ6FjDkDWUhY64VzCTmjfP76SH_ba7xoY94mO4Wkh1ilCN484FvjQFCF887bSXe1MA8tydGWMR3MbhwQWOTSbzPNsmq6DdsVHTOQbWpG_AGeAJAB2hH4eRmBSQm76x5ObqoNsWOVcHdjd8kcksPjj1Fjzb3urlRk" referrerPolicy="no-referrer" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] relative overflow-hidden"
        >
          <div className="flex justify-between items-end mb-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">Mastery Level</div>
              <div className="text-4xl font-light text-white">85<span className="text-xl text-white/40">%</span></div>
            </div>
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0A0A0A] bg-white/10 flex items-center justify-center backdrop-blur-md">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </div>
              ))}
            </div>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "85%" }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500" 
            />
          </div>
        </motion.div>
      </div>

      <div className="px-6 space-y-6">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Current Focus</h3>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="group relative bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-[2rem] p-6 border border-white/10 hover:border-white/20 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 p-6">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            </div>
            <div className="flex items-start gap-4 mb-4">
              <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/20">
                <Target className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="inline-flex items-center rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-blue-300 mb-2">
                  Due Today
                </span>
                <h4 className="text-xl font-medium text-white tracking-tight">Prompt Practice</h4>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-6">Create 5 variations of a prompt for summarizing meeting notes, focusing on different tones.</p>
            <div className="flex gap-3">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/student/ai-assistant")} 
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-white text-black px-4 py-3 text-xs font-bold uppercase tracking-wider hover:bg-white/90 transition-colors"
              >
                <Bot className="w-4 h-4" />
                Open Coach
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/workspace")} 
                className="inline-flex items-center justify-center w-12 rounded-xl bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-colors"
              >
                <MonitorPlay className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Up Next</h3>
          
          <div className="space-y-3">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/40">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white truncate">Draft Final Outline</h4>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">Due Friday</p>
              </div>
              <Clock className="w-4 h-4 text-white/20" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors opacity-50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <Check className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white truncate line-through">Review AI Ethics</h4>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">Completed</p>
              </div>
            </motion.div>
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Resources</h3>
          <div className="grid grid-cols-2 gap-3">
            <motion.a 
              href="#"
              onClick={(e) => { e.preventDefault(); toast.success("Downloading Prompt Engineering Guide..."); }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-all flex flex-col gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-medium text-white leading-tight">Prompt Guide</h4>
                <p className="text-[9px] text-white/40 uppercase tracking-widest mt-1">PDF • 2.4 MB</p>
              </div>
            </motion.a>
            
            <motion.a 
              href="#"
              onClick={(e) => { e.preventDefault(); toast.success("Opening Video Lecture..."); }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-all flex flex-col gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <PlayCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-medium text-white leading-tight">Intro to LLMs</h4>
                <p className="text-[9px] text-white/40 uppercase tracking-widest mt-1">Video • 45 Min</p>
              </div>
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

