import { useState } from "react";
import { Check, Bot, PlayCircle, BookOpen, ArrowRight, MonitorPlay, Star, Trophy, Target, FileText, Download, Sparkles, Clock, Flame, Lightbulb, Code, Users, Shield, Zap, ChevronDown, ChevronUp, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useSession } from "@/context/SessionContext";

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  estimatedTime: string;
}

const assignments: Assignment[] = [
  {
    id: "prompt-engineering",
    title: "Prompt Engineering Exercises",
    description: "Create 5 variations of a prompt for summarizing meeting notes, focusing on different tones and formats. Test each with an LLM and document results.",
    dueDate: "Today",
    priority: "high",
    icon: <Target className="w-5 h-5" />,
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-400",
    estimatedTime: "45 min",
  },
  {
    id: "automation-task",
    title: "Automation Workflow Design",
    description: "Design an automation workflow that uses AI to process incoming emails, categorize them, and draft responses. Create a flowchart and pseudocode.",
    dueDate: "Tomorrow",
    priority: "high",
    icon: <Zap className="w-5 h-5" />,
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-400",
    estimatedTime: "60 min",
  },
  {
    id: "ai-ethics",
    title: "AI Ethics Reflection",
    description: "Write a 500-word reflection on the ethical implications of AI in education. Consider bias, privacy, accessibility, and the role of human oversight.",
    dueDate: "Wednesday",
    priority: "medium",
    icon: <Shield className="w-5 h-5" />,
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
    estimatedTime: "30 min",
  },
  {
    id: "code-challenge",
    title: "Code Challenge: AI API Integration",
    description: "Build a simple script that connects to an AI API, sends a prompt, and processes the response. Use error handling and rate limiting best practices.",
    dueDate: "Thursday",
    priority: "medium",
    icon: <Code className="w-5 h-5" />,
    iconBg: "bg-purple-500/20",
    iconColor: "text-purple-400",
    estimatedTime: "90 min",
  },
  {
    id: "business-persona",
    title: "Business Persona Creation",
    description: "Create 3 detailed business personas that would benefit from AI tools. Include demographics, pain points, goals, and recommended AI solutions for each.",
    dueDate: "Friday",
    priority: "low",
    icon: <Users className="w-5 h-5" />,
    iconBg: "bg-pink-500/20",
    iconColor: "text-pink-400",
    estimatedTime: "40 min",
  },
  {
    id: "final-outline",
    title: "Draft Final Project Outline",
    description: "Create a comprehensive outline for your final project. Include objectives, methodology, tools you'll use, timeline, and expected outcomes.",
    dueDate: "Next Monday",
    priority: "low",
    icon: <FileText className="w-5 h-5" />,
    iconBg: "bg-cyan-500/20",
    iconColor: "text-cyan-400",
    estimatedTime: "50 min",
  },
];

const studyTips = [
  "Break complex prompts into smaller, testable components for better results.",
  "Always test your AI outputs with edge cases — unusual inputs reveal weaknesses.",
  "Keep a prompt journal: document what works and what doesn't for future reference.",
  "When stuck, try explaining the problem to the AI as if teaching a beginner.",
  "Review your completed assignments weekly to track your growth patterns.",
];

const priorityConfig = {
  high: { label: "High", color: "bg-red-500/20 text-red-300", dot: "bg-red-400" },
  medium: { label: "Med", color: "bg-amber-500/20 text-amber-300", dot: "bg-amber-400" },
  low: { label: "Low", color: "bg-green-500/20 text-green-300", dot: "bg-green-400" },
};

