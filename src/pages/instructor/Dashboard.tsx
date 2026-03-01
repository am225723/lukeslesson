import { useNavigate } from "react-router-dom";
import { Bell, Clock, Video, ArrowUpRight, LogOut, Activity, CheckCircle2, MonitorPlay, Target, BookOpen, Zap, Circle } from "lucide-react";
import { motion } from "motion/react";
import { useSession } from "@/context/SessionContext";
import { toast } from "sonner";

export default function Dashboard() {
  const navigate = useNavigate();
  const { goals, topics, topicOrder, homeworkStatus, completedActivities } = useSession();

  const orderedTopics = topicOrder.length > 0
    ? topicOrder.map(id => topics.find(t => t.id === id)).filter(Boolean)
    : topics;

  const totalDuration = orderedTopics.reduce((sum, t) => sum + (t?.duration || 0), 0);

  const homeworkEntries = Object.entries(homeworkStatus);
  const completedCount = homeworkEntries.filter(([, v]) => v.status === "completed").length;
  const totalHomework = homeworkEntries.length;

  return (
    <div className="flex-1 overflow-y-auto flex flex-col w-full max-w-md mx-auto px-6 pb-24 bg-[#0A0A0A] text-white h-full relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[40%] bg-emerald-600/10 blur-[100px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between py-8 shrink-0"
      >
        <div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1"
          >
            Instructor Portal
          </motion.h2>
          <h1 className="text-3xl font-light tracking-tight">
            Hello, <span className="font-bold text-indigo-400">Aleixander</span>
          </h1>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative flex gap-2">
          <button
            onClick={() => toast.info("You have 3 new notifications.", { description: "Luke submitted his homework. System update scheduled." })}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-md"
          >
            <Bell className="w-5 h-5 text-white/80" />
          </button>
          <span className="absolute top-2 right-14 w-3 h-3 bg-indigo-500 border-2 border-[#0A0A0A] rounded-full"></span>
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-red-500/20 text-red-400 transition-colors backdrop-blur-md"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-[2rem] p-6 border border-white/10 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-[80px] -z-0 group-hover:scale-110 transition-transform duration-700" />

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-[10px] font-bold uppercase tracking-wider text-indigo-300 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                Next Session • 10:00 AM
              </div>
              <h3 className="text-2xl font-medium text-white tracking-tight leading-tight">
                {goals.length > 0 ? "Session with Luke" : "Review: Intro to AI"}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-8 bg-black/20 p-4 rounded-2xl border border-white/5">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/20">
              <img alt="Student Luke" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYA455Ml624fv617DhU--WS50K-YjnfoY-BrSyLzkJofuOp6GqMgggo0VI0Fy7GGlHLpuFcxzsvZpkRgvY8WX7Yx9ltefxVk6C5wlpPnpI2TteJ6FjDkDWUhY64VzCTmjfP76SH_ba7xoY94mO4Wkh1ilCN484FvjQFCF887bSXe1MA8tydGWMR3MbhwQWOTSbzPNsmq6DdsVHTOQbWpG_AGeAJAB2hH4eRmBSQm76x5ObqoNsWOVcHdjd8kcksPjj1Fjzb3urlRk" referrerPolicy="no-referrer" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0A0A0A] rounded-full" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">Luke D'Amato</p>
              <p className="text-[10px] font-medium text-white/50 uppercase tracking-widest">Software Engineering</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-white flex items-center justify-end gap-1.5">
                <Clock className="w-4 h-4 text-indigo-400" /> {totalDuration > 0 ? `${totalDuration}m` : "45m"}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/instructor/lesson-plan")}
              className="flex-1 bg-white text-black font-bold py-4 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:bg-white/90"
            >
              <Video className="w-4 h-4" />
              Start Meeting
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/workspace")}
              className="px-5 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md border border-white/10 transition-all flex items-center justify-center"
              title="Open Workspace"
            >
              <MonitorPlay className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/5 p-5 rounded-[2rem] border border-white/10 relative overflow-hidden group hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center gap-2 mb-3 text-emerald-400">
            <Activity className="w-4 h-4" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Engagement</span>
          </div>
          <p className="text-3xl font-light text-white tracking-tighter">
            {completedActivities.length > 0 ? "High" : "—"}
          </p>
          <p className="text-[9px] font-bold text-white/40 mt-1 uppercase tracking-widest">
            {completedActivities.length > 0 ? `${completedActivities.length} actions today` : "Awaiting activity"}
          </p>
          {completedActivities.length > 0 && (
            <div className="absolute top-4 right-4">
              <Circle className="w-2.5 h-2.5 fill-emerald-500 text-emerald-500 animate-pulse" />
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/5 p-5 rounded-[2rem] border border-white/10 relative overflow-hidden group hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center gap-2 mb-3 text-indigo-400">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Homework</span>
          </div>
          <p className="text-3xl font-light text-white tracking-tighter">
            {totalHomework > 0 ? completedCount : "0"}<span className="text-lg text-white/30">/{totalHomework > 0 ? totalHomework : "0"}</span>
          </p>
          <p className="text-[9px] font-bold text-white/40 mt-1 uppercase tracking-widest">
            {totalHomework > 0 ? "Submitted" : "No assignments yet"}
          </p>
          {completedCount > 0 && (
            <div className="absolute top-4 right-4">
              <Circle className="w-2.5 h-2.5 fill-emerald-500 text-emerald-500" />
            </div>
          )}
        </motion.div>
      </div>

      {goals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Luke's Goals</h3>
            <div className="flex items-center gap-1.5">
              <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Live</span>
            </div>
          </div>
          <div className="space-y-2">
            {goals.map((goal, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5"
              >
                <Target className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <p className="text-sm text-white/80">{goal}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Session Agenda</h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
            {totalDuration > 0 ? `${totalDuration}m` : "45m"} Total
          </span>
        </div>

        <div className="space-y-3">
          {orderedTopics.length > 0 ? (
            orderedTopics.map((topic, i) => (
              <AgendaItem
                key={topic!.id}
                time={`${topic!.duration}m`}
                title={topic!.title}
                desc={topic!.description}
                type={topic!.type}
                onClick={() => navigate("/instructor/lesson-plan")}
                delay={0.3 + i * 0.1}
                isActive={i === 0}
              />
            ))
          ) : (
            <>
              <AgendaItem
                time="10m"
                title="Review Past Goals"
                desc="Discussion on weekly achievements"
                onClick={() => navigate("/instructor/session-summary")}
                delay={0.3}
              />
              <AgendaItem
                time="20m"
                title="Core Topic: AI Ethics"
                desc="Deep dive into bias and fairness"
                onClick={() => navigate("/instructor/submission-review")}
                delay={0.4}
              />
              <AgendaItem
                time="15m"
                title="Action Plan & Wrap-up"
                desc="Setting targets for next week"
                onClick={() => navigate("/instructor/ai-assistant")}
                delay={0.5}
              />
            </>
          )}
        </div>
      </div>

      {completedActivities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 mb-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Luke's Activity Feed</h3>
            <div className="flex items-center gap-1.5">
              <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Recent</span>
            </div>
          </div>
          <div className="space-y-2">
            {completedActivities.slice(-5).reverse().map((activity, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.05 }}
                className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <p className="text-xs text-white/70 flex-1">{activity}</p>
                <Circle className="w-1.5 h-1.5 fill-emerald-500 text-emerald-500 shrink-0" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {totalHomework > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 mb-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Homework Status</h3>
            <button
              onClick={() => navigate("/instructor/submission-review")}
              className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Review All
            </button>
          </div>
          <div className="space-y-2">
            {homeworkEntries.map(([id, info], i) => (
              <div
                key={id}
                className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <p className="text-xs text-white/70 flex-1 capitalize">{id.replace(/-/g, " ")}</p>
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                  info.status === "completed"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : info.status === "in_progress"
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-white/10 text-white/40"
                }`}>
                  {info.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function AgendaItem({ time, title, desc, type, onClick, delay, isActive }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      whileHover={{ x: 5 }}
      onClick={onClick}
      className="group bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer"
    >
      <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-black/40 border border-white/5 text-white font-bold text-xs shrink-0 group-hover:bg-indigo-500/20 group-hover:text-indigo-300 group-hover:border-indigo-500/30 transition-all duration-300 relative">
        <span>{time.replace("m", "")}</span>
        <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">min</span>
        {isActive && (
          <div className="absolute -top-1 -right-1">
            <Circle className="w-2.5 h-2.5 fill-emerald-500 text-emerald-500 animate-pulse" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors">{title}</h4>
        <p className="text-[10px] text-white/50 mt-0.5">{desc}</p>
        {type && (
          <span className="inline-block mt-1 text-[8px] font-bold uppercase tracking-widest text-indigo-400/60 bg-indigo-500/10 px-1.5 py-0.5 rounded">
            {type}
          </span>
        )}
      </div>
      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-white/30 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all">
        <ArrowUpRight className="w-4 h-4" />
      </div>
    </motion.div>
  );
}
