/**
 * 📄 Agency OS — Enterprise-Grade Invoice Utility
 * Optimized for Assignment Koran (অ্যাসাইনমেন্ট করান)
 * Theme: World-Class Professional / SaaS Design
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
  const margin = 20;

  // --- Calculations ---
  const total = task.totalValue || 0;
  const bonus = task.bonus || 0;
  const advance = task.advancePaid || 0;
  const subtotal = total + bonus;
  const balance = subtotal - advance;
  const isPaid = balance <= 0;

  // --- Design Tokens (HEX/RGB) ---
  const primaryIndigo = "#6366f1";
  const textDark = "#1f2937";
  const textLight = "#6b7280";
  const borderColor = "#e5e7eb";
  const successEmerald = "#10b981";
  const warningAmber = "#f59e0b";
  const bgLight = "#f9fafb";

  // 1. BRANDING & HEADER (Y: 15 - 45)
  const headerY = 20;

  // Logo Simulation (Professional Text-based Logo)
  doc.setFillColor(99, 102, 241); // Indigo
  doc.roundedRect(margin, headerY, 12, 12, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("AK", margin + 2.5, headerY + 8.5);

  doc.setTextColor(primaryIndigo);
  doc.setFontSize(18);
  doc.text("Assignment Koran", margin + 15, headerY + 5);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(textLight);
  doc.text("Professional Academic Solutions & Support", margin + 15, headerY + 10);
  doc.text("Dhaka, Bangladesh | contact@assignmentkoran.com", margin + 15, headerY + 14);

  // Invoice Metadata (Right Aligned)
  doc.setTextColor(textDark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("INVOICE", pageWidth - margin, headerY + 5, { align: "right" });
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(textLight);
  doc.text(`Invoice No: #${task.orderId || 'N/A'}`, pageWidth - margin, headerY + 12, { align: "right" });
  doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - margin, headerY + 17, { align: "right" });

  // 2. CLIENT INFO BLOCK (Y: 55 - 85)
  const clientY = 55;
  
  // Bordered Box
  doc.setFillColor(249, 250, 251);
  doc.setDrawColor(229, 231, 235);
  doc.roundedRect(margin, clientY, 85, 35, 2, 2, 'FD');

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(primaryIndigo);
  doc.text("BILL TO:", margin + 5, clientY + 7);

  doc.setTextColor(textDark);
  doc.setFontSize(11);
  doc.text(client?.name || "Valued Client", margin + 5, clientY + 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(textLight);
  let detailsY = clientY + 21;
  if (client?.university) {
    doc.text(client.university, margin + 5, detailsY);
    detailsY += 5;
  }
  if (client?.phone) {
    doc.text(`Phone: ${client.phone}`, margin + 5, detailsY);
  }

  // 3. PAYMENT STATUS WATERMARK (Centered, Rotated)
  doc.saveGraphicsState();
  const statusLabel = isPaid ? "PAID" : "DUE";
  const statusHex = isPaid ? successEmerald : warningAmber;
  const statusRGB = isPaid ? [16, 185, 129] : [245, 158, 11];
  
  doc.setTextColor(statusRGB[0], statusRGB[1], statusRGB[2]);
  doc.setFontSize(60);
  doc.setFont("helvetica", "bold");
  // @ts-ignore
  doc.setGState(new doc.GState({ opacity: 0.15 }));
  doc.text(statusLabel, pageWidth / 2, pageHeight / 2 + 20, { align: "center", angle: 45 });
  doc.restoreGraphicsState();

  // 4. MAIN TABLE (Using autoTable)
  autoTable(doc, {
    startY: 100,
    margin: { left: margin, right: margin },
    theme: 'grid',
    head: [['Description of Service', 'Work Type', 'Amount']],
    body: [
      [task.title, task.workType || 'Standard Task', `BDT ${total.toLocaleString()}`],
      ['Bonus / Additional Requirements', '-', `BDT ${bonus.toLocaleString()}`]
    ],
    headStyles: {
      fillColor: [99, 102, 241] as any, 
      textColor: [255, 255, 255] as any,
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'left',
      cellPadding: 6
    },
    bodyStyles: {
      fontSize: 10,
      textColor: [31, 41, 55] as any,
      cellPadding: 6,
      valign: 'middle'
    },
    columnStyles: {
      0: { cellWidth: 110 },
      1: { halign: 'center' },
      2: { halign: 'right', fontStyle: 'bold' }
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251] as any
    },
    styles: {
        lineColor: [229, 231, 235] as any,
        lineWidth: 0.1
    }
  });

  // 5. TOTALS SECTION
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  const totalsX = pageWidth - margin;

  doc.setFontSize(10);
  doc.setTextColor(textLight);
  doc.setFont("helvetica", "normal");
  
  doc.text("Subtotal:", totalsX - 45, finalY);
  doc.setTextColor(textDark);
  doc.text(`BDT ${subtotal.toLocaleString()}`, totalsX, finalY, { align: "right" });

  doc.setTextColor(textLight);
  doc.text("Advance Paid:", totalsX - 45, finalY + 8);
  doc.setTextColor("#dc2626"); // Crimson for deduction
  doc.text(`- BDT ${advance.toLocaleString()}`, totalsX, finalY + 8, { align: "right" });

  // Divider line
  doc.setDrawColor(229, 231, 235);
  doc.line(totalsX - 50, finalY + 12, totalsX, finalY + 12);

  // Grand Total
  doc.setFontSize(14);
  doc.setTextColor(primaryIndigo);
  doc.setFont("helvetica", "bold");
  doc.text(isPaid ? "Total Paid:" : "Amount Due:", totalsX - 45, finalY + 21);
  doc.text(`BDT ${Math.abs(balance).toLocaleString()}`, totalsX, finalY + 21, { align: "right" });

  // 6. FOOTER
  const footerY = pageHeight - 20;
  
  doc.setDrawColor(229, 231, 235);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

  doc.setFontSize(9);
  doc.setTextColor(textDark);
  doc.setFont("helvetica", "bold");
  doc.text("Thank you for choosing Assignment Koran!", pageWidth / 2, footerY, { align: "center" });

  doc.setFontSize(8);
  doc.setTextColor(textLight);
  doc.setFont("helvetica", "normal");
  doc.text("Questions? Email support@assignmentkoran.com or call +8801875191553", pageWidth / 2, footerY + 5, { align: "center" });
  
  doc.setFontSize(7);
  doc.text(`Page 1 of 1 — Generated by Agency OS Professional`, pageWidth - margin, footerY + 10, { align: "right" });

  doc.save(`Invoice_${task.orderId || 'AK'}.pdf`);
};