export default function Homework() {
  const navigate = useNavigate();
  const { homeworkStatus, updateHomeworkStatus, addCompletedActivity } = useSession();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentTip] = useState(() => Math.floor(Math.random() * studyTips.length));

  const getStatus = (id: string) => homeworkStatus[id]?.status || "not_started";

  const handleStatusChange = (id: string, newStatus: "not_started" | "in_progress" | "completed") => {
    const prev = getStatus(id);
    updateHomeworkStatus(id, {
      status: newStatus,
      submittedAt: newStatus === "completed" ? new Date().toISOString() : undefined,
    });
    if (newStatus === "completed" && prev !== "completed") {
      const assignment = assignments.find((a) => a.id === id);
      addCompletedActivity(`Completed homework: ${assignment?.title}`);
      toast.success(`"${assignment?.title}" submitted!`);
    } else if (newStatus === "in_progress") {
      toast.info("Marked as in progress");
    }
  };

  const completedCount = assignments.filter((a) => getStatus(a.id) === "completed").length;
  const inProgressCount = assignments.filter((a) => getStatus(a.id) === "in_progress").length;
  const progressPercent = Math.round((completedCount / assignments.length) * 100);

  const streakDays = 4;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 overflow-y-auto flex flex-col w-full max-w-md mx-auto pb-24 h-full bg-[#0A0A0A] text-white relative"
    >
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
            <h1 className="text-3xl font-light tracking-tight text-white mb-1">
              Your <span className="font-bold text-blue-400">Path</span>
            </h1>
            <p className="text-xs font-medium text-white/50 uppercase tracking-widest">
              {completedCount}/{assignments.length} Complete
            </p>
          </div>
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/10 shadow-2xl">
            <img
              alt="Student Luke"
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYA455Ml624fv617DhU--WS50K-YjnfoY-BrSyLzkJofuOp6GqMgggo0VI0Fy7GGlHLpuFcxzsvZpkRgvY8WX7Yx9ltefxVk6C5wlpPnpI2TteJ6FjDkDWUhY64VzCTmjfP76SH_ba7xoY94mO4Wkh1ilCN484FvjQFCF887bSXe1MA8tydGWMR3MbhwQWOTSbzPNsmq6DdsVHTOQbWpG_AGeAJAB2hH4eRmBSQm76x5ObqoNsWOVcHdjd8kcksPjj1Fjzb3urlRk"
              referrerPolicy="no-referrer"
            />
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
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">
                Mastery Level
              </div>
              <div className="text-4xl font-light text-white">
                {progressPercent}
                <span className="text-xl text-white/40">%</span>
              </div>
            </div>
            <div className="flex -space-x-2">
              {Array.from({ length: Math.min(completedCount, 5) }).map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-[#0A0A0A] bg-white/10 flex items-center justify-center backdrop-blur-md"
                >
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </div>
              ))}
            </div>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
            />
          </div>
          <div className="flex items-center gap-4 mt-4 text-[10px] uppercase tracking-widest text-white/40">
            <span>{completedCount} done</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>{inProgressCount} in progress</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>{assignments.length - completedCount - inProgressCount} to do</span>
          </div>
        </motion.div>
      </div>

      <div className="px-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex items-center gap-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-4"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500/20">
            <Flame className="w-6 h-6 text-orange-400" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-white">
              {streakDays} Day Streak!
            </div>
            <div className="text-[10px] text-white/50 uppercase tracking-widest mt-0.5">
              Keep it going — consistency is key
            </div>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-2.5 h-2.5 rounded-full",
                  i < streakDays ? "bg-orange-400" : "bg-white/10"
                )}
              />
            ))}
          </div>
        </motion.div>

        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-4">
            Assignments
          </h3>

          <div className="space-y-3">
            {assignments.map((assignment, index) => {
              const status = getStatus(assignment.id);
              const isExpanded = expandedId === assignment.id;
              const isCompleted = status === "completed";
              const priority = priorityConfig[assignment.priority];

              return (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.07 }}
                  className={cn(
                    "rounded-2xl border transition-all duration-300",
                    isCompleted
                      ? "bg-white/[0.03] border-white/5 opacity-60"
                      : isExpanded
                        ? "bg-white/[0.08] border-white/15"
                        : "bg-white/5 border-white/5 hover:bg-white/[0.08]"
                  )}
                >
                  <button
                    className="w-full flex items-center gap-4 p-4 text-left"
                    onClick={() => setExpandedId(isExpanded ? null : assignment.id)}
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                        isCompleted
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/20"
                          : `${assignment.iconBg} ${assignment.iconColor} border-transparent`
                      )}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : assignment.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className={cn(
                          "text-sm font-medium truncate",
                          isCompleted ? "text-white/50 line-through" : "text-white"
                        )}
                      >
                        {assignment.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-white/40 uppercase tracking-wider">
                          {assignment.dueDate}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest rounded-full px-2 py-0.5",
                            priority.color
                          )}
                        >
                          <span className={cn("w-1.5 h-1.5 rounded-full", priority.dot)} />
                          {priority.label}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="text-[10px] text-white/40 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {assignment.estimatedTime}
                        </span>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-white/30" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-white/30" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-0 space-y-4">
                          <p className="text-sm text-white/60 leading-relaxed">
                            {assignment.description}
                          </p>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                              Status:
                            </span>
                            <div className="flex gap-1.5">
                              {(["not_started", "in_progress", "completed"] as const).map((s) => (
                                <button
                                  key={s}
                                  onClick={() => handleStatusChange(assignment.id, s)}
                                  className={cn(
                                    "text-[9px] font-bold uppercase tracking-widest rounded-full px-3 py-1.5 border transition-all",
                                    status === s
                                      ? s === "completed"
                                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                        : s === "in_progress"
                                          ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                          : "bg-white/10 text-white/60 border-white/20"
                                      : "bg-transparent text-white/30 border-white/5 hover:border-white/15"
                                  )}
                                >
                                  {s === "not_started"
                                    ? "Not Started"
                                    : s === "in_progress"
                                      ? "In Progress"
                                      : "Completed"}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-3">
                            {!isCompleted && (
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleStatusChange(assignment.id, "completed")}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-white text-black px-4 py-3 text-xs font-bold uppercase tracking-wider hover:bg-white/90 transition-colors"
                              >
                                <Send className="w-4 h-4" />
                                Submit
                              </motion.button>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => navigate("/workspace")}
                              className={cn(
                                "inline-flex items-center justify-center rounded-xl bg-white/10 text-white border border-white/10 hover:bg-white/20 transition-colors",
                                isCompleted ? "flex-1 gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider" : "w-12"
                              )}
                            >
                              <MonitorPlay className="w-4 h-4" />
                              {isCompleted && "Open Workspace"}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-4">
            <Sparkles className="w-3 h-3 inline mr-1" />
            AI Study Tip
          </h3>
          <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/10 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4" />
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                {studyTips[currentTip]}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-4">
            Resources
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <motion.a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toast.success("Downloading Prompt Engineering Guide...");
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-all flex flex-col gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-medium text-white leading-tight">Prompt Guide</h4>
                <p className="text-[9px] text-white/40 uppercase tracking-widest mt-1">
                  PDF • 2.4 MB
                </p>
              </div>
            </motion.a>

            <motion.a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toast.success("Opening Video Lecture...");
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-all flex flex-col gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <PlayCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-medium text-white leading-tight">Intro to LLMs</h4>
                <p className="text-[9px] text-white/40 uppercase tracking-widest mt-1">
                  Video • 45 Min
                </p>
              </div>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
