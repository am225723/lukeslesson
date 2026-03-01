import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sparkles, Bot, Zap, FileText, Plus, ArrowRight, CheckCircle2, Clock, Target } from "lucide-react";
import { generateGoalBreakdown } from "@/lib/gemini";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useSession } from "@/context/SessionContext";

interface Topic {
  title: string;
  description: string;
  type: string;
  duration: number;
}

export default function GoalBreakdown() {
  const location = useLocation();
  const navigate = useNavigate();
  const { goals: contextGoals, setTopics: setContextTopics } = useSession();
  const goals: string[] = (contextGoals.length > 0 ? contextGoals : null) || location.state?.goals || ["I want to learn how AI can automate my daily workflow and help me summarize long documents..."];
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      setIsLoading(true);
      const generatedTopics = await generateGoalBreakdown(goals);
      if (generatedTopics.length > 0) {
        setTopics(generatedTopics);
        setContextTopics(generatedTopics.map((t, i) => ({ ...t, id: `topic-${i}` })));
      } else {
        const fallbackTopics = [
          { title: "Intro to LLMs", description: "Understanding how Large Language Models work and their capabilities for summarization.", type: "Theory", duration: 15 },
          { title: "Workflow Automation", description: "Connecting AI tools to your daily apps (Email, Slack, Calendar) to automate repetitive tasks.", type: "Practical", duration: 25 },
          { title: "Document Summarization", description: "Techniques for condensing long reports and PDFs into actionable bullet points.", type: "Tooling", duration: 10 },
        ];
        setTopics(fallbackTopics);
        setContextTopics(fallbackTopics.map((t, i) => ({ ...t, id: `topic-${i}` })));
      }
      setIsLoading(false);
    };

    fetchTopics();
  }, []);

  const getIconForTopic = (index: number) => {
    switch (index % 3) {
      case 0: return <Bot className="w-5 h-5" />;
      case 1: return <Zap className="w-5 h-5" />;
      case 2: return <FileText className="w-5 h-5" />;
      default: return <Bot className="w-5 h-5" />;
    }
  };

  const getColorClass = (index: number) => {
    switch (index % 3) {
      case 0: return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case 1: return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case 2: return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      default: return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

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
      
      <div className="px-6 pt-10 pb-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-4 mb-8"
        >
          <div className="bg-white/5 p-3 rounded-2xl shadow-2xl border border-white/10 shrink-0 rotate-3 backdrop-blur-md">
            <Sparkles className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-light leading-tight tracking-tight text-white mb-1">
              AI Analysis <span className="font-bold text-blue-400">Complete</span>
            </h1>
            <p className="text-white/50 text-sm font-medium leading-relaxed">
              We've crafted a personalized roadmap based on your goals.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -z-10 opacity-50" />
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-blue-400" />
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">Your Objectives</p>
          </div>
          <ul className="space-y-4">
            {goals.map((g, i) => (
              <motion.li 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                key={i} 
                className="text-sm font-medium text-white/80 flex items-start gap-3"
              >
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" /> 
                <span className="leading-relaxed">{g}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      <div className="px-6 py-4 flex flex-col gap-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Suggested Focus Areas</h3>
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/20 border border-blue-500/30 px-3 py-1 rounded-full"
          >
            {isLoading ? "Analyzing..." : `${topics.length} Modules`}
          </motion.span>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-dashed border-white/20">
            <div className="relative mb-6">
              <div className="w-16 h-16 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin" />
              <Bot className="w-8 h-8 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] animate-pulse">Building your path...</p>
          </div>
        ) : (
          <div className="space-y-5">
            <AnimatePresence>
              {topics.map((topic, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/10 relative overflow-hidden group hover:border-white/20 hover:bg-white/10 transition-all duration-500"
                >
                  <div className="absolute top-6 right-6 z-20">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={index !== 2} />
                      <div className="w-12 h-7 bg-black/40 border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 shadow-inner"></div>
                    </label>
                  </div>
                  
                  <div className="relative z-10">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border", getColorClass(index))}>
                      {getIconForTopic(index)}
                    </div>
                    <h4 className="text-xl font-medium text-white mb-2 tracking-tight">{topic.title}</h4>
                    <p className="text-sm font-medium text-white/50 leading-relaxed mb-6 pr-8">{topic.description}</p>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white/40" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">{topic.type}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
                        <Clock className="w-3.5 h-3.5 text-white/40" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">{topic.duration} min</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full -z-10 group-hover:scale-150 transition-transform duration-700 opacity-50" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <motion.button 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/student/topic-preferences", { state: { topics } })}
          className="w-full py-5 mt-10 bg-white text-black rounded-[2rem] hover:bg-white/90 transition-all flex items-center justify-center gap-3 font-bold text-xs uppercase tracking-[0.2em] active:scale-[0.98]"
        >
          Customize My Path
          <ArrowRight className="w-4 h-4" />
        </motion.button>
        <div className="h-8"></div>
      </div>
    </motion.div>
  );
}
