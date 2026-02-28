import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, Calendar, Bot, ClipboardList, BookOpen, ArrowLeft, MoreHorizontal, Share, Info, MonitorPlay, Sparkles, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

export function MobileLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const isInstructor = location.pathname.startsWith("/instructor");
  const isStudent = location.pathname.startsWith("/student");

  const getHeaderTitle = () => {
    if (location.pathname.includes("goal-entry")) return "Goal Entry";
    if (location.pathname.includes("goal-breakdown")) return "Goal Breakdown";
    if (location.pathname.includes("topic-preferences")) return "Topic Preferences";
    if (location.pathname.includes("homework")) return "Homework";
    if (location.pathname.includes("dashboard")) return "Dashboard";
    if (location.pathname.includes("lesson-plan")) return "Lesson Plan";
    if (location.pathname.includes("session-summary")) return "Session Summary";
    if (location.pathname.includes("submission-review")) return "Submission Review";
    if (location.pathname.includes("ai-assistant")) return "AI Learning Assistant";
    if (location.pathname.includes("resources")) return "Resources";
    if (location.pathname.includes("workspace")) return "Workspace";
    return "";
  };

  const showHeader = location.pathname !== "/" && !location.pathname.includes("dashboard") && !location.pathname.includes("login");

  return (
    <div className="flex flex-col h-screen bg-[#0A0A0A] text-white font-sans overflow-hidden">
      {/* Header */}
      <AnimatePresence mode="wait">
        {showHeader && (
          <motion.header 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="flex items-center justify-between px-6 py-4 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/10 shrink-0 z-40 sticky top-0"
          >
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center justify-center w-10 h-10 rounded-2xl hover:bg-white/10 transition-all active:scale-90"
            >
              <ArrowLeft className="w-5 h-5 text-white/60" />
            </button>
            
            <div className="flex flex-col items-center flex-1 px-2">
              <motion.h2 
                key={location.pathname}
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-[16px] font-medium tracking-tight text-white text-center"
              >
                {getHeaderTitle()}
              </motion.h2>
              {location.pathname.includes("topic-preferences") && <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider mt-0.5">Luke D'Amato</span>}
              {location.pathname.includes("ai-assistant") && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                  </span>
                  <span className="text-[9px] text-white/50 font-bold uppercase tracking-widest">AI Online</span>
                </div>
              )}
            </div>

            <button 
              onClick={() => navigate("/")}
              className="flex items-center justify-center w-10 h-10 rounded-2xl hover:bg-red-500/20 transition-all active:scale-90 text-red-400"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="h-full w-full overflow-y-auto"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      {location.pathname !== "/" && !location.pathname.includes("login") && (
        <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border-t border-white/10 shrink-0 pb-2 pt-2 px-6 z-50">
          <nav className="flex justify-between items-center max-w-md mx-auto relative">
            <NavButton 
              active={location.pathname.includes("dashboard") || location.pathname.includes("goal-entry")}
              onClick={() => navigate(isInstructor ? "/instructor/dashboard" : "/student/goal-entry")}
              icon={<Home className="w-5 h-5" />}
            />
            
            <NavButton 
              active={location.pathname.includes("lesson-plan") || location.pathname.includes("topic-preferences") || location.pathname.includes("goal-breakdown")}
              onClick={() => navigate(isInstructor ? "/instructor/lesson-plan" : "/student/topic-preferences")}
              icon={<Calendar className="w-5 h-5" />}
            />

            <div className="relative -top-4 px-2">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(isInstructor ? "/instructor/ai-assistant" : "/student/ai-assistant")} 
                className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-600/20 flex items-center justify-center relative group overflow-hidden border border-white/10"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Bot className="w-6 h-6 relative z-10" />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-white/20 border-dashed rounded-full scale-110"
                />
              </motion.button>
            </div>

            <NavButton 
              active={location.pathname.includes("workspace")}
              onClick={() => navigate("/workspace")}
              icon={<MonitorPlay className="w-5 h-5" />}
            />

            <NavButton 
              active={location.pathname.includes("submission-review") || location.pathname.includes("homework")}
              onClick={() => navigate(isInstructor ? "/instructor/submission-review" : "/student/homework")}
              icon={<ClipboardList className="w-5 h-5" />}
            />
          </nav>
        </div>
      )}
    </div>
  );
}

function NavButton({ active, onClick, icon }: { active: boolean; onClick: () => void; icon: React.ReactNode }) {
  return (
    <button 
      onClick={onClick} 
      className={cn(
        "flex flex-col items-center justify-center transition-all duration-300 relative py-2",
        active ? "text-blue-400" : "text-white/40 hover:text-white/60"
      )}
    >
      <div className={cn(
        "transition-transform duration-300",
        active ? "scale-110" : "hover:scale-110"
      )}>
        {icon}
      </div>
      {active && (
        <motion.div 
          layoutId="nav-indicator"
          className="absolute -bottom-1 w-1 h-1 rounded-full bg-blue-400"
        />
      )}
    </button>
  );
}
