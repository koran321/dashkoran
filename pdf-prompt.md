# 📄 Agency OS — Professional PDF Generation Master Prompt
## Zero-Bug, Enterprise-Grade Invoice & Application Receipt System

---

You are enhancing the **PDF generation system** for **Agency OS** — a Next.js 14 agency dashboard deployed on Vercel. The project already has two PDF workflows:

1. **Professional Invoices** (for completed tasks) — located in `src/lib/invoice.ts`
2. **Application Receipts** (for applicants) — located in `src/app/apply/page.tsx`

Your mission: **Redesign both PDFs to be world-class, professionally branded, pixel-perfect, and 100% bug-free.** These PDFs represent the agency's brand to clients and applicants — they must look like they came from a Fortune 500 company.

---

## 🏗️ Technical Constraints (Critical)

### Platform: Vercel Serverless
- **No server-side file system access** — all PDFs must be generated **client-side** in the browser or returned as base64/buffer from API routes
- **No heavy dependencies** that bloat the bundle (avoid `puppeteer`, `playwright`)
- **Use existing libraries** or switch to lighter alternatives

### Current Stack
The project currently uses one of these (verify and optimize):
- `jspdf` + `jspdf-autotable` (likely choice — client-side, 200KB)
- `react-pdf/renderer` (React-based, server/client compatible)
- `pdfmake` (declarative JSON-based, 500KB)

**Your task:** Audit what's currently installed, then either optimize it or migrate to the best option below.

---

## 🎯 Recommended Stack (Choose One)

### Option A: **jsPDF + autoTable** (Recommended for Agency OS)
- **Why**: Lightweight (~200KB), runs client-side, excellent table support, custom fonts possible
- **Best for**: Invoices with line items, receipts with structured data
- **Install**:
  ```bash
  npm install jspdf jspdf-autotable
  ```

### Option B: **react-pdf/renderer** (If you want React-style JSX)
- **Why**: Write PDFs like React components, beautiful API, server/client compatible
- **Best for**: Complex layouts, multi-page documents
- **Install**:
  ```bash
  npm install @react-pdf/renderer
  ```

### Option C: **pdfmake** (If current implementation uses it)
- **Why**: Declarative JSON schema, supports custom fonts, watermarks, backgrounds
- **Best for**: Template-based documents with minimal code changes
- **Install**:
  ```bash
  npm install pdfmake
  ```

**Decision criteria:**
- If invoices are **table-heavy** → jsPDF + autoTable
- If you want **React-style code** → @react-pdf/renderer
- If current code is **already working** with pdfmake → optimize it

---

## 🎨 Design System for PDFs

### Brand Identity: Assignment Koran
- **Logo**: Include a high-quality vector or PNG logo at top-left (minimum 150px width, 300 DPI equivalent)
- **Colors**:
  - Primary: `#6366f1` (Electric Indigo) — for headers, accents, status badges
  - Secondary: `#22d3ee` (Cyan) — for secondary highlights
  - Success: `#10b981` (Emerald) — for "PAID" status
  - Warning: `#f59e0b` (Amber) — for "DUE" status
  - Text: `#1f2937` (Dark Gray) on white background
  - Borders: `#e5e7eb` (Light Gray) for table lines

### Typography
- **Headings**: Inter Bold or Satoshi Bold (if custom fonts are loaded)
- **Body**: Inter Regular or system fallback (Helvetica, Arial)
- **Monospace** (for tracking IDs, amounts): SF Mono, Courier New

### Layout Principles
- **A4 size** (210mm × 297mm) for international compatibility
- **Margins**: 20mm all sides
- **Header**: Logo + Company info (left) | Invoice/Receipt metadata (right)
- **Body**: Clean table with alternating row colors (`#f9fafb` for even rows)
- **Footer**: Centered legal text + contact info + page numbers (if multi-page)

---

## 📋 Invoice PDF Specification

### File: `src/lib/invoice.ts`

#### Context
Generated when a task is marked as "Completed" in the Dashboard. Downloaded by the admin to send to clients.

#### Required Sections

1. **Header**
   ```
   [LOGO]  Assignment Koran               Invoice #INV-2024-00123
           123 Example St, Dhaka           Date: 15 May 2024
           contact@assignmentkoran.com     Due Date: 22 May 2024
   ```

2. **Client Info Block** (bordered box with light background)
   ```
   BILL TO:
   John Doe
   University of Dhaka
   BSc in Computer Science
   john@example.com | +880 1712-345678
   ```

