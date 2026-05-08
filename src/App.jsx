import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Papa from "papaparse";

import WelcomePage from "./components/WelcomePage";
import Footer from "./components/Footer";
import RifandoView from "./components/RifandoView";
import ResultadosView from "./components/ResultadosView";

import { generarExcel } from "./utils/exportExcel";
import { generarPDF } from "./utils/exportPDF";
import fondo from "./assets/fondo.jpeg";

const MAX_ANIMATED_ROWS = 30;

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function App() {
  const [mostrarBienvenida, setMostrarBienvenida] = useState(true);
  const [socios, setSocios] = useState(null);
  const [premios, setPremios] = useState(null);
  const [sociosError, setSociosError] = useState(null);
  const [premiosError, setPremiosError] = useState(null);

  const [rifando, setRifando] = useState(false);
  const [ganadores, setGanadores] = useState(null);
  const [modoRifa, setModoRifa] = useState(null);
  const [indiceActual, setIndiceActual] = useState(0);
  const [exportando, setExportando] = useState(false);

  const leerCSV = (file, setState, setError) => {
    setError(null);
    Papa.parse(file, {
      skipEmptyLines: true,
      complete: ({ data }) => {
        if (data.length === 0) {
          setError("El archivo está vacío.");
          return;
        }
        if (data.some((row) => row.length < 2 || !row[0]?.trim() || !row[1]?.trim())) {
          setError("Formato inválido: cada fila debe tener al menos dos columnas.");
          return;
        }
        setState(data);
      },
      error: () => setError("No se pudo leer el archivo. Verifica que sea un CSV válido."),
    });
  };

  const calcularGanadores = () => {
    const participantes = shuffle(socios);
    const premiosLista = shuffle(premios);
    const cantidad = Math.min(participantes.length, premiosLista.length);
    return Array.from({ length: cantidad }, (_, i) => ({
      cedula: participantes[i][0],
      nombre: participantes[i][1],
      premio: premiosLista[i][1],
    }));
  };

  const reiniciar = () => {
    setSocios(null);
    setPremios(null);
    setSociosError(null);
    setPremiosError(null);
    setGanadores(null);
    setModoRifa(null);
    setIndiceActual(0);
    setExportando(false);
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

  const handleExportar = async (datos) => {
    setExportando(true);
    try {
      if (datos.exportExcel) await generarExcel(datos, ganadores);
      if (datos.exportPDF) await generarPDF(datos, ganadores);
    } finally {
      setExportando(false);
    }
  };

  if (mostrarBienvenida) {
    return (
      <AnimatePresence mode="wait">
        <WelcomePage key="welcome" onEnter={() => setMostrarBienvenida(false)} />
      </AnimatePresence>
    );
  }

  if (rifando) {
    return (
      <AnimatePresence mode="wait">
        <RifandoView key="rifando" />
      </AnimatePresence>
    );
  }

  if (ganadores) {
    return (
      <AnimatePresence mode="wait">
        <ResultadosView
          key="resultados"
          ganadores={ganadores}
          modoRifa={modoRifa}
          indiceActual={indiceActual}
          onSiguiente={() => setIndiceActual((prev) => prev + 1)}
          onReiniciar={reiniciar}
          onExportar={handleExportar}
          exportando={exportando}
        />
      </AnimatePresence>
    );
  }

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
                <div className="flex flex-col items-center">
                  <motion.label
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 transition rounded-lg text-lg cursor-pointer shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Subir CSV
                    <input
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={(e) => leerCSV(e.target.files[0], setSocios, setSociosError)}
                    />
                  </motion.label>
                  {sociosError && (
                    <p className="text-red-400 text-sm mt-3 text-center">{sociosError}</p>
                  )}
                </div>
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
                      {socios.map((fila, i) =>
                        i < MAX_ANIMATED_ROWS ? (
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
                        ) : (
                          <tr key={i} className="border-b border-white/10 hover:bg-cyan-500/20 transition-colors">
                            <td className="py-2 px-2">{fila[0]}</td>
                            <td className="py-2 px-2">{fila[1]}</td>
                          </tr>
                        )
                      )}
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
                <div className="flex flex-col items-center">
                  <motion.label
                    className="px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 transition rounded-lg text-lg cursor-pointer shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Subir CSV
                    <input
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={(e) => leerCSV(e.target.files[0], setPremios, setPremiosError)}
                    />
                  </motion.label>
                  {premiosError && (
                    <p className="text-red-400 text-sm mt-3 text-center">{premiosError}</p>
                  )}
                </div>
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
                      {premios.map((fila, i) =>
                        i < MAX_ANIMATED_ROWS ? (
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
                        ) : (
                          <tr key={i} className="border-b border-white/10 hover:bg-cyan-500/20 transition-colors">
                            <td className="py-2 px-2">{fila[0]}</td>
                            <td className="py-2 px-2">{fila[1]}</td>
                          </tr>
                        )
                      )}
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
