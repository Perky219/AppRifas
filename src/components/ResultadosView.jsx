import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ExportModal from "./ExportModal";
import Footer from "./Footer";
import fondo from "../assets/fondo.jpeg";

const MAX_ANIMATED_ROWS = 30;

function ResultadosView({ ganadores, modoRifa, indiceActual, onSiguiente, onReiniciar, onExportar, exportando }) {
  const [mostrarModal, setMostrarModal] = useState(false);

  const ganadoresVisibles =
    modoRifa === "progresiva" ? ganadores.slice(0, indiceActual) : ganadores;

  const rifaTerminada =
    modoRifa === "instantanea" || indiceActual >= ganadores.length;

  return (
    <motion.div
      key="resultados"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen w-full text-white flex flex-col overflow-hidden relative"
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/60 to-slate-900/70" />

      <div className="relative z-10 flex-1 flex flex-col items-center w-full p-10">
        <motion.h1
          className="text-5xl font-extrabold mb-12 text-center text-cyan-300 drop-shadow-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Resultados de la Rifa
        </motion.h1>

        <motion.div
          className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-cyan-400/30 w-full max-w-4xl overflow-auto max-h-[60vh]"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-cyan-400/60">
                <th className="py-2 px-2 font-semibold w-1/4 text-cyan-300">Cédula</th>
                <th className="py-2 px-2 font-semibold w-1/4 text-cyan-300">Nombre</th>
                <th className="py-2 px-2 font-semibold w-2/4 text-cyan-300">Premio</th>
              </tr>
            </thead>
            <tbody>
              {ganadoresVisibles.map((g, i) =>
                i < MAX_ANIMATED_ROWS ? (
                  <motion.tr
                    key={i}
                    className="border-b border-white/10 hover:bg-cyan-500/20 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                  >
                    <td className="py-2 px-2">{g.cedula}</td>
                    <td className="py-2 px-2">{g.nombre}</td>
                    <td className="py-2 px-2">{g.premio}</td>
                  </motion.tr>
                ) : (
                  <tr key={i} className="border-b border-white/10 hover:bg-cyan-500/20 transition-colors">
                    <td className="py-2 px-2">{g.cedula}</td>
                    <td className="py-2 px-2">{g.nombre}</td>
                    <td className="py-2 px-2">{g.premio}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </motion.div>

        {modoRifa === "progresiva" && !rifaTerminada && (
          <motion.button
            className="mt-8 px-10 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg text-xl font-bold shadow-lg"
            onClick={onSiguiente}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Siguiente
          </motion.button>
        )}

        {rifaTerminada && (
          <motion.div
            className="mt-8 flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              className={`px-10 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 rounded-lg text-xl font-bold shadow-lg transition-opacity ${exportando ? "opacity-60 cursor-not-allowed" : ""}`}
              onClick={() => setMostrarModal(true)}
              disabled={exportando}
              whileHover={exportando ? {} : { scale: 1.05 }}
              whileTap={exportando ? {} : { scale: 0.95 }}
            >
              {exportando ? "Exportando..." : "Exportar"}
            </motion.button>

            <motion.button
              className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg font-semibold text-white"
              onClick={onReiniciar}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Nueva Rifa
            </motion.button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {mostrarModal && (
          <ExportModal
            onClose={() => setMostrarModal(false)}
            onConfirm={async (datos) => {
              setMostrarModal(false);
              await onExportar(datos);
            }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full">
        <Footer />
      </div>
    </motion.div>
  );
}

export default ResultadosView;
