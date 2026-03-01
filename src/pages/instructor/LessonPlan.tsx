import { useState } from "react";
import { Calendar, Sparkles, Brain, AlertTriangle, Code, FileText, File, Play, ArrowLeft, MoreHorizontal, Share2, Download, Terminal, Clock, Lightbulb, Loader2, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useSession } from "@/context/SessionContext";

const defaultTalkingPoints = [
  { icon: Sparkles, color: "blue", title: "Personalizing Gemini & Gems", desc: "Teach Gemini about your business and create custom Gems/Opal for specific tasks.", duration: 15 },
  { icon: Brain, color: "purple", title: "Work Automation Agents", desc: "Automate report making and launch apps using free Google Pro resources.", duration: 15 },
  { icon: Code, color: "orange", title: "Code Assistants & Integration", desc: "Using Jules.google, Codex, and integrating with Windows/Microsoft workflows.", duration: 15 },
];

const typeIcons: Record<string, typeof Sparkles> = {
  Theory: Brain,
  Practical: Code,
  Tooling: Terminal,
  Discussion: Lightbulb,
};

const typeColors: Record<string, string> = {
  Theory: "purple",
  Practical: "orange",
  Tooling: "blue",
  Discussion: "green",
};

export default function LessonPlan() {
  const navigate = useNavigate();
  const { goals, topics, topicOrder } = useSession();
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null);

  const orderedTopics = topicOrder.length > 0
    ? topicOrder
        .map((id) => topics.find((t) => t.id === id))
        .filter(Boolean)
    : topics;

  const hasStudentTopics = orderedTopics.length > 0;
  const totalDuration = hasStudentTopics
    ? orderedTopics.reduce((sum, t) => sum + (t?.duration || 0), 0)
    : defaultTalkingPoints.reduce((sum, t) => sum + t.duration, 0);

  const colorForIndex = (i: number) => {
    const colors = ["blue", "purple", "orange", "green", "red"];
    return colors[i % colors.length];
  };

  const getColorClasses = (color: string) => {
    const map: Record<string, { bg: string; text: string; border: string; hoverBorder: string }> = {
      blue: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30", hoverBorder: "rgba(59, 130, 246, 0.4)" },
      purple: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30", hoverBorder: "rgba(168, 85, 247, 0.4)" },
      orange: { bg: "bg-orange-500/20", text: "text-orange-400", border: "border-orange-500/30", hoverBorder: "rgba(249, 115, 22, 0.4)" },
      green: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30", hoverBorder: "rgba(34, 197, 94, 0.4)" },
      red: { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30", hoverBorder: "rgba(239, 68, 68, 0.4)" },
    };
    return map[color] || map.blue;
  };

  const fetchAiSuggestions = async () => {
    if (goals.length === 0) return;
    setLoadingSuggestions(true);
    setSuggestionsError(null);
    try {
      const response = await fetch("/api/ai-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goals }),
      });
      if (!response.ok) throw new Error("Failed to fetch suggestions");
      const data = await response.json();
      setAiSuggestions(data.suggestions || []);
    } catch {
      setSuggestionsError("Could not generate suggestions. Try again later.");
      setAiSuggestions([
        `Explore how "${goals[0]}" connects to real-world AI workflows`,
        "Discuss ethical considerations around AI automation in the workplace",
        "Live demo: build a quick prototype using AI-assisted coding tools",
        "Review best practices for prompt engineering with practical examples",
      ]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 overflow-y-auto flex flex-col w-full max-w-md mx-auto pb-24 h-full bg-[#0A0A0A] text-white relative"
    >
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
              Advanced Session • {totalDuration} min
            </p>
          </div>
        </motion.div>
      </div>

      {hasStudentTopics && goals.length > 0 && (
        <div className="px-6 py-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Luke's Goals</h3>
          <div className="space-y-2">
            {goals.map((goal, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10"
              >
                <Target className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="text-sm text-white/70">{goal}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
            {hasStudentTopics ? "Luke's Agenda" : "Talking Points"}
          </h3>
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl flex items-center gap-1.5 border",
              hasStudentTopics
                ? "text-green-400 bg-green-500/20 border-green-500/30"
                : "text-blue-400 bg-blue-500/20 border-blue-500/30"
            )}
          >
            {hasStudentTopics ? (
              <><Target className="w-3 h-3" /> Student-Driven</>
            ) : (
              <><Sparkles className="w-3 h-3" /> Default Plan</>
            )}
          </motion.span>
        </div>

        <div className="space-y-4">
          {hasStudentTopics
            ? orderedTopics.map((topic, i) => {
                if (!topic) return null;
                const color = typeColors[topic.type] || colorForIndex(i);
                const IconComp = typeIcons[topic.type] || Sparkles;
                const cc = getColorClasses(color);
                return (
                  <motion.div 
                    key={topic.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    whileHover={{ x: 5, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                    className="group flex gap-5 p-6 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 shadow-sm hover:border-white/20 transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className={cn("flex items-center justify-center w-12 h-12 rounded-2xl shrink-0 mt-0.5 border", cc.bg, cc.text, cc.border)}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-lg font-medium text-white tracking-tight group-hover:text-blue-400 transition-colors">{topic.title}</h4>
                        <div className="flex items-center gap-1 text-white/40 shrink-0 ml-2">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold">{topic.duration}m</span>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-white/50 leading-relaxed">{topic.description}</p>
                      <span className={cn("inline-block mt-2 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg border", cc.bg, cc.text, cc.border)}>
                        {topic.type}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            : defaultTalkingPoints.map((point, i) => (
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
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-lg font-medium text-white tracking-tight group-hover:text-blue-400 transition-colors">{point.title}</h4>
                      <div className="flex items-center gap-1 text-white/40 shrink-0 ml-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">{point.duration}m</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-white/50 leading-relaxed">{point.desc}</p>
                  </div>
                </motion.div>
              ))
          }
        </div>
      </div>

      {goals.length > 0 && (
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">AI Suggestions</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchAiSuggestions}
              disabled={loadingSuggestions}
              className="text-[10px] font-bold uppercase tracking-widest text-purple-400 bg-purple-500/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-purple-500/30 hover:bg-purple-500/30 transition-all disabled:opacity-50"
            >
              {loadingSuggestions ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              {loadingSuggestions ? "Generating..." : "Generate"}
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {aiSuggestions.length > 0 ? (
              <motion.div
                key="suggestions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {aiSuggestions.map((suggestion, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex gap-3 p-4 bg-purple-500/10 backdrop-blur-md rounded-2xl border border-purple-500/20"
                  >
                    <Lightbulb className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-white/70 leading-relaxed">{suggestion}</p>
                  </motion.div>
                ))}
                {suggestionsError && (
                  <p className="text-[10px] text-white/30 text-center uppercase tracking-widest mt-2">
                    Showing fallback suggestions
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 bg-white/5 rounded-[2rem] border border-white/10 text-center"
              >
                <Sparkles className="w-8 h-8 text-purple-400/40 mx-auto mb-3" />
                <p className="text-sm text-white/40">
                  Tap "Generate" to get AI-powered talking points based on Luke's goals
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

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
