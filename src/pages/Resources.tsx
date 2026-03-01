import { useState } from "react";
import { BookOpen, FileText, Video, Link as LinkIcon, Sparkles, ExternalLink } from "lucide-react";
import { chatWithAssistant } from "@/lib/gemini";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export default function Resources() {
  const [summarizing, setSummarizing] = useState<number | null>(null);
  const [summaries, setSummaries] = useState<Record<number, string>>({});

  const resources = [
    {
      title: "Google AI Studio & Gemini Pro",
      type: "Platform",
      icon: <Sparkles className="w-5 h-5" />,
      color: "blue",
      url: "https://aistudio.google.com",
      description: "Free access to Gemini 1.5 Pro and Flash models for developers. Learn to build and test prompts."
    },
    {
      title: "Creating Gems & Opal",
      type: "Guide",
      icon: <FileText className="w-5 h-5" />,
      color: "purple",
      url: "https://gemini.google.com",
      description: "How to personalize Gemini and teach it about your business by creating custom Gems."
    },
    {
      title: "Work Automation Agents",
      type: "Tutorial",
      icon: <Video className="w-5 h-5" />,
      color: "emerald",
      url: "https://cloud.google.com/products/agent-builder",
      description: "Creating work automation for report making, launching apps, and deploying AI agents."
    },
    {
      title: "Jules.google & Code Assistants",
      type: "Tool",
      icon: <LinkIcon className="w-5 h-5" />,
      color: "orange",
      url: "https://jules.google",
      description: "Explore Jules, ChatGPT, and Codex for AI-assisted coding and development."
    },
    {
      title: "Windows & Microsoft Integration",
      type: "Docs",
      icon: <BookOpen className="w-5 h-5" />,
      color: "sky",
      url: "https://learn.microsoft.com/en-us/windows/ai/",
      description: "Integrating Google AI tools with Windows and Microsoft ecosystems."
    },
    {
      title: "Flutter & stitch.withgoogle",
      type: "Framework",
      icon: <LinkIcon className="w-5 h-5" />,
      color: "indigo",
      url: "https://flutter.dev",
      description: "Build cross-platform apps with Flutter and explore Google's experimental tools."
    }
  ];

  const getColorClasses = (color: string) => {
    const map: Record<string, { icon: string; badge: string; summary: string }> = {
      blue: { icon: "bg-blue-500/20 text-blue-400 border-blue-500/30", badge: "bg-blue-500/20 text-blue-400 border-blue-500/30", summary: "bg-blue-500/10 border-blue-500/20" },
      purple: { icon: "bg-purple-500/20 text-purple-400 border-purple-500/30", badge: "bg-purple-500/20 text-purple-400 border-purple-500/30", summary: "bg-purple-500/10 border-purple-500/20" },
      emerald: { icon: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", summary: "bg-emerald-500/10 border-emerald-500/20" },
      orange: { icon: "bg-orange-500/20 text-orange-400 border-orange-500/30", badge: "bg-orange-500/20 text-orange-400 border-orange-500/30", summary: "bg-orange-500/10 border-orange-500/20" },
      sky: { icon: "bg-sky-500/20 text-sky-400 border-sky-500/30", badge: "bg-sky-500/20 text-sky-400 border-sky-500/30", summary: "bg-sky-500/10 border-sky-500/20" },
      indigo: { icon: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30", badge: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30", summary: "bg-indigo-500/10 border-indigo-500/20" },
    };
    return map[color] || map.blue;
  };

  const handleSummarize = async (index: number, title: string, description: string) => {
    if (summaries[index]) return;
    setSummarizing(index);
    try {
      const prompt = `Provide a very brief, 2-sentence summary of the educational resource titled "${title}" which is about: ${description}. Make it sound exciting for a student.`;
      const response = await chatWithAssistant([], prompt);
      setSummaries(prev => ({ ...prev, [index]: response || "Summary unavailable." }));
    } catch (error) {
      setSummaries(prev => ({ ...prev, [index]: "Failed to generate summary." }));
    } finally {
      setSummarizing(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 overflow-y-auto flex flex-col w-full max-w-md mx-auto pb-24 h-full bg-[#0A0A0A] text-white relative"
    >
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] bg-emerald-600/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-blue-600/20 blur-[100px] rounded-full" />
      </div>

      <div className="px-6 pt-10 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-4 mb-8"
        >
          <div className="bg-white/5 p-3 rounded-2xl shadow-2xl border border-white/10 shrink-0 rotate-3 backdrop-blur-md">
            <BookOpen className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl font-light leading-tight tracking-tight text-white mb-1">
              Class <span className="font-bold text-emerald-400">Resources</span>
            </h1>
            <p className="text-white/50 text-sm font-medium leading-relaxed">
              Materials for Luke and Aleixander's session.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="px-6 py-2 flex flex-col gap-4">
        {resources.map((resource, index) => {
          const colors = getColorClasses(resource.color);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-md p-5 rounded-[2rem] border border-white/10 flex flex-col gap-4 hover:border-white/20 hover:bg-white/10 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border", colors.icon)}>
                  {resource.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold text-white truncate pr-2">{resource.title}</h3>
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border", colors.badge)}>{resource.type}</span>
                  </div>
                  <p className="text-xs font-medium text-white/50 leading-relaxed line-clamp-2">{resource.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open Resource
                </a>
                <div className="w-px h-4 bg-white/10" />
                {summaries[index] ? (
                  <div className={cn("flex-1 rounded-xl p-3 border", colors.summary)}>
                    <div className="flex gap-2 items-start">
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-white/80 leading-relaxed font-medium">{summaries[index]}</p>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleSummarize(index, resource.title, resource.description)}
                    disabled={summarizing === index}
                    className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 disabled:opacity-50 transition-colors"
                  >
                    {summarizing === index ? (
                      <>
                        <div className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                        Summarizing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Summary
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
