import { useState } from "react";
import fondo from '../assets/fondo.jpeg';

function ExportModal({ onClose, onConfirm }) {
  const [logo, setLogo] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const [centro, setCentro] = useState("");
  const [up, setUp] = useState("");
  const [actividad, setActividad] = useState("");

  const [exportPDF, setExportPDF] = useState(false);
  const [exportExcel, setExportExcel] = useState(false);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogo(URL.createObjectURL(file));
    }
  };

  const handleConfirm = () => {
    onConfirm({
      logoFile, // archivo real para el PDF
      logoPreview: logo, // vista previa
      centro,
      up,
      actividad,
      exportPDF,
      exportExcel,
    });
  };

  return (
    <div 
      className="fixed inset-0 flex justify-center items-center z-50 p-4"
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/80"></div>
      
      {/* Modal con glassmorphism */}
      <div className="relative bg-white/10 backdrop-blur-xl p-6 rounded-2xl w-full max-w-md shadow-2xl border border-cyan-400/30 max-h-[85vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-center text-cyan-300 drop-shadow-lg">
          Exportar Ganadores
        </h2>

        {/* LOGO */}
        <div className="mb-4">
          <span className="font-semibold block mb-2 text-white text-sm">Subir Logo:</span>

          {/* Contenedor centrado */}
          <div className="flex justify-center">
            <label
              className="w-[180px] h-[100px]
                 flex flex-col items-center justify-center p-2
                 border-2 border-dashed border-cyan-400/50 rounded-lg
                 cursor-pointer hover:border-cyan-300 hover:bg-white/5 transition-all text-center
                 bg-white/5 backdrop-blur-sm"
            >
              {/* Si NO hay logo → texto */}
              {!logo && (
                <span className="text-xs text-gray-200">
                  Seleccionar archivo
                </span>
              )}

              {/* Si hay logo → vista previa dentro del cuadro */}
              {logo && (
                <img src={logo} alt="Logo preview" className="max-h-[85px] object-contain" />
              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
            </label>
          </div>

          {/* Texto del archivo abajo */}
          <p className="text-xs text-gray-300 text-center mt-1">
            {logoFile ? logoFile.name : "Ningún archivo seleccionado"}
          </p>
        </div>

        {/* CAMPOS */}
        <div className="mb-3">
          <label className="font-semibold text-white text-sm">Centro de Trabajo:</label>
          <input
            type="text"
            value={centro}
            onChange={(e) => setCentro(e.target.value)}
            className="w-full mt-1 p-2 text-sm bg-white/10 backdrop-blur-sm rounded-lg text-white placeholder-gray-400 border border-cyan-400/30 focus:border-cyan-400 focus:outline-none transition-all"
            placeholder="Ingrese el centro de trabajo"
          />
        </div>

        <div className="mb-3">
          <label className="font-semibold text-white text-sm">Unidad Programática:</label>
          <input
            type="text"
            value={up}
            onChange={(e) => setUp(e.target.value)}
            className="w-full mt-1 p-2 text-sm bg-white/10 backdrop-blur-sm rounded-lg text-white placeholder-gray-400 border border-cyan-400/30 focus:border-cyan-400 focus:outline-none transition-all"
            placeholder="Ingrese la unidad programática"
          />
        </div>

        <div className="mb-3">
          <label className="font-semibold text-white text-sm">Actividad:</label>
          <input
            type="text"
            value={actividad}
            onChange={(e) => setActividad(e.target.value)}
            className="w-full mt-1 p-2 text-sm bg-white/10 backdrop-blur-sm rounded-lg text-white placeholder-gray-400 border border-cyan-400/30 focus:border-cyan-400 focus:outline-none transition-all"
            placeholder="Ingrese la actividad"
          />
        </div>

        {/* FORMATOS */}
        <div className="mb-4">
          <span className="font-semibold text-white block mb-2 text-sm">Formatos de Exportación:</span>

          <div className="flex flex-col gap-2 bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-cyan-400/20">
            <label className="flex items-center cursor-pointer hover:bg-white/5 px-2 py-1 rounded transition-all">
              <input
                type="checkbox"
                checked={exportPDF}
                onChange={() => setExportPDF(!exportPDF)}
                className="w-4 h-4 accent-cyan-400"
              />
              <span className="ml-2 text-white text-sm">PDF</span>
            </label>

            <label className="flex items-center cursor-pointer hover:bg-white/5 px-2 py-1 rounded transition-all">
              <input
                type="checkbox"
                checked={exportExcel}
                onChange={() => setExportExcel(!exportExcel)}
                className="w-4 h-4 accent-cyan-400"
              />
              <span className="ml-2 text-white text-sm">Excel</span>
            </label>
          </div>
        </div>

        {/* BOTONES */}
        <div className="flex gap-3 mt-4">
          <button
            className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg font-semibold text-white text-sm border border-white/30 transition-all"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg font-bold text-white text-sm shadow-lg border border-white/30 transition-all transform hover:scale-105"
            onClick={handleConfirm}
          >
            Exportar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExportModal;
