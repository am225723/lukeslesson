import { useState } from "react";
import { Sparkles, Brain, Check, Minus, Plus, ArrowLeft, Terminal, MessageSquare, ShieldCheck, Loader2, Clock, FileText, AlertCircle, Play } from "lucide-react";
import { generateCodeReview } from "@/lib/gemini";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useSession, HomeworkStatus } from "@/context/SessionContext";

interface SubmissionEntry {
  id: string;
  title: string;
  description: string;
  code?: string;
  submittedWork?: string;
}

const defaultSubmissions: SubmissionEntry[] = [
  {
    id: "prompt-engineering",
    title: "Prompt Engineering Exercise",
    description: "Create 5 variations of a prompt for summarizing meeting notes.",
    submittedWork: "1. Summarize this meeting concisely...\n2. Extract key action items from...\n3. Write a brief executive summary...\n4. List decisions made in...\n5. Create a structured outline of...",
  },
  {
    id: "automation-task",
    title: "Python Automation Task",
    description: "Write a script to optimize workflow bottlenecks.",
    code: `def optimize_workflow(data):
    # Analyze current bottlenecks
    bottlenecks = []
    for item in data:
        if item.process_time > 500:
            bottlenecks.append(item)
    return generate_report(bottlenecks)`,
  },
  {
    id: "ai-ethics",
    title: "AI Ethics Reflection",
    description: "Write a 200-word reflection on responsible AI use in business.",
    submittedWork: "Responsible AI use in business requires a balance between innovation and ethical considerations. Organizations must ensure transparency in AI decision-making processes, particularly when those decisions affect individuals directly...",
  },
  {
    id: "code-challenge",
    title: "Code Challenge: Data Pipeline",
    description: "Build a simple data transformation pipeline using Python.",
    code: `import json

def transform_pipeline(raw_data):
    cleaned = [r for r in raw_data if r.get('valid')]
    enriched = [{**r, 'score': calculate_score(r)} for r in cleaned]
    return sorted(enriched, key=lambda x: x['score'], reverse=True)`,
  },
  {
    id: "business-persona",
    title: "Business Persona Creation",
    description: "Create an AI-powered business persona for a target audience.",
    submittedWork: "Persona: Tech-Forward Small Business Owner\nAge: 35-45\nGoals: Automate repetitive tasks, improve customer service\nPain Points: Limited technical staff, budget constraints\nAI Opportunity: Chatbot for customer queries, automated invoicing...",
  },
  {
    id: "final-outline",
    title: "Draft Final Outline",
    description: "Create a structured outline for the final project presentation.",
  },
];