3. **Invoice Details Table**
   | Description | Quantity | Rate (BDT) | Amount (BDT) |
   |-------------|----------|------------|--------------|
   | Research Paper - Quantum Computing | 1 | 5,000 | 5,000 |
   | Formatting & Citations | 1 | 500 | 500 |
   | **Subtotal** | | | **5,500** |
   | **Discount** | | | **-500** |
   | **Total** | | | **5,000** |

4. **Payment Status Badge** (Top-right, large, semi-transparent)
   - If fully paid: Green "PAID" stamp (45° rotation, 60pt font, 30% opacity)
   - If pending: Red "DUE" stamp

5. **Footer**
   ```
   Thank you for your business!
   For queries: support@assignmentkoran.com | +880 1234-567890
   Page 1 of 1
   ```

#### Code Structure (jsPDF Example)
```typescript
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function generateInvoice(data: InvoiceData): void {
  const doc = new jsPDF()
  
  // Add logo (use addImage with base64 or URL)
  doc.addImage(logoBase64, 'PNG', 20, 15, 40, 15)
  
  // Header text
  doc.setFontSize(10)
  doc.text('Assignment Koran', 20, 35)
  doc.text('123 Example St, Dhaka', 20, 40)
  
  // Invoice metadata (right-aligned)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(`Invoice #${data.invoiceNumber}`, 200, 20, { align: 'right' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`Date: ${data.date}`, 200, 28, { align: 'right' })
  doc.text(`Due Date: ${data.dueDate}`, 200, 34, { align: 'right' })
  
  // Bill To section (bordered box)
  doc.setFillColor(249, 250, 251) // #f9fafb
  doc.rect(20, 50, 80, 35, 'F')
  doc.setDrawColor(229, 231, 235)
  doc.rect(20, 50, 80, 35, 'S')
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('BILL TO:', 22, 56)
  doc.setFont('helvetica', 'normal')
  doc.text(data.clientName, 22, 62)
  doc.text(data.clientUniversity, 22, 68)
  doc.text(data.clientProgram, 22, 74)
  doc.text(data.clientEmail, 22, 80)
  
  // Table (using autoTable)
  autoTable(doc, {
    startY: 95,
    head: [['Description', 'Qty', 'Rate (BDT)', 'Amount (BDT)']],
    body: [
      [data.taskDescription, '1', data.rate.toLocaleString(), data.amount.toLocaleString()],
      ['Formatting & Citations', '1', '500', '500'],
    ],
    foot: [
      ['', '', 'Subtotal', data.subtotal.toLocaleString()],
      ['', '', 'Discount', `-${data.discount.toLocaleString()}`],
      ['', '', 'Total', data.total.toLocaleString()],
    ],
    theme: 'grid',
    headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: 'bold' },
    footStyles: { fillColor: [249, 250, 251], textColor: 0, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    styles: { fontSize: 10, cellPadding: 3 },
  })
  
  // Payment status watermark
  if (data.isPaid) {
    doc.saveGraphicsState()
    doc.setTextColor(16, 185, 129) // #10b981
    doc.setFontSize(60)
    doc.setFont('helvetica', 'bold')
    doc.setGState(new doc.GState({ opacity: 0.3 }))
    doc.text('PAID', 105, 150, { align: 'center', angle: 45 })
    doc.restoreGraphicsState()
  } else {
    doc.saveGraphicsState()
    doc.setTextColor(239, 68, 68) // #ef4444
    doc.setFontSize(60)
    doc.setFont('helvetica', 'bold')
    doc.setGState(new doc.GState({ opacity: 0.3 }))
    doc.text('DUE', 105, 150, { align: 'center', angle: 45 })
    doc.restoreGraphicsState()
  }
  
  // Footer
  const pageHeight = doc.internal.pageSize.height
  doc.setFontSize(8)
  doc.setTextColor(107, 114, 128)
  doc.text('Thank you for your business!', 105, pageHeight - 20, { align: 'center' })
  doc.text('For queries: support@assignmentkoran.com | +880 1234-567890', 105, pageHeight - 15, { align: 'center' })
  doc.text('Page 1 of 1', 200, pageHeight - 10, { align: 'right' })
  
  // Download
  doc.save(`Invoice-${data.invoiceNumber}.pdf`)
}
```

---

## 📋 Application Receipt Specification

### File: `src/app/apply/page.tsx`

#### Context
Generated immediately after a user submits an application via the public portal. Provides a tracking number and confirmation.

#### Required Sections

1. **Header**
   ```
   [LOGO]  Assignment Koran               Application Receipt
           Academic Services Agency        
   ```

2. **Tracking Info** (large, centered, bordered box with colored background)
   ```
   ┌─────────────────────────────────────────────┐
   │  Your Tracking ID: TRK-2024-5A3B-9C7E       │
   │  Submitted: 15 May 2024, 10:30 AM           │
   └─────────────────────────────────────────────┘
   ```

3. **Application Details**
   ```
   APPLICANT INFORMATION:
   Name:         John Doe
   Email:        john@example.com
   Phone:        +880 1712-345678
   University:   University of Dhaka
   Program:      BSc in Computer Science
   
   PROJECT DETAILS:
   Type:         Research Paper
   Subject:      Quantum Computing
   Deadline:     22 May 2024
   Budget:       5,000 BDT
   ```

4. **Next Steps** (bulleted list with icons)
   ```
   ✓ We've received your application
   ✓ You'll receive an email confirmation shortly
   ✓ Our team will review and contact you within 24 hours
   ✓ Keep this receipt for your records
   ```

5. **Footer**
   ```
   Questions? Contact us at support@assignmentkoran.com
   Visit: www.assignmentkoran.com
   ```

#### Code Structure (react-pdf Example)
```tsx
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  logo: { width: 120, height: 45 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#6366f1' },
  trackingBox: {
    backgroundColor: '#eef2ff',
    border: '2px solid #6366f1',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    textAlign: 'center',
  },
  trackingId: { fontSize: 20, fontWeight: 'bold', color: '#1f2937', marginBottom: 5 },
  section: { marginBottom: 15 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#6366f1', marginBottom: 8 },
  row: { flexDirection: 'row', marginBottom: 5, fontSize: 10 },
  label: { width: 120, fontWeight: 'bold', color: '#4b5563' },
  value: { flex: 1, color: '#1f2937' },
  footer: { marginTop: 30, paddingTop: 15, borderTop: '1px solid #e5e7eb', fontSize: 8, color: '#6b7280', textAlign: 'center' },
})

