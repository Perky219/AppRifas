import { useState } from "react";

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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
      <div className="bg-gray-800 p-8 rounded-xl w-full max-w-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Exportar Ganadores
        </h2>

        {/* LOGO */}
        <div className="mb-6">
          <span className="font-semibold block mb-2">Subir Logo:</span>

          {/* Contenedor centrado */}
          <div className="flex justify-center">
            <label
              className="min-w-[220px] max-w-[260px] h-[140px]
                 flex flex-col items-center justify-center p-3
                 border-2 border-dashed border-gray-500 rounded-md
                 cursor-pointer hover:border-blue-400 transition text-center
                 bg-gray-900"
            >
              {/* Si NO hay logo → texto */}
              {!logo && (
                <span className="text-sm text-gray-300">
                  Seleccionar archivo
                </span>
              )}

              {/* Si hay logo → vista previa dentro del cuadro */}
              {logo && (
                <img src={logo} className="max-h-[120px] object-contain" />
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
          <p className="text-sm text-gray-400 text-center mt-2">
            {logoFile ? logoFile.name : "Ningún archivo seleccionado"}
          </p>
        </div>

        {/* CAMPOS */}
        <div className="mb-4">
          <label className="font-semibold">Centro de Trabajo:</label>
          <input
            type="text"
            value={centro}
            onChange={(e) => setCentro(e.target.value)}
            className="w-full mt-1 p-2 bg-gray-700 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="font-semibold">Unidad Programática:</label>
          <input
            type="text"
            value={up}
            onChange={(e) => setUp(e.target.value)}
            className="w-full mt-1 p-2 bg-gray-700 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="font-semibold">Actividad:</label>
          <input
            type="text"
            value={actividad}
            onChange={(e) => setActividad(e.target.value)}
            className="w-full mt-1 p-2 bg-gray-700 rounded"
          />
        </div>

        {/* FORMATOS */}
        <div className="mb-4">
          <span className="font-semibold">Formatos:</span>

          <div className="mt-2 flex flex-col gap-2">
            <label>
              <input
                type="checkbox"
                checked={exportPDF}
                onChange={() => setExportPDF(!exportPDF)}
              />
              <span className="ml-2">PDF</span>
            </label>

            <label>
              <input
                type="checkbox"
                checked={exportExcel}
                onChange={() => setExportExcel(!exportExcel)}
              />
              <span className="ml-2">Excel</span>
            </label>
          </div>
        </div>

        {/* BOTONES */}
        <div className="flex justify-between mt-6">
          <button
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded font-bold"
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
