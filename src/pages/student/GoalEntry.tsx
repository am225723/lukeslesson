import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, GraduationCap, Calendar, Plus, Trash2, Bot, ArrowRight, Loader2, X } from "lucide-react";
import { chatWithAssistant } from "@/lib/gemini";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface Goal {
  text: string;
  isRefining: boolean;
  aiQuestion: string;
  userAnswer: string;
  isAiLoading: boolean;
}

export default function GoalEntry() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>([{ text: "", isRefining: false, aiQuestion: "", userAnswer: "", isAiLoading: false }]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    const validGoals = goals.filter(g => g.text.trim() !== "").map(g => g.text);
    if (validGoals.length === 0) return;
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      navigate("/student/goal-breakdown", { state: { goals: validGoals } });
    }, 1500);
  };

  const updateGoalText = (index: number, value: string) => {
    const newGoals = [...goals];
    newGoals[index].text = value;
    setGoals(newGoals);
  };

  const addGoal = () => {
    setGoals([...goals, { text: "", isRefining: false, aiQuestion: "", userAnswer: "", isAiLoading: false }]);
  };

  const removeGoal = (index: number) => {
    const newGoals = goals.filter((_, i) => i !== index);
    setGoals(newGoals);
  };

  const startRefining = async (index: number) => {
    const goal = goals[index];
    if (!goal.text.trim()) return;

    const newGoals = [...goals];
    newGoals[index].isAiLoading = true;
    newGoals[index].isRefining = true;
    setGoals(newGoals);

    try {
      const prompt = `The student has entered the following learning goal: "${goal.text}". 
Ask a single, short, and engaging follow-up question to help them make this goal more specific, measurable, or actionable. Do not provide advice, just ask the question.`;
      const response = await chatWithAssistant([], prompt, "");
      
      const updatedGoals = [...goals];
      updatedGoals[index].aiQuestion = response || "Could you provide a bit more detail on what exactly you want to achieve?";
      updatedGoals[index].isAiLoading = false;
      setGoals(updatedGoals);
    } catch (error) {
      const updatedGoals = [...goals];
      updatedGoals[index].isRefining = false;
      updatedGoals[index].isAiLoading = false;
      setGoals(updatedGoals);
    }
  };

  const submitRefinement = async (index: number) => {
    const goal = goals[index];
    if (!goal.userAnswer.trim()) return;

    const newGoals = [...goals];
    newGoals[index].isAiLoading = true;
    setGoals(newGoals);

    try {
      const prompt = `Original goal: "${goal.text}"
AI's follow-up question: "${goal.aiQuestion}"
Student's answer: "${goal.userAnswer}"

Based on the student's answer, rewrite their original learning goal to be highly specific, comprehensive, and actionable. Write it from the student's perspective (e.g., "I want to..."). Only return the rewritten goal text.`;
      const response = await chatWithAssistant([], prompt, "");
      
      const updatedGoals = [...goals];
      updatedGoals[index].text = response || goal.text;
      updatedGoals[index].isRefining = false;
      updatedGoals[index].aiQuestion = "";
      updatedGoals[index].userAnswer = "";
      updatedGoals[index].isAiLoading = false;
      setGoals(updatedGoals);
    } catch (error) {
      const updatedGoals = [...goals];
      updatedGoals[index].isAiLoading = false;
      setGoals(updatedGoals);
    }
  };

  const hasValidGoal = goals.some(g => g.text.trim() !== "");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 overflow-y-auto flex flex-col w-full max-w-md mx-auto pb-24 h-full bg-[#0A0A0A] text-white relative"
    >
      {/* Dark Luxury / Atmospheric Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] bg-blue-600/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-purple-600/20 blur-[100px] rounded-full" />
      </div>
      
      <div className="px-6 pt-10 pb-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-500/20 border border-blue-500/30 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-300 shadow-sm"
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Session Preparation</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-light leading-[1.1] tracking-tight text-white mb-4"
        >
          Hello, Luke. <br />
          <span className="font-bold text-blue-400">What are your goals?</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-white/50 text-sm font-medium leading-relaxed max-w-[90%]"
        >
          Describe what you want to achieve in this session. Our AI will craft a personalized learning path for you.
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="px-6 py-4"
      >
        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl p-4 rounded-[2rem] border border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/20 shadow-lg group-hover:rotate-0 transition-transform duration-500">
            <img alt="Instructor Aleixander" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYA455Ml624fv617DhU--WS50K-YjnfoY-BrSyLzkJofuOp6GqMgggo0VI0Fy7GGlHLpuFcxzsvZpkRgvY8WX7Yx9ltefxVk6C5wlpPnpI2TteJ6FjDkDWUhY64VzCTmjfP76SH_ba7xoY94mO4Wkh1ilCN484FvjQFCF887bSXe1MA8tydGWMR3MbhwQWOTSbzPNsmq6DdsVHTOQbWpG_AGeAJAB2hH4eRmBSQm76x5ObqoNsWOVcHdjd8kcksPjj1Fjzb3urlRk" referrerPolicy="no-referrer" />
          </div>
          <div className="flex-1 relative z-10">
            <p className="text-base font-medium text-white tracking-tight">Aleixander Puerta</p>
            <p className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Lead Instructor • AI Strategy</p>
          </div>
          <div className="flex flex-col items-end gap-1 relative z-10">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <Calendar className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">2:00 PM</span>
          </div>
        </div>
      </motion.div>

      <div className="px-6 py-2 flex-1 flex flex-col gap-6">
        <div className="text-white/40 text-[11px] font-bold flex justify-between items-center uppercase tracking-[0.2em]">
          Your Learning Statements
          <span className="text-[10px] font-bold text-blue-400 normal-case tracking-normal bg-blue-500/20 px-2 py-0.5 rounded-md border border-blue-500/30">AI-Enhanced</span>
        </div>
        
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {goals.map((goal, index) => (
              <motion.div 
                key={index}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative group flex flex-col gap-3"
              >
                <div className="relative flex-1 min-h-[140px]">
                  <textarea
                    value={goal.text}
                    onChange={(e) => updateGoalText(index, e.target.value)}
                    disabled={goal.isRefining}
                    className={cn(
                      "w-full h-full resize-none rounded-[2rem] border p-6 text-sm font-medium text-white placeholder:text-white/30 transition-all duration-300 ease-out outline-none backdrop-blur-md",
                      goal.isRefining 
                        ? "bg-white/5 border-white/5 text-white/40" 
                        : "bg-white/5 border-white/10 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                    )}
                    placeholder={index === 0 ? "e.g., I want to learn how AI can automate my daily workflow..." : "Another goal..."}
                  />
                  {!goal.isRefining && (
                    <div className="absolute bottom-5 right-5 flex gap-2">
                      {goal.text.trim() && (
                        <motion.button 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => startRefining(index)}
                          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> Refine
                        </motion.button>
                      )}
                      {goals.length > 1 && (
                        <button 
                          onClick={() => removeGoal(index)}
                          className="p-2.5 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors border border-red-500/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {goal.isRefining && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-6 border border-white/10 relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                      {goal.isAiLoading && !goal.aiQuestion ? (
                        <div className="flex flex-col items-center justify-center py-6 gap-4">
                          <div className="relative">
                            <div className="w-12 h-12 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin" />
                            <Bot className="w-6 h-6 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400 animate-pulse">AI is thinking...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-5">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                              <Bot className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1">AI Assistant</p>
                              <p className="text-sm font-medium text-white leading-relaxed">
                                {goal.aiQuestion}
                              </p>
                            </div>
                            <button 
                              onClick={() => {
                                const newGoals = [...goals];
                                newGoals[index].isRefining = false;
                                newGoals[index].aiQuestion = "";
                                newGoals[index].userAnswer = "";
                                setGoals(newGoals);
                              }}
                              className="text-white/40 hover:text-white/60 p-1"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="flex items-center gap-3 bg-black/40 rounded-xl border border-white/10 p-2 focus-within:border-blue-500/50 transition-all">
                            <input
                              type="text"
                              autoFocus
                              value={goal.userAnswer}
                              onChange={(e) => {
                                const newGoals = [...goals];
                                newGoals[index].userAnswer = e.target.value;
                                setGoals(newGoals);
                              }}
                              onKeyDown={(e) => e.key === 'Enter' && submitRefinement(index)}
                              placeholder="Type your answer..."
                              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium px-3 outline-none text-white placeholder:text-white/30"
                              disabled={goal.isAiLoading}
                            />
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => submitRefinement(index)}
                              disabled={!goal.userAnswer.trim() || goal.isAiLoading}
                              className="h-10 w-10 rounded-lg bg-white text-black flex items-center justify-center disabled:opacity-50"
                            >
                              {goal.isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                            </motion.button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
          whileTap={{ scale: 0.98 }}
          onClick={addGoal}
          className="w-full py-6 border border-dashed border-white/20 rounded-[2rem] text-white/40 hover:text-white hover:border-white/40 transition-all flex items-center justify-center gap-3 font-bold text-[11px] uppercase tracking-widest"
        >
          <Plus className="w-5 h-5" />
          Add Another Goal
        </motion.button>
      </div>

      <div className="px-6 mt-10 mb-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={!hasValidGoal || isGenerating}
          className="group relative flex w-full cursor-pointer items-center justify-center gap-4 overflow-hidden rounded-[2rem] bg-white px-8 py-5 text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <Loader2 className="w-5 h-5 animate-spin relative z-10" />
          ) : (
            <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12 relative z-10" />
          )}
          <span className="text-xs font-bold uppercase tracking-[0.2em] relative z-10">
            {isGenerating ? "Analyzing..." : "Generate Learning Path"}
          </span>
        </motion.button>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-[10px] font-bold text-white/40 uppercase tracking-widest"
        >
          AI will process your request in seconds
        </motion.p>
      </div>
    </motion.div>
  );
}
