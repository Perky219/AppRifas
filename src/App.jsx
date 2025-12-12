import { useState } from "react";
import ExportModal from "./components/ExportModal";

import { generarExcel } from "./utils/exportExcel";
import { generarPDF } from "./utils/exportPDF";

function App() {
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

  if (ganadores) {
    const ganadoresVisibles =
      modoRifa === "progresiva"
        ? ganadores.slice(0, indiceActual)
        : ganadores;

    const rifaTerminada =
      modoRifa === "instantanea" ||
      indiceActual >= ganadores.length;

    return (
      <div className="h-screen w-full bg-gray-900 text-white flex flex-col items-center p-10 overflow-hidden">
        <h1 className="text-5xl font-extrabold mb-12 text-center">
          Resultados de la Rifa
        </h1>

        <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-4xl overflow-auto max-h-[70vh]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-2 px-2 font-semibold w-1/4">Cédula</th>
                <th className="py-2 px-2 font-semibold w-1/4">Nombre</th>
                <th className="py-2 px-2 font-semibold w-2/4">Premio</th>
              </tr>
            </thead>
            <tbody>
              {ganadoresVisibles.map((g, i) => (
                <tr key={i} className="border-b border-gray-700">
                  <td className="py-2 px-2">{g.cedula}</td>
                  <td className="py-2 px-2">{g.nombre}</td>
                  <td className="py-2 px-2">{g.premio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* BOTÓN SIGUIENTE */}
        {modoRifa === "progresiva" && !rifaTerminada && (
          <button
            className="mt-8 px-10 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-xl font-bold"
            onClick={() => setIndiceActual((prev) => prev + 1)}
          >
            Siguiente
          </button>
        )}

        {/* BOTÓN EXPORTAR */}
        {rifaTerminada && (
          <>
            <button
              className="mt-8 px-10 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-xl font-bold"
              onClick={() => setMostrarModal(true)}
            >
              Exportar
            </button>

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
          </>
        )}
      </div>
    );
  }

  if (rifando) {
    return (
      <div className="h-screen w-full bg-gray-900 text-white flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold mb-8">Realizando la Rifa...</h1>

        <svg
          className="animate-spin h-32 w-32 text-purple-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <circle cx="12" cy="12" r="10" strokeWidth="4" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
            d="M12 6v6l4 2"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gray-900 text-white flex flex-col items-center p-10 overflow-hidden">
      <h1 className="text-5xl font-extrabold mb-12 text-center">
        Sistema de Rifas
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl overflow-hidden">
        {/* PARTICIPANTES */}
        <div className="flex flex-col bg-gray-800 p-8 rounded-xl shadow-lg w-full max-h-[70vh] overflow-hidden self-start">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Lista de Participantes
          </h2>

          {!Array.isArray(socios) && (
            <label className="mx-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 transition rounded-lg text-lg cursor-pointer">
              Subir CSV
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => leerCSV(e.target.files[0], setSocios)}
              />
            </label>
          )}

          {Array.isArray(socios) && (
            <div className="w-full mt-4 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-2 px-2 font-semibold w-1/3">Cédula</th>
                    <th className="py-2 px-2 font-semibold w-2/3">Nombre</th>
                  </tr>
                </thead>
                <tbody>
                  {socios.map((fila, i) => (
                    <tr key={i} className="border-b border-gray-700">
                      <td className="py-2 px-2">{fila[0]}</td>
                      <td className="py-2 px-2">{fila[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* PREMIOS */}
        <div className="flex flex-col bg-gray-800 p-8 rounded-xl shadow-lg w-full max-h-[70vh] overflow-hidden self-start">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Lista de Premios
          </h2>

          {!Array.isArray(premios) && (
            <label className="mx-auto px-6 py-3 bg-green-600 hover:bg-green-700 transition rounded-lg text-lg cursor-pointer">
              Subir CSV
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => leerCSV(e.target.files[0], setPremios)}
              />
            </label>
          )}

          {Array.isArray(premios) && (
            <div className="w-full mt-4 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-2 px-2 font-semibold w-1/4">ID</th>
                    <th className="py-2 px-2 font-semibold w-3/4">
                      Descripción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {premios.map((fila, i) => (
                    <tr key={i} className="border-b border-gray-700">
                      <td className="py-2 px-2">{fila[0]}</td>
                      <td className="py-2 px-2">{fila[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* BOTONES DE RIFA */}
      {Array.isArray(socios) && Array.isArray(premios) && (
        <div className="mt-8 flex gap-6">
          <button
            className="px-10 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-xl font-bold"
            onClick={rifaInstantanea}
          >
            Rifa instantánea
          </button>

          <button
            className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xl font-bold"
            onClick={rifaProgresiva}
          >
            Rifa progresiva
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
