function App() {
  return (
    <div className="min-h-screen w-full bg-gray-900 text-white flex flex-col items-center p-10">
      {/* Título principal */}
      <h1 className="text-5xl font-extrabold mb-12 text-center">
        Sistema de Rifas
      </h1>

      {/* Contenedor dividido en 2 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
        {/* Columna 1: Participantes */}
        <div className="flex flex-col items-center bg-gray-800 p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Lista de Participantes</h2>

          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 transition rounded-lg text-lg cursor-pointer">
            Subir CSV
          </button>
        </div>

        {/* Columna 2: Premios */}
        <div className="flex flex-col items-center bg-gray-800 p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Lista de Premios</h2>

          <button className="px-6 py-3 bg-green-600 hover:bg-green-700 transition rounded-lg text-lg cursor-pointer">
            Subir CSV
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
