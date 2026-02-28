import { CheckCircle2, CheckSquare, Sparkles, Download, ArrowLeft, Share2, Trophy, Target, TrendingUp, Clock, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export default function SessionSummary() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 overflow-y-auto flex flex-col w-full max-w-md mx-auto h-full bg-[#0A0A0A] text-white pb-24 relative"
    >
      {/* Dark Luxury / Atmospheric Background */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-blue-600/10 to-transparent -z-10 pointer-events-none" />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-20 -left-20 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] -z-10 pointer-events-none"
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
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 bg-white/5 rounded-2xl text-white/60 hover:text-blue-400 border border-white/10 shadow-sm transition-all backdrop-blur-md"
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center mb-10"
        >
          <div className="relative mb-6">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 border border-dashed border-blue-500/30 rounded-full"
            />
            <div className="h-20 w-20 flex items-center justify-center rounded-[2rem] bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-xl shadow-blue-600/20 relative z-10 backdrop-blur-md">
              <Trophy className="w-10 h-10" />
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-2">Session Complete</p>
            <h1 className="text-4xl font-light leading-none tracking-tighter text-white mb-4">
              Mission <br />
              <span className="font-bold text-blue-400">Accomplished</span>
            </h1>
            <div className="flex items-center justify-center gap-4 text-white/40 text-[10px] font-bold uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Feb 24</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 45m Session</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="px-6 grid grid-cols-2 gap-4 mb-10">
        {[
          { icon: TrendingUp, label: "Participation", value: "92%", color: "emerald" },
          { icon: Target, label: "Topics Mastered", value: "3/3", color: "blue" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 shadow-sm flex flex-col items-center justify-center text-center group hover:border-white/20 hover:bg-white/10 transition-all"
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center mb-3 border",
              stat.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            )}>
              <stat.icon className="w-5 h-5" />
            </div>
            <span className="text-3xl font-medium text-white tracking-tighter mb-1">{stat.value}</span>
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{stat.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="px-6 mb-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Curriculum Coverage</h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/30">
            100% Complete
          </span>
        </div>
        
        <div className="space-y-4">
          {[
            { title: "AI Workflow Automation", desc: "Learned how to set up basic triggers." },
            { title: "Document Summarization", desc: "Practiced compressing 50-page PDFs." },
            { title: "Prompt Engineering Basics", desc: "Understood context windows and tokens." }
          ].map((topic, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-start gap-4 bg-white/5 backdrop-blur-md p-5 rounded-[2rem] shadow-sm border border-white/10 group hover:border-white/20 hover:bg-white/10 transition-all"
            >
              <div className="mt-0.5 shrink-0 w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <p className="text-base font-medium text-white group-hover:text-emerald-400 transition-colors">{topic.title}</p>
                <p className="text-xs font-medium text-white/50 mt-1">{topic.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="px-6 mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">AI Strategic Roadmap</h3>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-[60px]" />
          <div className="space-y-6 relative z-10">
            {[
              "Review the \"Advanced Prompting\" PDF sent to your email.",
              "Complete the workflow automation quiz before Tuesday.",
              "Draft your first automated email sequence."
            ].map((step, i) => (
              <div key={i} className="flex gap-4 group">
                <span className="text-blue-400 font-bold text-lg leading-none">{i + 1}.</span>
                <p className="text-sm font-medium text-white/80 leading-relaxed group-hover:text-white transition-colors">{step}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="px-6 mb-12">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full group flex items-center justify-center gap-3 bg-white text-black py-5 px-8 rounded-[2rem] font-bold uppercase tracking-widest shadow-2xl hover:bg-white/90 transition-all"
        >
          <Download className="w-5 h-5" />
          Download Intelligence Report
        </motion.button>
      </div>
    </motion.div>
  );
}
