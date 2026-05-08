function fileToBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

export async function generarPDF(datos, ganadores) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const { logoFile, centro, up, actividad } = datos;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  let logoBase64 = null;
  if (logoFile) logoBase64 = await fileToBase64(logoFile);

  const ganadoresPorPagina = 10;
  const totalPaginas = Math.ceil(ganadores.length / ganadoresPorPagina);

  // Función para dibujar el encabezado de cada página
  const dibujarEncabezado = (doc) => {
    const topMargin = 40;

    if (logoBase64) {
      // 200 px de ancho, proporcionado
      doc.addImage(logoBase64, "PNG", 40, topMargin, 200, 120);
    }

    autoTable(doc, {
      startY: topMargin + 10,
      margin: { left: 260 },
      tableWidth: 280,
      theme: "grid",

      styles: {
        fontSize: 11,
        lineWidth: 0.4,
        halign: "left",
      },

      // Esto crea dos columnas, pero sin "headers"
      head: [],
      body: [
        ["Centro de trabajo:", centro || ""],
        ["Unidad programática:", up || ""],
        ["Actividad:", actividad || ""],
      ],

      columnStyles: {
        0: { cellWidth: 110, fontStyle: "bold" },
        1: { cellWidth: 170 },
      },
    });

    let y = doc.lastAutoTable.finalY + 60; // bajamos más para evitar el choque con el logo

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(20);
    doc.text("LISTA OFICIAL DE GANADORES", pageWidth / 2, y, {
      align: "center",
    });
    y += 28;

    doc.setFontSize(14);
    doc.text("PREMIOS RECIBIDOS", pageWidth / 2, y, { align: "center" });
    y += 30;

    return y;
  };

  // Generar cada página con máximo 10 ganadores
  for (let pagina = 0; pagina < totalPaginas; pagina++) {
    // Si no es la primera página, agregar una nueva
    if (pagina > 0) {
      doc.addPage();
    }

    // Dibujar encabezado en cada página
    const startY = dibujarEncabezado(doc);

    // Obtener los ganadores para esta página
    const inicio = pagina * ganadoresPorPagina;
    const fin = Math.min(inicio + ganadoresPorPagina, ganadores.length);
    const ganadoresPagina = ganadores.slice(inicio, fin);

    // Generar tabla con los ganadores de esta página
    autoTable(doc, {
      startY: startY,
      theme: "grid",
      margin: { left: 30, right: 30 }, // Evita que se salga del A4

      head: [
        [
          "N°",
          "Detalle premio",
          "Nombre ganador",
          "Cédula",
          "Firma",
          "Fecha entrega",
        ],
      ],

      body: ganadoresPagina.map((g, i) => [
        inicio + i + 1,
        g.premio,
        g.nombre,
        g.cedula,
        "",
        "",
      ]),

      headStyles: {
        fillColor: [0, 0, 0],
        textColor: 255,
        fontSize: 11,
      },

      styles: {
        fontSize: 10,
        cellPadding: 4,
      },

      columnStyles: {
        0: { cellWidth: 25 }, // N°
        1: { cellWidth: 130 }, // Premio
        2: { cellWidth: 130 }, // Nombre
        3: { cellWidth: 70 }, // Cédula
        4: { cellWidth: 80 }, // Firma
        5: { cellWidth: 80 }, // Fecha
      },
    });
  }

  doc.save("lista_ganadores.pdf");
}
