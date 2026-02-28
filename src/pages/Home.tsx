import { useNavigate } from "react-router-dom";
import { User, GraduationCap, Sparkles, ArrowRight, Bot, Code2, Zap } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#0A0A0A] text-white p-8 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-purple-600/10 to-blue-600/10 rounded-full blur-[120px]" 
        />
      </div>

      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-[2.5rem] shadow-xl shadow-blue-500/10 border border-white/10 mb-8 relative backdrop-blur-md"
          >
            <Sparkles className="w-10 h-10 text-blue-400" />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-[#0A0A0A]"
            />
          </motion.div>
          
          <h1 className="text-5xl font-light tracking-tighter mb-4 leading-[0.9]">
            AI <br />
            <span className="font-bold text-blue-500">Learning</span>
          </h1>
          <p className="text-white/50 font-medium text-lg max-w-[280px] mx-auto leading-tight">
            The future of personalized business automation education.
          </p>
        </motion.div>
        
        <div className="grid gap-4">
          <RoleCard 
            title="Student"
            description="Personalize your AI journey & track goals."
            icon={<User className="w-6 h-6" />}
            color="blue"
            onClick={() => navigate("/student/goal-entry")}
            delay={0.1}
          />

          <RoleCard 
            title="Instructor"
            description="Master AI tools & guide your students."
            icon={<GraduationCap className="w-6 h-6" />}
            color="indigo"
            onClick={() => navigate("/instructor/login")}
            delay={0.2}
          />
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex items-center justify-center gap-6"
        >
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl bg-white/5 shadow-sm flex items-center justify-center border border-white/10 backdrop-blur-md">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Fast</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl bg-white/5 shadow-sm flex items-center justify-center border border-white/10 backdrop-blur-md">
              <Bot className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Smart</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-xl bg-white/5 shadow-sm flex items-center justify-center border border-white/10 backdrop-blur-md">
              <Code2 className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Real</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function RoleCard({ title, description, icon, color, onClick, delay }: any) {
  const colors: any = {
    blue: "bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white border border-blue-500/30",
    indigo: "bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white border border-indigo-500/30",
  };

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02, x: 5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center gap-6 p-6 bg-white/5 rounded-[2rem] shadow-sm border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all group text-left relative overflow-hidden backdrop-blur-md"
    >
      <div className={cn(
        "w-16 h-16 rounded-2xl flex items-center justify-center transition-all shrink-0",
        colors[color]
      )}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium text-white group-hover:text-blue-400 transition-colors">{title}</h2>
          <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
        </div>
        <p className="text-sm text-white/50 mt-1 leading-tight font-medium">{description}</p>
      </div>
    </motion.button>
  );
}
