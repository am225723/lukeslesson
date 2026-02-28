import { useState } from "react";
import { Sparkles, Brain, Check, Minus, Plus, ArrowLeft, Code, Terminal, MessageSquare, ShieldCheck, Zap, Loader2 } from "lucide-react";
import { generateCodeReview } from "@/lib/gemini";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export default function SubmissionReview() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("student");
  const [feedback, setFeedback] = useState("");
  const [grade, setGrade] = useState(95);
  const [aiReview, setAiReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasTriggeredReview, setHasTriggeredReview] = useState(false);

  const codeSnippet = `def optimize_workflow(data):
    # Analyze current bottlenecks
    bottlenecks = []
    for item in data:
        if item.process_time > 500:
            bottlenecks.append(item)
    return generate_report(bottlenecks)`;

  const handleTriggerReview = async () => {
    setHasTriggeredReview(true);
    setIsLoading(true);
    try {
      const review = await generateCodeReview(codeSnippet);
      setAiReview(review || "The logic is sound, but the time complexity is O(N). Suggest using list comprehensions for cleaner syntax in Python.");
    } catch (error) {
      setAiReview("AI Review failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 overflow-hidden flex flex-col w-full max-w-md mx-auto relative bg-[#0A0A0A] text-white h-full"
    >
      {/* Dark Luxury / Atmospheric Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[40%] bg-blue-600/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[40%] bg-purple-600/10 blur-[100px] rounded-full" />
      </div>

      {/* Header */}
      <div className="px-6 pt-10 pb-4 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <motion.button 
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)} 
            className="p-3 bg-white/5 rounded-2xl text-white/60 hover:text-white border border-white/10 shadow-sm transition-all backdrop-blur-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div className="flex flex-col items-center">
            <h1 className="text-xl font-light text-white uppercase tracking-[0.2em]">Review Lab</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Submission Active</span>
            </div>
          </div>
          <div className="w-11" /> {/* Spacer */}
        </div>

        <div className="flex bg-white/5 p-1.5 rounded-2xl mb-6 border border-white/10 backdrop-blur-md">
          <button 
            onClick={() => setActiveTab("student")}
            className={cn(
              "flex-1 py-3 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
              activeTab === "student" ? "bg-white/10 shadow-xl text-white border border-white/10" : "text-white/40 hover:text-white/60"
            )}
          >
            Submission
          </button>
          <button 
            onClick={() => setActiveTab("ai")}
            className={cn(
              "flex-1 py-3 px-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2",
              activeTab === "ai" ? "bg-white/10 shadow-xl text-white border border-white/10" : "text-white/40 hover:text-white/60"
            )}
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            AI Insights
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 space-y-8 pb-32 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 backdrop-blur-xl group"
        >
          <div className="bg-black/40 px-6 py-4 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                <Terminal className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">logic_controller.py</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-3 py-1 rounded-full uppercase tracking-widest font-bold border border-emerald-500/30">On time</span>
            </div>
          </div>
          <div className="p-8 font-mono text-xs leading-relaxed text-blue-200/80 overflow-x-auto whitespace-pre bg-black/20">
            {codeSnippet}
          </div>
        </motion.div>

        <div className="flex justify-center">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTriggerReview} 
            disabled={isLoading || hasTriggeredReview}
            className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-[2rem] font-bold uppercase tracking-widest shadow-xl hover:bg-white/90 disabled:opacity-50 transition-all"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            Trigger AI Analysis
          </motion.button>
        </div>

        <AnimatePresence>
          {hasTriggeredReview && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-blue-900/20 rounded-[2.5rem] p-8 border border-blue-500/30 relative overflow-hidden group backdrop-blur-md"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-[60px] -z-0" />
              <div className="flex items-start gap-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 shadow-xl">
                  <Brain className="w-7 h-7 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">AI Diagnostic Report</h4>
                  {isLoading ? (
                    <div className="flex items-center gap-3 py-4">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <p className="text-sm font-medium text-white/80 leading-relaxed mb-6 italic">
                        "{aiReview}"
                      </p>
                      <div className="flex gap-3">
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFeedback(aiReview)}
                          className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] px-6 py-3 rounded-xl font-bold uppercase tracking-widest shadow-lg hover:bg-blue-500/30 transition-all"
                        >
                          Apply Feedback
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setHasTriggeredReview(false)} 
                          className="bg-white/5 text-white/40 text-[10px] px-6 py-3 rounded-xl font-bold uppercase tracking-widest border border-white/10 hover:text-white hover:bg-white/10 transition-all shadow-sm"
                        >
                          Dismiss
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          <div className="flex items-center gap-3 px-2">
            <MessageSquare className="w-5 h-5 text-white/40" />
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Instructor Commentary</h3>
          </div>
          <textarea 
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full rounded-[2rem] border border-white/10 bg-white/5 text-sm font-medium p-6 focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 shadow-inner h-40 resize-none transition-all outline-none text-white placeholder:text-white/20 backdrop-blur-md" 
            placeholder="Luke, your logic is improving. Focus on..."
          />
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10 shadow-sm flex items-center justify-between group hover:border-white/20 transition-all">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-white">Final Grade</h3>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Scale: 0 - 100</p>
          </div>
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setGrade(Math.max(0, grade - 1))} 
              className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-white/40 hover:text-blue-400 hover:bg-white/10 transition-all shadow-sm"
            >
              <Minus className="w-5 h-5" />
            </motion.button>
            <div className="w-20 text-center">
              <input 
                className="w-full text-center bg-transparent border-0 p-0 text-4xl font-light text-blue-400 focus:ring-0 outline-none tracking-tighter" 
                type="text" 
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value) || 0)}
              />
            </div>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setGrade(Math.min(100, grade + 1))} 
              className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-white/40 hover:text-blue-400 hover:bg-white/10 transition-all shadow-sm"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-6 right-6 z-20">
        <motion.button 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-3 bg-white text-black py-6 rounded-[2rem] shadow-2xl hover:bg-white/90 transition-all"
        >
          <Check className="w-6 h-6" />
          <span className="font-bold text-sm uppercase tracking-[0.2em]">Finalize Review</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
