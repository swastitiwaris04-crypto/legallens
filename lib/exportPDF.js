import jsPDF from 'jspdf';

export function exportAnalysisToPDF(data) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('LegalLens - Document Analysis', pageWidth / 2, y, { align: 'center' });
  y += 14;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`Document Type: ${data.document_type}`, 14, y);
  y += 8;
  doc.text(`Risk Score: ${data.risk_score} (${data.risk_score_number}/100)`, 14, y);
  y += 8;
  doc.text(`Risk Reason: ${data.risk_reason}`, 14, y);
  y += 14;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Plain Language Summary', 14, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  const summaryLines = doc.splitTextToSize(data.simple_summary || '', pageWidth - 28);
  doc.text(summaryLines, 14, y);
  y += summaryLines.length * 6 + 10;

  if (data.clauses && data.clauses.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Clause Breakdown', 14, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    for (const clause of data.clauses) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.text(`${clause.title}${clause.is_red_flag ? ' [RED FLAG]' : ''}`, 14, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      const explainLines = doc.splitTextToSize(clause.simple_explanation || '', pageWidth - 28);
      doc.text(explainLines, 14, y);
      y += explainLines.length * 5 + 6;
    }
  }

  if (data.obligations && data.obligations.length > 0) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Obligations & Deadlines', 14, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    for (const ob of data.obligations) {
      const obText = `${ob.description} (Deadline: ${ob.deadline}, Party: ${ob.responsible_party})`;
      const obLines = doc.splitTextToSize(obText, pageWidth - 28);
      doc.text(obLines, 14, y);
      y += obLines.length * 5 + 4;
    }
  }

  doc.save(`LegalLens-${data.document_type || 'Analysis'}.pdf`);
}
