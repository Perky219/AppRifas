import { useState } from "react";
import { motion, AnimatePresence } from 'motion/react';
import ExportModal from "./components/ExportModal";
import WelcomePage from "./components/WelcomePage";
import Footer from "./components/Footer";

import { generarExcel } from "./utils/exportExcel";
import { generarPDF } from "./utils/exportPDF";

import fondo from './assets/fondo.jpeg';

function App() {
  const [mostrarBienvenida, setMostrarBienvenida] = useState(true);
  const [socios, setSocios] = useState(null);
  const [premios, setPremios] = useState(null);

  const [rifando, setRifando] = useState(false);
  const [ganadores, setGanadores] = useState(null);

  const [modoRifa, setModoRifa] = useState(null); // "instantanea" | "progresiva"
  const [indiceActual, setIndiceActual] = useState(0);

  const [mostrarModal, setMostrarModal] = useState(false);

  const leerCSV = (file, setState) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const texto = event.target.result;
      const filas = texto
        .trim()
        .split("\n")
        .map((line) => line.split(","));
      setState(filas);
    };
    reader.readAsText(file);
  };

  const calcularGanadores = () => {
    const participantes = [...socios];
    const premiosLista = [...premios];

    participantes.sort(() => Math.random() - 0.5);
    premiosLista.sort(() => Math.random() - 0.5);

    const cantidad = Math.min(participantes.length, premiosLista.length);
    const resultados = [];

    for (let i = 0; i < cantidad; i++) {
      resultados.push({
        cedula: participantes[i][0],
        nombre: participantes[i][1],
        premio: premiosLista[i][1],
      });
    }

    return resultados;
  };

  const rifaInstantanea = () => {
    setModoRifa("instantanea");
    setRifando(true);

    setTimeout(() => {
      setGanadores(calcularGanadores());
      setRifando(false);
    }, 3500);
  };

  const rifaProgresiva = () => {
    setModoRifa("progresiva");
    setIndiceActual(1);
    setRifando(true);

    setTimeout(() => {
      setGanadores(calcularGanadores());
      setRifando(false);
    }, 1000);
  };

  // Vista de bienvenida
  if (mostrarBienvenida) {
    return (
      <AnimatePresence mode="wait">
        <WelcomePage key="welcome" onEnter={() => setMostrarBienvenida(false)} />
      </AnimatePresence>
    );
  }

  // Vista de resultados
  if (ganadores) {
    const ganadoresVisibles =
      modoRifa === "progresiva"
        ? ganadores.slice(0, indiceActual)
        : ganadores;

    const rifaTerminada =
      modoRifa === "instantanea" ||
      indiceActual >= ganadores.length;

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="resultados"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.4 }}
          className="min-h-screen w-full text-white flex flex-col overflow-hidden relative"
          style={{
            backgroundImage: `url(${fondo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/60 to-slate-900/70"></div>
          
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
                  {ganadoresVisibles.map((g, i) => (
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
                  ))}
                </tbody>
              </table>
            </motion.div>

            {/* BOTÓN SIGUIENTE */}
            {modoRifa === "progresiva" && !rifaTerminada && (
              <motion.button
                className="mt-8 px-10 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg text-xl font-bold shadow-lg"
                onClick={() => setIndiceActual((prev) => prev + 1)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Siguiente
              </motion.button>
            )}

            {/* BOTÓN EXPORTAR */}
            {rifaTerminada && (
              <>
                <motion.button
                  className="mt-8 px-10 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 rounded-lg text-xl font-bold shadow-lg"
                  onClick={() => setMostrarModal(true)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Exportar
                </motion.button>

                <AnimatePresence>
                  {mostrarModal && (
                    <ExportModal
                      onClose={() => setMostrarModal(false)}
                      onConfirm={async (datos) => {
                        setMostrarModal(false);

                        if (datos.exportExcel) {
                          await generarExcel(datos, ganadores);
                        }

                        if (datos.exportPDF) {
                          await generarPDF(datos, ganadores);
                        }
                      }}
                    />
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
          
          <div className="relative z-10 w-full">
            <Footer />
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Vista de "rifando"
  if (rifando) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="rifando"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen w-full text-white flex flex-col justify-center items-center relative"
          style={{
            backgroundImage: `url(${fondo})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/60 to-slate-900/70"></div>
          
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
      </AnimatePresence>
    );
  }

  // Vista principal
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="main"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen w-full text-white flex flex-col overflow-hidden relative"
        style={{
          backgroundImage: `url(${fondo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/60 to-slate-900/70"></div>
        
        <div className="relative z-10 flex-1 flex flex-col items-center w-full p-10">
          <motion.h1 
            className="text-5xl font-extrabold mb-12 text-center text-cyan-300 drop-shadow-lg"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Sistema de Rifas
          </motion.h1>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* PARTICIPANTES */}
            <motion.div 
              className="flex flex-col bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-cyan-400/30 w-full max-h-[60vh] overflow-hidden self-start"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-center text-cyan-300">
                Lista de Participantes
              </h2>

              {!Array.isArray(socios) && (
                <motion.label 
                  className="mx-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 transition rounded-lg text-lg cursor-pointer shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subir CSV
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => leerCSV(e.target.files[0], setSocios)}
                  />
                </motion.label>
              )}

              {Array.isArray(socios) && (
                <div className="w-full mt-4 overflow-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-cyan-400/60">
                        <th className="py-2 px-2 font-semibold w-1/3 text-cyan-300">Cédula</th>
                        <th className="py-2 px-2 font-semibold w-2/3 text-cyan-300">Nombre</th>
                      </tr>
                    </thead>
                    <tbody>
                      {socios.map((fila, i) => (
                        <motion.tr 
                          key={i} 
                          className="border-b border-white/10 hover:bg-cyan-500/20 transition-colors"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                        >
                          <td className="py-2 px-2">{fila[0]}</td>
                          <td className="py-2 px-2">{fila[1]}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>

            {/* PREMIOS */}
            <motion.div 
              className="flex flex-col bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-cyan-400/30 w-full max-h-[60vh] overflow-hidden self-start"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-center text-cyan-300">
                Lista de Premios
              </h2>

              {!Array.isArray(premios) && (
                <motion.label 
                  className="mx-auto px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 transition rounded-lg text-lg cursor-pointer shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subir CSV
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => leerCSV(e.target.files[0], setPremios)}
                  />
                </motion.label>
              )}

              {Array.isArray(premios) && (
                <div className="w-full mt-4 overflow-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-cyan-400/60">
                        <th className="py-2 px-2 font-semibold w-1/4 text-cyan-300">ID</th>
                        <th className="py-2 px-2 font-semibold w-3/4 text-cyan-300">
                          Descripción
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {premios.map((fila, i) => (
                        <motion.tr 
                          key={i} 
                          className="border-b border-white/10 hover:bg-cyan-500/20 transition-colors"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                        >
                          <td className="py-2 px-2">{fila[0]}</td>
                          <td className="py-2 px-2">{fila[1]}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* BOTONES DE RIFA */}
          {Array.isArray(socios) && Array.isArray(premios) && (
            <motion.div 
              className="mt-8 flex gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 rounded-lg text-xl font-bold shadow-lg"
                onClick={rifaInstantanea}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Rifa instantánea
              </motion.button>

              <motion.button
                className="px-10 py-4 bg-gradient-to-r from-sky-600 to-blue-500 hover:from-sky-700 hover:to-blue-600 rounded-lg text-xl font-bold shadow-lg"
                onClick={rifaProgresiva}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Rifa progresiva
              </motion.button>
            </motion.div>
          )}
        </div>
        
        <div className="relative z-10 w-full">
          <Footer />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
