import { useState } from "react";

function App() {
  const [socios, setSocios] = useState(null);
  const [premios, setPremios] = useState(null);

  // Función para leer CSV sencillo
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

  return (
    <div className="h-screen w-full bg-gray-900 text-white flex flex-col items-center p-10 overflow-hidden">
      {/* Título principal */}
      <h1 className="text-5xl font-extrabold mb-12 text-center">
        Sistema de Rifas
      </h1>

      {/* Contenedor dividido en 2 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl overflow-hidden">
        {/* COLUMNA IZQUIERDA: PARTICIPANTES */}
        <div className="flex flex-col bg-gray-800 p-8 rounded-xl shadow-lg w-full max-h-[70vh] overflow-hidden self-start">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Lista de Participantes
          </h2>

          {/* Si no hay socios, mostrar botón */}
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

          {/* Si hay socios, mostrar tabla */}
          {Array.isArray(socios) && socios.length > 0 && (
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

        {/* COLUMNA DERECHA: PREMIOS */}
        <div className="flex flex-col bg-gray-800 p-8 rounded-xl shadow-lg w-full max-h-[70vh] overflow-hidden self-start">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Lista de Premios
          </h2>

          {/* Botón si no se han cargado premios */}
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

          {/* Tabla si ya hay premios */}
          {Array.isArray(premios) && premios.length > 0 && (
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

      {/* BOTÓN RIFAR (solo aparece si ambas listas existen) */}
      {Array.isArray(socios) && Array.isArray(premios) && (
        <button className="mt-8 px-10 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-xl font-bold">
          Rifar
        </button>
      )}
    </div>
  );
}

export default App;
