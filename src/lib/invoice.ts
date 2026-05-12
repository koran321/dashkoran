/**
 * 🚀 Agency OS — Professional Receipt PDF Utility
 * Optimized for Assignment Koran (অ্যাসাইনমেন্ট করান)
 * Theme: Professional White / Boutique Agency Receipt
 */

interface TaskPayload {
  _id: string;
  orderId: string;
  title: string;
  workType: string;
  deadline: string;
  totalValue: number;
  advancePaid?: number;
  bonus?: number;
}

interface ClientPayload {
  name: string;
  phone?: string;
  university?: string;
}

export const generatePDFInvoice = async (task: TaskPayload, client: ClientPayload) => {
  const jsPDF = (await import("jspdf")).default;
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF({ format: "a4", unit: "mm" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // --- Calculations ---
  const total = task.totalValue || 0;
  const bonus = task.bonus || 0;
  const advance = task.advancePaid || 0;
  const subtotal = total + bonus;
  const balance = subtotal - advance;
  const isPaid = balance <= 0;

  // --- Professional Design Tokens (RGB) ---
  const colorBg = [255, 255, 255];      // Pure White
  const colorNavy = [5, 8, 22];         // #050816 (Main Text)
  const colorIndigo = [99, 102, 241];   // #6366f1 (Accent)
  const colorSlate = [71, 85, 105];     // #475569 (Secondary Text)
  const colorEmerald = [22, 163, 74];   // #16a34a (Paid Status)
  const colorCrimson = [220, 38, 38];   // #dc2626 (Due Status)
  const colorDivider = [241, 245, 249]; // #f1f5f9

  // 1. CLEAR WHITE BACKGROUND
  doc.setFillColor(colorBg[0], colorBg[1], colorBg[2]);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // 2. MINIMALIST ACCENT BAR
  doc.setFillColor(colorIndigo[0], colorIndigo[1], colorIndigo[2]);
  doc.rect(0, 0, pageWidth, 2, 'F');

  // --- HEADER SECTION (Y: 15 - 50) ---
  const headerY = 25;

  // Branding
  doc.setTextColor(colorNavy[0], colorNavy[1], colorNavy[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Assignment Koran", 20, headerY);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(colorSlate[0], colorSlate[1], colorSlate[2]);
  doc.text("Professional Academic Solutions & Support", 20, headerY + 6);
  doc.text("Dhaka, Bangladesh", 20, headerY + 11);

  // Invoice Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(colorIndigo[0], colorIndigo[1], colorIndigo[2]);
  doc.text("RECEIPT", pageWidth - 20, headerY + 3, { align: "right" });

  doc.setFontSize(9);
  doc.setTextColor(colorSlate[0], colorSlate[1], colorSlate[2]);
  doc.text(`Invoice No: #${task.orderId || 'N/A'}`, pageWidth - 20, headerY + 10, { align: "right" });
  doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - 20, headerY + 15, { align: "right" });

  // --- CLIENT & STATUS SECTION (Y: 65 - 95) ---
  const zoneY = 65;

  // Billed To
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(colorIndigo[0], colorIndigo[1], colorIndigo[2]);
  doc.text("BILLED TO:", 20, zoneY);

  doc.setFontSize(13);
  doc.setTextColor(colorNavy[0], colorNavy[1], colorNavy[2]);
  doc.text(client?.name || "Valued Client", 20, zoneY + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(colorSlate[0], colorSlate[1], colorSlate[2]);
  let clientDetailsY = zoneY + 14;
  if (client?.university) { doc.text(client.university, 20, clientDetailsY); clientDetailsY += 5; }
  if (client?.phone) { doc.text(`Contact: ${client.phone}`, 20, clientDetailsY); }

  // Status Stamp
  const statusColor = isPaid ? colorEmerald : colorCrimson;
  doc.setDrawColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(pageWidth - 55, zoneY - 1, 35, 15, 2, 2, 'S');
  
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(isPaid ? "PAID" : "DUE", pageWidth - 37.5, zoneY + 9, { align: "center" });

  // --- FINANCIAL TABLE (Y: 105+) ---
  
  autoTable(doc, {
    startY: 105,
    margin: { left: 20, right: 20 },
    theme: 'plain',
    head: [['Description of Service', 'Work Type', 'Amount']],
    body: [
      [task.title, task.workType || 'Task', `BDT ${total.toLocaleString()}`],
      ['Bonus / Additional Work', '-', `BDT ${bonus.toLocaleString()}`]
    ],
    headStyles: {
      fillColor: [248, 250, 252] as any, 
      textColor: colorIndigo as any,
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'left',
      cellPadding: 6
    },
    bodyStyles: {
      fontSize: 10,
      textColor: colorNavy as any,
      cellPadding: 7,
      valign: 'middle'
    },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { halign: 'center' },
      2: { halign: 'right', fontStyle: 'bold' }
    },
    didParseCell: (data) => {
      data.cell.styles.borderBottomColor = colorDivider as any;
      data.cell.styles.borderBottomWidth = 0.5;
    }
  });

  // --- TOTALS SECTION ---
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  const totalsX = pageWidth - 20;

  doc.setFontSize(10);
  doc.setTextColor(colorSlate[0], colorSlate[1], colorSlate[2]);
  doc.setFont("helvetica", "normal");
  
  doc.text("Subtotal:", totalsX - 45, finalY);
  doc.setTextColor(colorNavy[0], colorNavy[1], colorNavy[2]);
  doc.text(`BDT ${subtotal.toLocaleString()}`, totalsX, finalY, { align: "right" });

  doc.setTextColor(colorSlate[0], colorSlate[1], colorSlate[2]);
  doc.text("Advance Paid:", totalsX - 45, finalY + 8);
  doc.setTextColor(colorCrimson[0], colorCrimson[1], colorCrimson[2]);
  doc.text(`- BDT ${advance.toLocaleString()}`, totalsX, finalY + 8, { align: "right" });

  // Divider
  doc.setDrawColor(colorDivider[0], colorDivider[1], colorDivider[2]);
  doc.line(totalsX - 50, finalY + 12, totalsX, finalY + 12);

  // Grand Total
  doc.setFontSize(15);
  doc.setTextColor(colorIndigo[0], colorIndigo[1], colorIndigo[2]);
  doc.setFont("helvetica", "bold");
  doc.text(isPaid ? "Balance Paid:" : "Amount Due:", totalsX - 45, finalY + 21);
  doc.text(`BDT ${Math.abs(balance).toLocaleString()}`, totalsX, finalY + 21, { align: "right" });

  // --- FOOTER & THANK YOU ---
  const footerY = 270;
  
  doc.setFontSize(11);
  doc.setTextColor(colorNavy[0], colorNavy[1], colorNavy[2]);
  doc.setFont("helvetica", "bold");
  doc.text("Thank you for choosing Assignment Koran!", pageWidth / 2, footerY, { align: "center" });

  doc.setFontSize(8);
  doc.setTextColor(colorSlate[0], colorSlate[1], colorSlate[2]);
  doc.setFont("helvetica", "normal");
  doc.text("We appreciate your trust in our academic support services.", pageWidth / 2, footerY + 6, { align: "center" });
  
  doc.setFontSize(7);
  doc.text("Professional academic solutions. All rights reserved.", pageWidth / 2, footerY + 14, { align: "center" });

  doc.save(`Receipt_${task.orderId || 'AK'}.pdf`);
};
