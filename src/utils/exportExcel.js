import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export async function generarExcel(datos, ganadores) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Ganadores");

  // Estilo básico
  const headerStyle = {
    font: { bold: true },
    alignment: { vertical: "middle", horizontal: "center" },
  };

  // Cabecera del documento
  sheet.addRow(["Centro de Trabajo:", datos.centro]);
  sheet.addRow(["Unidad Programática:", datos.up]);
  sheet.addRow(["Actividad:", datos.actividad]);
  sheet.addRow([]);

  // Encabezados de tabla
  const headerRow = sheet.addRow([
    "N°",
    "Detalle Premio",
    "Nombre Ganador",
    "Cédula",
    "Firma",
    "Fecha de Entrega",
  ]);

  headerRow.eachCell((cell) => {
    cell.style = headerStyle;
  });

  // Datos de ganadores
  ganadores.forEach((g, i) => {
    sheet.addRow([i + 1, g.premio, g.nombre, g.cedula, "", ""]);
  });

  // Ajuste automático de ancho
  sheet.columns.forEach((col) => {
    let max = 10;
    col.eachCell({ includeEmpty: true }, (cell) => {
      const length = cell.value ? cell.value.toString().length : 0;
      if (length > max) max = length;
    });
    col.width = max + 2;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "ganadores.xlsx");
}