export const ApplicationReceipt = ({ data }: { data: ApplicationData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Image src="/logo.png" style={styles.logo} />
          <Text style={{ fontSize: 10, color: '#6b7280', marginTop: 5 }}>Academic Services Agency</Text>
        </View>
        <Text style={styles.title}>Application Receipt</Text>
      </View>
      
      <View style={styles.trackingBox}>
        <Text style={styles.trackingId}>Tracking ID: {data.trackingId}</Text>
        <Text style={{ fontSize: 10, color: '#6b7280' }}>Submitted: {data.submittedAt}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>APPLICANT INFORMATION</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{data.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{data.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{data.phone}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>University:</Text>
          <Text style={styles.value}>{data.university}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Program:</Text>
          <Text style={styles.value}>{data.program}</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PROJECT DETAILS</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Type:</Text>
          <Text style={styles.value}>{data.projectType}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Subject:</Text>
          <Text style={styles.value}>{data.subject}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Deadline:</Text>
          <Text style={styles.value}>{data.deadline}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Budget:</Text>
          <Text style={styles.value}>{data.budget} BDT</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>NEXT STEPS</Text>
        <Text style={{ fontSize: 9, color: '#1f2937', lineHeight: 1.6 }}>
          ✓ We've received your application{'\n'}
          ✓ You'll receive an email confirmation shortly{'\n'}
          ✓ Our team will review and contact you within 24 hours{'\n'}
          ✓ Keep this receipt for your records
        </Text>
      </View>
      
      <View style={styles.footer}>
        <Text>Questions? Contact us at support@assignmentkoran.com</Text>
        <Text style={{ marginTop: 3 }}>Visit: www.assignmentkoran.com</Text>
      </View>
    </Page>
  </Document>
)
```

---

## 🛡️ Zero-Bug Checklist

### 1. Data Validation
- ✅ Validate all inputs before PDF generation (non-null checks, type guards)
- ✅ Handle missing data gracefully (e.g., "N/A" for optional fields)
- ✅ Sanitize text to avoid breaking PDF rendering (escape special chars)

### 2. Typography Issues
- ✅ **Never use Unicode subscripts/superscripts** (₀₁₂, ⁰¹²) — they render as black boxes
- ✅ Use proper font fallbacks: `['Helvetica', 'Arial', 'sans-serif']`
- ✅ Load custom fonts correctly (base64 or CDN URLs)

### 3. Layout Precision
- ✅ Test with long text (client names >50 chars, descriptions >200 chars) — ensure no overflow
- ✅ Test with multi-page scenarios (invoices with 10+ line items)
- ✅ Ensure tables don't break across pages awkwardly (use `pageBreak: 'avoid'` in autoTable)

### 4. Image Handling
- ✅ Logo must be base64-encoded or accessible via HTTPS (no relative paths in Vercel)
- ✅ Test logo with transparent PNGs and non-transparent JPGs
- ✅ Handle logo loading failure (fallback to text-only header)

### 5. Localization
- ✅ Support both English and Bengali text (test with Bengali Unicode characters)
- ✅ Ensure font supports Bengali glyphs (use Noto Sans Bengali if needed)
- ✅ Date formatting: `15 May 2024` or `১৫ মে ২০২৪` based on locale

### 6. Performance
- ✅ Generate PDFs client-side to avoid serverless timeout (max 10 seconds on Vercel)
- ✅ Optimize bundle size (jsPDF + autoTable = ~220KB minified, acceptable)
- ✅ Show a loading indicator during generation (can take 1–3 seconds for complex PDFs)

### 7. Browser Compatibility
- ✅ Test in Chrome, Safari, Firefox, Edge
- ✅ Test on mobile (iOS Safari, Android Chrome)
- ✅ Ensure download works (use `doc.save()` for client-side, blob URLs for server-rendered)

### 8. Error Handling
```typescript
try {
  generateInvoice(data)
} catch (error) {
  console.error('PDF generation failed:', error)
  toast.error('Failed to generate invoice. Please try again.')
  // Log to Sentry or your error tracker
}
```

---

## 🎨 Advanced Features (Optional Enhancements)

### 1. QR Code for Tracking
```typescript
import QRCode from 'qrcode'

const qrDataUrl = await QRCode.toDataURL(`https://assignmentkoran.com/track/${trackingId}`)
doc.addImage(qrDataUrl, 'PNG', 160, 50, 30, 30)
```

### 2. Barcode for Invoice Numbers
```typescript
import JsBarcode from 'jsbarcode'

const canvas = document.createElement('canvas')
JsBarcode(canvas, invoiceNumber, { format: 'CODE128' })
const barcodeDataUrl = canvas.toDataURL('image/png')
doc.addImage(barcodeDataUrl, 'PNG', 20, 250, 100, 20)
```

### 3. Digital Signature Field
```typescript
// Add a signature placeholder box
doc.setDrawColor(200)
doc.setLineDash([2, 2])
doc.rect(120, 240, 60, 20)
doc.setFontSize(8)
doc.text('Authorized Signature', 150, 265, { align: 'center' })
```

### 4. Multi-Currency Support
```typescript
const formatCurrency = (amount: number, currency: 'BDT' | 'USD') => {
  if (currency === 'BDT') return `${amount.toLocaleString()} BDT`
  return `$${(amount / 110).toFixed(2)}` // Example conversion
}
```

---

## 📦 Implementation Checklist

1. ✅ **Audit current PDF library** — check `package.json` for jspdf/pdfmake/react-pdf
2. ✅ **Migrate to recommended stack** if needed (jsPDF + autoTable preferred)
3. ✅ **Update `src/lib/invoice.ts`** with new Invoice design
4. ✅ **Update `src/app/apply/page.tsx`** with new Application Receipt design
5. ✅ **Add logo as base64** or host on CDN (e.g., Cloudinary, Vercel Blob Storage)
6. ✅ **Test edge cases** (long names, multi-page invoices, Bengali text, mobile browsers)
7. ✅ **Add loading state** (spinner or toast notification during generation)
8. ✅ **Error handling** (try/catch + user-friendly error messages)
9. ✅ **Accessibility** (ensure downloaded PDFs are screen-reader friendly with proper tags)
10. ✅ **Version PDFs** (add "Generated by Agency OS v2.1" in footer for debugging)

---

## 🚀 Deliverable

Two production-ready PDF systems:

1. **Professional Invoice PDF** — Enterprise-grade, branded, with PAID/DUE watermark
2. **Application Receipt PDF** — Clean, tracking-focused, user-friendly

Both must:
- ✅ Work perfectly in Vercel serverless environment
- ✅ Support bilingual text (EN/BN)
- ✅ Handle edge cases (long text, missing data, multi-page)
- ✅ Look identical to high-end SaaS invoices (Stripe, Notion, Linear quality)
- ✅ Have zero rendering bugs across all browsers

---

**Generate the code. Test obsessively. Ship world-class PDFs.**
