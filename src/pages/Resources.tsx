import { useState } from "react";
import { BookOpen, FileText, Video, Link as LinkIcon, Sparkles } from "lucide-react";
import { chatWithAssistant } from "@/lib/gemini";

export default function Resources() {
  const [summarizing, setSummarizing] = useState<number | null>(null);
  const [summaries, setSummaries] = useState<Record<number, string>>({});

  const resources = [
    {
      title: "Google AI Studio & Gemini Pro",
      type: "Platform",
      icon: <Sparkles className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-100",
      description: "Free access to Gemini 1.5 Pro and Flash models for developers. Learn to build and test prompts."
    },
    {
      title: "Creating Gems & Opal",
      type: "Guide",
      icon: <FileText className="w-5 h-5 text-purple-600" />,
      bg: "bg-purple-100",
      description: "How to personalize Gemini and teach it about your business by creating custom Gems."
    },
    {
      title: "Work Automation Agents",
      type: "Tutorial",
      icon: <Video className="w-5 h-5 text-emerald-600" />,
      bg: "bg-emerald-100",
      description: "Creating work automation for report making, launching apps, and deploying AI agents."
    },
    {
      title: "Jules.google & Code Assistants",
      type: "Tool",
      icon: <LinkIcon className="w-5 h-5 text-orange-600" />,
      bg: "bg-orange-100",
      description: "Explore Jules, ChatGPT, and Codex for AI-assisted coding and development."
    },
    {
      title: "Windows & Microsoft Integration",
      type: "Docs",
      icon: <BookOpen className="w-5 h-5 text-sky-600" />,
      bg: "bg-sky-100",
      description: "Integrating Google AI tools with Windows and Microsoft ecosystems."
    },
    {
      title: "Flutter & stitch.withgoogle",
      type: "Framework",
      icon: <LinkIcon className="w-5 h-5 text-indigo-600" />,
      bg: "bg-indigo-100",
      description: "Build cross-platform apps with Flutter and explore Google's experimental tools."
    }
  ];

  const handleSummarize = async (index: number, title: string, description: string) => {
    if (summaries[index]) return; // Already summarized
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
    <div className="flex-1 overflow-y-auto flex flex-col w-full max-w-md mx-auto pb-24 h-full bg-slate-50 relative">
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-emerald-100/50 to-transparent -z-10" />
      
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-start gap-3 mb-2">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-400 p-2.5 rounded-xl shadow-lg shadow-emerald-600/20 shrink-0">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-900 mb-1">
              Class Resources
            </h1>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Materials for Luke and Aleixander's session.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-2 flex flex-col gap-4">
        {resources.map((resource, index) => (
          <div key={index} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 hover:border-emerald-300 transition-colors group">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${resource.bg}`}>
                {resource.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-slate-900 truncate pr-2">{resource.title}</h3>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider">{resource.type}</span>
                </div>
                <p className="text-xs font-medium text-slate-500 leading-relaxed line-clamp-2">{resource.description}</p>
              </div>
            </div>
            
            {/* AI Summary Section */}
            <div className="pt-3 border-t border-slate-100">
              {summaries[index] ? (
                <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100">
                  <div className="flex gap-2 items-start">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">{summaries[index]}</p>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => handleSummarize(index, resource.title, resource.description)}
                  disabled={summarizing === index}
                  className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-600 hover:text-emerald-700 disabled:opacity-50 transition-colors"
                >
                  {summarizing === index ? (
                    <>
                      <div className="w-3 h-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
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
          </div>
        ))}
      </div>
    </div>
  );
}
