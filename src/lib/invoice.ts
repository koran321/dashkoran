export const generatePDFInvoice = async (task: any, client: any) => {
  const jsPDF = (await import("jspdf")).default;
  const autoTable = (await import("jspdf-autotable")).default;
  
  const doc = new jsPDF({ format: "a4" });
  
  const total = task.totalValue || 0;
  const advance = task.advancePaid || 0;
  const bonus = task.bonus || 0;
  const subtotal = total + bonus;
  const balance = subtotal - advance;
  const isPaid = balance <= 0;
  
  // Design Tokens
  const primaryColor = [15, 23, 42]; // Slate 900
  const secondaryColor = [71, 85, 105]; // Slate 600
  const accentColor = [59, 130, 246]; // Blue 500
  const lightGray = [241, 245, 249]; // Slate 100
  const borderGray = [226, 232, 240]; // Slate 200
  const paidColor = [22, 163, 74]; // Green 600
  const dueColor = [220, 38, 38]; // Red 600
  const statusColor = isPaid ? paidColor : dueColor;
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // --- HEADER SECTION ---
  doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.rect(0, 0, pageWidth, 8, 'F');
  
  // "INVOICE" Title
  doc.setFontSize(32); 
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]); 
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", pageWidth - 20, 30, { align: "right" });
  
  // Invoice Meta Info
  doc.setFontSize(10); 
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]); 
  doc.setFont("helvetica", "bold");
  doc.text("Invoice No:", pageWidth - 60, 42); 
  doc.setFont("helvetica", "normal"); 
  doc.text(`#${task.orderId || 'N/A'}`, pageWidth - 20, 42, { align: "right" });
  
  doc.setFont("helvetica", "bold"); 
  doc.text("Date:", pageWidth - 60, 48); 
  doc.setFont("helvetica", "normal"); 
  doc.text(new Date().toLocaleDateString('en-GB'), pageWidth - 20, 48, { align: "right" });
  
  // Company Info
  doc.setFontSize(22); 
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]); 
  doc.setFont("helvetica", "bold");
  doc.text("Assignment Koran", 20, 30);
  
  doc.setFontSize(10); 
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]); 
  doc.setFont("helvetica", "normal");
  doc.text("Professional Academic Solutions", 20, 38);
  doc.text("Dhaka, Bangladesh", 20, 44);
  
  // --- BILL TO SECTION ---
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]); 
  doc.setLineWidth(0.5);
  doc.line(20, 65, pageWidth - 20, 65);
  
  doc.setFontSize(11); 
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]); 
  doc.setFont("helvetica", "bold");
  doc.text("BILLED TO:", 20, 76);
  
  doc.setFontSize(14); 
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]); 
  doc.setFont("helvetica", "bold");
  const cName = client?.name || "Valued Client";
  doc.text(cName, 20, 84);
  
  doc.setFontSize(10); 
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]); 
  doc.setFont("helvetica", "normal");
  let billY = 90;
  if(client?.phone) { doc.text(`${client.phone}`, 20, billY); billY += 6; }
  if(client?.university) { doc.text(`${client.university}`, 20, billY); billY += 6; }
  
  // Status Stamp
  doc.setDrawColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.setLineWidth(1.5);
  doc.roundedRect(pageWidth - 60, 72, 40, 16, 2, 2); 
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.setFontSize(16); 
  doc.setFont("helvetica", "bold");
  doc.text(isPaid ? "PAID" : "DUE", pageWidth - 40, 83.5, { align: "center" });
  
  // --- TABLE SECTION ---
  autoTable(doc, {
    startY: 115,
    head: [['Description', 'Type', 'Quantity', 'Unit Price', 'Amount']],
    body: [
      [task.title, task.workType || 'Task', '1', `৳${total.toLocaleString()}`, `৳${total.toLocaleString()}`],
      ['Bonus / Extra Work', '-', '1', `৳${bonus.toLocaleString()}`, `৳${bonus.toLocaleString()}`]
    ],
    headStyles: { 
      fillColor: accentColor as any, 
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 9,
      textColor: primaryColor as any,
      cellPadding: 6
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { halign: 'center' },
      2: { halign: 'center' },
      3: { halign: 'right' },
      4: { halign: 'right' }
    },
    margin: { left: 20, right: 20 }
  });

  // --- TOTALS SECTION ---
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  const leftCol = pageWidth - 90;
  
  doc.setFontSize(10); 
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  
  doc.text("Subtotal:", leftCol, finalY);
  doc.text(`৳${subtotal.toLocaleString()}`, pageWidth - 20, finalY, { align: "right" });
  
  doc.text("Advance Paid:", leftCol, finalY + 8);
  doc.text(`- ৳${advance.toLocaleString()}`, pageWidth - 20, finalY + 8, { align: "right" });
  
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.line(leftCol, finalY + 12, pageWidth - 20, finalY + 12);
  
  doc.setFontSize(14); 
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text(isPaid ? "Balance Paid:" : "Amount Due:", leftCol, finalY + 22);
  doc.text(`৳${Math.abs(balance).toLocaleString()}`, pageWidth - 20, finalY + 22, { align: "right" });
  
  // Footer
  doc.setFontSize(9); 
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for choosing Assignment Koran for your academic needs.", pageWidth / 2, 280, { align: "center" });
  doc.text("For any queries, please contact your coordinator.", pageWidth / 2, 285, { align: "center" });

  doc.save(`Invoice_${task.orderId || task._id}.pdf`);
};