export default function SubmissionReview() {
  const navigate = useNavigate();
  const { homeworkStatus, updateHomeworkStatus } = useSession();
  const [activeSubmission, setActiveSubmission] = useState<string | null>(null);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});
  const [gradeMap, setGradeMap] = useState<Record<string, number>>({});
  const [aiReviews, setAiReviews] = useState<Record<string, string>>({});
  const [loadingReview, setLoadingReview] = useState<string | null>(null);

  const getStatus = (id: string): HomeworkStatus[string] | undefined => {
    return homeworkStatus[id];
  };

  const getStatusLabel = (id: string) => {
    const s = getStatus(id);
    if (!s) return "not_started";
    return s.status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "in_progress": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default: return "bg-white/10 text-white/40 border-white/10";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <Check className="w-3.5 h-3.5" />;
      case "in_progress": return <Play className="w-3.5 h-3.5" />;
      default: return <AlertCircle className="w-3.5 h-3.5" />;
    }
  };

  const handleAIGrade = async (submission: SubmissionEntry) => {
    setLoadingReview(submission.id);
    try {
      const content = submission.code || submission.submittedWork || "";
      const review = await generateCodeReview(content);
      setAiReviews(prev => ({ ...prev, [submission.id]: review || "Good work overall. Consider adding more detail and structure to strengthen the submission." }));
    } catch {
      setAiReviews(prev => ({ ...prev, [submission.id]: "AI grading unavailable. Please review manually." }));
    } finally {
      setLoadingReview(null);
    }
  };

  const handleSaveFeedback = (submissionId: string) => {
    const feedback = feedbackMap[submissionId] || "";
    updateHomeworkStatus(submissionId, {
      ...homeworkStatus[submissionId],
      status: homeworkStatus[submissionId]?.status || "completed",
      feedback,
    });
  };

  const submittedCount = defaultSubmissions.filter(s => getStatusLabel(s.id) === "completed").length;
  const inProgressCount = defaultSubmissions.filter(s => getStatusLabel(s.id) === "in_progress").length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 overflow-hidden flex flex-col w-full max-w-md mx-auto relative bg-[#0A0A0A] text-white h-full"
    >
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[40%] bg-blue-600/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[40%] bg-purple-600/10 blur-[100px] rounded-full" />
      </div>

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
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                {submittedCount} Submitted · {inProgressCount} In Progress
              </span>
            </div>
          </div>
          <div className="w-11" />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center backdrop-blur-md">
            <div className="text-2xl font-light text-emerald-400">{submittedCount}</div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mt-1">Submitted</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center backdrop-blur-md">
            <div className="text-2xl font-light text-amber-400">{inProgressCount}</div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mt-1">In Progress</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center backdrop-blur-md">
            <div className="text-2xl font-light text-white/60">{defaultSubmissions.length - submittedCount - inProgressCount}</div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mt-1">Pending</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-10 relative z-10">
        {defaultSubmissions.map((submission, index) => {
          const status = getStatusLabel(submission.id);
          const hwEntry = getStatus(submission.id);
          const isExpanded = activeSubmission === submission.id;
          const hasWork = submission.code || submission.submittedWork;

          return (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <motion.button
                onClick={() => setActiveSubmission(isExpanded ? null : submission.id)}
                className={cn(
                  "w-full text-left rounded-2xl border transition-all duration-300",
                  isExpanded
                    ? "bg-white/10 border-white/20"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                )}
              >
                <div className="p-5 flex items-start gap-4">
                  <div className={cn(
                    "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                    getStatusColor(status)
                  )}>
                    {getStatusIcon(status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-white truncate">{submission.title}</h4>
                    </div>
                    <p className="text-xs text-white/40 line-clamp-1">{submission.description}</p>
                    {hwEntry?.submittedAt && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <Clock className="w-3 h-3 text-white/30" />
                        <span className="text-[10px] text-white/30 uppercase tracking-wider">
                          Submitted {new Date(hwEntry.submittedAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className={cn(
                    "shrink-0 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border",
                    getStatusColor(status)
                  )}>
                    {status.replace("_", " ")}
                  </span>
                </div>
              </motion.button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 space-y-4 mt-1">
                      {hasWork ? (
                        <div className="bg-black/40 rounded-xl border border-white/10 overflow-hidden">
                          <div className="px-4 py-2.5 border-b border-white/10 flex items-center gap-2">
                            <Terminal className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                              {submission.code ? "Code Submission" : "Written Work"}
                            </span>
                          </div>
                          <div className="p-4 font-mono text-xs leading-relaxed text-blue-200/80 whitespace-pre-wrap max-h-40 overflow-y-auto">
                            {submission.code || submission.submittedWork}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-white/5 rounded-xl border border-white/10 p-4 flex items-center gap-3">
                          <FileText className="w-5 h-5 text-white/30" />
                          <span className="text-xs text-white/40">No work submitted yet</span>
                        </div>
                      )}

                      {hasWork && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAIGrade(submission)}
                          disabled={loadingReview === submission.id || !!aiReviews[submission.id]}
                          className="w-full flex items-center justify-center gap-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500/30 disabled:opacity-50 transition-all"
                        >
                          {loadingReview === submission.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Sparkles className="w-4 h-4" />
                          )}
                          {aiReviews[submission.id] ? "AI Grade Generated" : "Generate AI Grade"}
                        </motion.button>
                      )}

                      <AnimatePresence>
                        {aiReviews[submission.id] && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-blue-900/20 rounded-xl p-4 border border-blue-500/30"
                          >
                            <div className="flex items-start gap-3">
                              <Brain className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                              <div>
                                <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">AI Assessment</h4>
                                <p className="text-xs text-white/70 leading-relaxed italic">"{aiReviews[submission.id]}"</p>
                                <motion.button
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => setFeedbackMap(prev => ({ ...prev, [submission.id]: aiReviews[submission.id] }))}
                                  className="mt-3 text-[9px] font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                  Use as feedback →
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 px-1">
                          <MessageSquare className="w-3.5 h-3.5 text-white/30" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Instructor Feedback</span>
                        </div>
                        <textarea
                          value={feedbackMap[submission.id] ?? hwEntry?.feedback ?? ""}
                          onChange={(e) => setFeedbackMap(prev => ({ ...prev, [submission.id]: e.target.value }))}
                          className="w-full rounded-xl border border-white/10 bg-white/5 text-xs font-medium p-4 focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 h-24 resize-none transition-all outline-none text-white placeholder:text-white/20 backdrop-blur-md"
                          placeholder="Write feedback for Luke..."
                        />
                      </div>

                      <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Grade</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setGradeMap(prev => ({ ...prev, [submission.id]: Math.max(0, (prev[submission.id] ?? 85) - 1) }))}
                            className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center text-white/40 hover:text-blue-400 transition-all"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </motion.button>
                          <input
                            className="w-12 text-center bg-transparent border-0 p-0 text-2xl font-light text-blue-400 focus:ring-0 outline-none"
                            type="text"
                            value={gradeMap[submission.id] ?? 85}
                            onChange={(e) => setGradeMap(prev => ({ ...prev, [submission.id]: Number(e.target.value) || 0 }))}
                          />
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setGradeMap(prev => ({ ...prev, [submission.id]: Math.min(100, (prev[submission.id] ?? 85) + 1) }))}
                            className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center text-white/40 hover:text-blue-400 transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSaveFeedback(submission.id)}
                        className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/90 transition-all"
                      >
                        <Check className="w-4 h-4" />
                        Save Feedback
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
