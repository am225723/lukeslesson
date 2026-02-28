import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { GripVertical, AlertCircle, PlusCircle, ArrowRight, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface Topic {
  id: string;
  title: string;
  description: string;
  type: string;
}

export default function TopicPreferences() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const initialTopics = location.state?.topics?.map((t: any, i: number) => ({
    id: `topic-${i}`,
    title: t.title,
    description: t.description,
    type: t.type
  })) || [
    { id: "t1", title: "Work Automation", description: "Creating automation for report making, agents, and launching apps.", type: "Core" },
    { id: "t2", title: "Personalizing Gemini", description: "Teaching Gemini about your business and creating custom Gems/Opal.", type: "Advanced" },
    { id: "t3", title: "Code Assistants", description: "Using Jules.google, ChatGPT, and Codex for development.", type: "Discussion" },
    { id: "t4", title: "Microsoft Integration", description: "Integrating Google AI tools with Windows and Microsoft workflows.", type: "Lab" },
  ];

  const [topics, setTopics] = useState<Topic[]>(initialTopics);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(topics);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setTopics(items);
  };

  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
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
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-500/20 border border-blue-500/30 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-blue-300 shadow-sm"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Prioritization Mode</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-light leading-[1.1] tracking-tight text-white mb-4"
        >
          Rank your <br /> <span className="font-bold text-blue-400">Learning Goals</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/50 text-sm font-medium leading-relaxed"
        >
          Drag and drop the cards to order topics from most important (top) to least important (bottom).
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-6 py-4"
      >
        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl p-4 rounded-[2rem] border border-white/10 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full -z-10 opacity-50" />
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/20 shadow-lg group-hover:rotate-0 transition-transform duration-500">
            <img alt="Instructor" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYA455Ml624fv617DhU--WS50K-YjnfoY-BrSyLzkJofuOp6GqMgggo0VI0Fy7GGlHLpuFcxzsvZpkRgvY8WX7Yx9ltefxVk6C5wlpPnpI2TteJ6FjDkDWUhY64VzCTmjfP76SH_ba7xoY94mO4Wkh1ilCN484FvjQFCF887bSXe1MA8tydGWMR3MbhwQWOTSbzPNsmq6DdsVHTOQbWpG_AGeAJAB2hH4eRmBSQm76x5ObqoNsWOVcHdjd8kcksPjj1Fjzb3urlRk" referrerPolicy="no-referrer" />
          </div>
          <div className="flex-1">
            <p className="text-base font-medium text-white tracking-tight">Aleixander Puerta</p>
            <p className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Next Session: Friday, 2:00 PM</p>
          </div>
        </div>
      </motion.div>

      <div className="px-6 py-2 relative flex-1 flex flex-col">
        <div className="absolute left-9 top-4 bottom-24 w-0.5 bg-white/5 rounded-full -z-10 border-l border-dashed border-white/10"></div>
        
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="topics">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-5">
                {topics.map((topic, index) => (
                  <Draggable key={topic.id} draggableId={topic.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={cn(
                          "group flex items-start gap-5 p-6 rounded-[2.5rem] bg-white/5 backdrop-blur-md border shadow-sm cursor-grab active:cursor-grabbing transition-all duration-300 relative z-10",
                          snapshot.isDragging ? "border-blue-500 shadow-2xl shadow-blue-500/20 scale-[1.05] rotate-1 bg-white/10" : "border-white/10 hover:border-white/20 hover:bg-white/10",
                          index === 0 && !snapshot.isDragging ? "border-blue-500/30 shadow-blue-500/5 ring-1 ring-blue-500/50" : "",
                          index > 2 && !snapshot.isDragging ? "opacity-60 grayscale-[0.5]" : ""
                        )}
                      >
                        <div className={cn("flex flex-col items-center gap-2 pt-1 transition-colors", index === 0 ? "text-blue-400" : "text-white/30 group-hover:text-blue-400")}>
                          <span className="text-[10px] font-bold uppercase tracking-widest">{getOrdinal(index + 1)}</span>
                          <div className="p-1.5 bg-black/40 border border-white/10 rounded-lg group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-colors">
                            <GripVertical className="w-5 h-5" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-white text-lg tracking-tight">{topic.title}</h3>
                            <span className={cn(
                              "text-[10px] font-bold px-3 py-1 rounded-xl uppercase tracking-widest border",
                              index % 4 === 0 ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                              index % 4 === 1 ? "bg-purple-500/20 text-purple-400 border-purple-500/30" :
                              index % 4 === 2 ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                              "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            )}>{topic.type}</span>
                          </div>
                          <p className="text-sm font-medium text-white/50 leading-relaxed">{topic.description}</p>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <motion.button 
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/student/homework")} 
          className="w-full py-6 mt-8 border border-dashed border-white/20 rounded-[2.5rem] flex items-center justify-center gap-3 text-white/40 hover:text-white hover:border-white/40 transition-all font-bold text-[11px] uppercase tracking-widest"
        >
          <PlusCircle className="w-5 h-5" />
          Add another topic
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/student/homework")}
          className="w-full py-5 mt-6 bg-white text-black rounded-[2rem] hover:bg-white/90 transition-all flex items-center justify-center gap-3 font-bold text-xs uppercase tracking-[0.2em] active:scale-[0.98]"
        >
          Confirm Priorities
          <ArrowRight className="w-4 h-4" />
        </motion.button>
        <div className="h-12"></div>
      </div>
    </motion.div>
  );
}
