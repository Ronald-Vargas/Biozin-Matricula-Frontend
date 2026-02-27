
import { Injectable } from '@angular/core';
import { MallaCurricular } from '../../asignaciones/models/asignacion.model';
import { Carrera } from '../../carreras/models/carrera.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})

export class PdfGeneratorService {

  constructor() { }

  // Generar Plan de Estudios en PDF
  generarPlanEstudios(carrera: Carrera, malla: MallaCurricular): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Encabezado
    doc.setFillColor(15, 23, 42); // Color primario
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Logo o nombre de la universidad
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('UNIVERSIDAD EXAMPLE', pageWidth / 2, 15, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Plan de Estudios', pageWidth / 2, 25, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleDateString()}`, pageWidth / 2, 32, { align: 'center' });

    // Información de la carrera
    let yPos = 50;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(carrera.nombre, 20, yPos);

    yPos += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Código: ${carrera.codigo}`, 20, yPos);
    
    yPos += 6;
    doc.text(`Duración: ${carrera.duracion} semestres`, 20, yPos);
    
    yPos += 6;
    doc.text(`Créditos Totales: ${malla.creditosTotales}`, 20, yPos);

    yPos += 6;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const descripcionLines = doc.splitTextToSize(carrera.descripcion, pageWidth - 40);
    doc.text(descripcionLines, 20, yPos);

    yPos += (descripcionLines.length * 5) + 10;

    // Malla curricular por semestres
    malla.semestres.forEach((semestre, index) => {
      if (semestre.cursos.length === 0) return;

      // Verificar si necesitamos nueva página
      if (yPos > pageHeight - 60) {
        doc.addPage();
        yPos = 20;
      }

      // Título del semestre
      doc.setFillColor(6, 182, 212); // Color accent
      doc.rect(20, yPos - 5, pageWidth - 40, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Semestre ${semestre.numero}  •  ${semestre.creditosSemestre} créditos`, 25, yPos + 2);

      yPos += 12;

      // Tabla de cursos del semestre
      const tableData = semestre.cursos.map(curso => [
        curso.codigo,
        curso.nombre,
        curso.creditos.toString(),
        curso.esObligatorio ? 'Obligatorio' : 'Electivo',
        curso.prerequisitos && curso.prerequisitos.length > 0 
          ? curso.prerequisitos.join(', ') 
          : '-'
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['Código', 'Nombre del Curso', 'Créditos', 'Tipo', 'Prerrequisitos']],
        body: tableData,
        theme: 'striped',
        headStyles: { 
          fillColor: [30, 41, 59],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        styles: { 
          fontSize: 9,
          cellPadding: 4
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 70 },
          2: { cellWidth: 20, halign: 'center' },
          3: { cellWidth: 28 },
          4: { cellWidth: 35 }
        },
        alternateRowStyles: { fillColor: [248, 250, 252] }
      });

      yPos = (doc as any).lastAutoTable.finalY + 15;
    });

    // Resumen final
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos, pageWidth - 40, 30, 'F');
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen', 25, yPos + 10);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total de semestres: ${malla.semestres.filter(s => s.cursos.length > 0).length}`, 25, yPos + 18);
    doc.text(`Total de créditos: ${malla.creditosTotales}`, 25, yPos + 25);

    // Footer
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Página ${i} de ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    // Guardar PDF
    const fileName = `Plan_Estudios_${carrera.codigo}_${new Date().getTime()}.pdf`;
    doc.save(fileName);
  }

  // Generar Preforma de Matrícula en PDF
  generarPreformaMatricula(preforma: any): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Encabezado
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('PREFORMA DE MATRÍCULA', pageWidth / 2, 15, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(preforma.periodo, pageWidth / 2, 25, { align: 'center' });
    
    doc.setFontSize(9);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, pageWidth / 2, 32, { align: 'center' });

    // Información del estudiante
    let yPos = 55;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Información del Estudiante', 20, yPos);

    yPos += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Código: ${preforma.estudiante.codigo}`, 20, yPos);
    
    yPos += 6;
    doc.text(`Nombre: ${preforma.estudiante.nombre}`, 20, yPos);
    
    yPos += 6;
    doc.text(`Carrera: ${preforma.estudiante.carrera}`, 20, yPos);

    yPos += 15;

    // Tabla de cursos
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Cursos a Matricular', 20, yPos);

    yPos += 8;

    const tableData = preforma.cursos.map((curso: any) => [
      curso.codigo,
      curso.nombre,
      curso.creditos.toString(),
      `$${curso.costoPorCredito}`,
      `$${curso.costo.toFixed(2)}`
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [['Código', 'Curso', 'Créditos', 'Costo/Crédito', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: { 
        fillColor: [6, 182, 212],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: { 
        fontSize: 10,
        cellPadding: 5
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 85 },
        2: { cellWidth: 25, halign: 'center' },
        3: { cellWidth: 30, halign: 'right' },
        4: { cellWidth: 30, halign: 'right' }
      }
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;

    // Resumen de costos
    doc.setFillColor(248, 250, 252);
    doc.rect(pageWidth - 80, yPos, 60, 35, 'F');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Subtotal:', pageWidth - 75, yPos + 8);
    doc.text(`$${preforma.subtotal.toFixed(2)}`, pageWidth - 25, yPos + 8, { align: 'right' });

    doc.text('Descuentos:', pageWidth - 75, yPos + 16);
    doc.setTextColor(239, 68, 68);
    doc.text(`-$${preforma.descuentos.toFixed(2)}`, pageWidth - 25, yPos + 16, { align: 'right' });

    doc.setDrawColor(6, 182, 212);
    doc.setLineWidth(0.5);
    doc.line(pageWidth - 75, yPos + 20, pageWidth - 25, yPos + 20);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Total a Pagar:', pageWidth - 75, yPos + 28);
    doc.text(`$${preforma.total.toFixed(2)}`, pageWidth - 25, yPos + 28, { align: 'right' });

    // Nota informativa
    yPos += 50;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    const nota = 'Este documento es una preforma y no constituye un comprobante de pago. Para completar su matrícula, debe realizar el pago correspondiente.';
    const notaLines = doc.splitTextToSize(nota, pageWidth - 40);
    doc.text(notaLines, 20, yPos);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      'Documento generado electrónicamente',
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );

    // Guardar PDF
    const fileName = `Preforma_${preforma.estudiante.codigo}_${preforma.periodo}.pdf`;
    doc.save(fileName);
  }
}