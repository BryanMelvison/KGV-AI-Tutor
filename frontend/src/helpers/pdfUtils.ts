import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generatePDF = async (
  element: HTMLElement,
  filename = "report"
) => {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    scrollY: -window.scrollY,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = 5; // less top/left margin
  const usableWidth = pageWidth - margin * 2;
  const imgProps = pdf.getImageProperties(imgData);
  const pdfHeight = (imgProps.height * usableWidth) / imgProps.width;

  let heightLeft = pdfHeight;
  let position = margin;

  pdf.addImage(imgData, "PNG", margin, position, usableWidth, pdfHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = margin - heightLeft + pdfHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", margin, -position, usableWidth, pdfHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`${filename}.pdf`);
};
