import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight, AlertCircle, ShieldCheck, Key, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export default function InstructorLogin() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length >= 4) {
      navigate("/instructor/dashboard");
    } else {
      setError(true);
      setPin("");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-full bg-[#0A0A0A] p-6 relative overflow-hidden text-white"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent_50%)] pointer-events-none" />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{ duration: 18, repeat: Infinity }}
        className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] pointer-events-none" 
      />

      <motion.button 
        whileHover={{ scale: 1.1, x: -2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate("/")} 
        className="absolute top-10 left-6 p-3 bg-white/5 rounded-2xl text-white/60 hover:text-white border border-white/10 transition-all shadow-xl z-20 backdrop-blur-md"
      >
        <ArrowLeft className="w-5 h-5" />
      </motion.button>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white/5 backdrop-blur-2xl rounded-[3rem] p-10 border border-white/10 text-center relative z-10 shadow-2xl"
      >
        <div className="relative mb-10 inline-block">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 border border-dashed border-blue-500/30 rounded-full"
          />
          <div className="relative w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
            <ShieldCheck className="w-10 h-10" />
          </div>
        </div>
        
        <h1 className="text-3xl font-light tracking-tighter mb-3 uppercase tracking-widest">Secure Access</h1>
        <p className="text-xs font-medium text-white/50 mb-10 uppercase tracking-[0.2em]">Instructor Authentication Required<br/><span className="text-blue-400 mt-2 block">Demo PIN: Any 4+ digits</span></p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative">
            <input
              type="password"
              pattern="[0-9]*"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              className={cn(
                "w-full text-center text-4xl font-light tracking-[0.4em] py-6 bg-black/40 border-2 rounded-3xl outline-none transition-all shadow-inner",
                error 
                  ? "border-red-500 text-red-500 shadow-red-500/10" 
                  : "border-white/10 focus:border-blue-500 text-white focus:ring-4 focus:ring-blue-600/10"
              )}
              placeholder="••••••"
              autoFocus
            />
            <AnimatePresence>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center gap-2 text-[10px] font-bold text-red-500 mt-4 uppercase tracking-widest"
                >
                  <AlertCircle className="w-4 h-4" /> Access Denied: Invalid PIN
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={pin.length < 4}
            className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 rounded-[2rem] transition-all disabled:opacity-30 shadow-xl shadow-blue-600/20 uppercase tracking-widest text-sm"
          >
            Authenticate <ArrowRight className="w-5 h-5" />
          </motion.button>
        </form>

        <div className="mt-10 pt-10 border-t border-white/10">
          <div className="flex items-center justify-center gap-2 text-white/40">
            <Key className="w-4 h-4" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Encrypted Session</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
