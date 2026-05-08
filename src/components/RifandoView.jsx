import { motion } from "motion/react";
import fondo from "../assets/fondo.jpeg";

function RifandoView() {
  return (
    <motion.div
      key="rifando"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen w-full text-white flex flex-col justify-center items-center relative"
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/60 to-slate-900/70" />

      <div className="relative z-10 flex flex-col items-center">
        <motion.h1
          className="text-4xl font-bold mb-8 text-cyan-300 drop-shadow-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Realizando la Rifa...
        </motion.h1>

        <motion.svg
          className="h-32 w-32 text-cyan-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="12" cy="12" r="10" strokeWidth="4" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
            d="M12 6v6l4 2"
          />
        </motion.svg>
      </div>
    </motion.div>
  );
}

export default RifandoView;
