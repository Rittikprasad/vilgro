import jsPDF from 'jspdf';
import type { User } from '../features/auth/authTypes';
import type { AssessmentResult } from '../services/assessmentApi';
import logo from '../assets/logo.png';

interface UserAssessmentPDFData {
  user: User | null;
  assessmentResult: AssessmentResult | null;
  organizationName?: string;
}

/**
 * Generate PDF report for user assessment with personal information, organization details, and graph visualization
 */
export const generateUserAssessmentPDF = async (data: UserAssessmentPDFData): Promise<void> => {
  const { user, assessmentResult } = data;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  /* const pageHeight = doc.internal.pageSize.getHeight(); */ // unused
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  let yPosition = margin;

  // Header - Company Name / Title

  // Get current date and time
  const now = new Date();
  // Format as YYYY-MM-DD HH:MM
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
  const dateTime = `${dateStr} ${timeStr}`;

  // Add Logo (Top Left)
  try {
    const imgProps = doc.getImageProperties(logo);
    // Scale logo to a reasonable height (e.g. 15mm) while maintaining aspect ratio
    const logoHeight = 15;
    const logoWidth = (imgProps.width * logoHeight) / imgProps.height;

    doc.addImage(logo, 'PNG', margin, yPosition - 5, logoWidth, logoHeight);

    // Adjust Y position if logo is tall, but usually header text is aligned with it
    // We'll keep yPosition for text reference
  } catch (error) {
    console.warn('Could not load logo for PDF', error);
  }

  // Header Text
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');

  doc.text('Assessment Report', pageWidth / 2, yPosition + 5, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(dateTime, pageWidth - margin, yPosition + 5, { align: 'right' });

  // Draw line below header
  yPosition += 15;
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 15;

  // User & Organization Details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');

  const name = user?.name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') ||
    'User';
  const email = user?.email || 'N/A';
  const orgName = user?.organization?.name || data.organizationName || 'N/A';

  // Define labels and values
  const details = [
    { label: 'Name:', value: name },
    { label: 'Email:', value: email },
    { label: 'Organisation:', value: orgName },
    { label: 'Sector:', value: assessmentResult?.sector || 'N/A' }
  ];

  details.forEach(item => {
    doc.setFont('helvetica', 'bold');
    doc.text(item.label, margin, yPosition);

    // Calculate indentation based on longest label or fixed
    const valueX = margin + 35;
    doc.setFont('helvetica', 'normal');
    doc.text(item.value, valueX, yPosition);

    yPosition += 7;
  });

  const orgDesc = user?.organization?.org_desc || '';
  if (orgDesc) {
    yPosition += 10;
    doc.setFont('helvetica', 'normal');
    const splitDesc = doc.splitTextToSize(orgDesc, contentWidth);
    doc.text(splitDesc, margin, yPosition);
    yPosition += (splitDesc.length * 5);
  }

  yPosition += 10;

  // Instrument Recommendation Section
  doc.setFont('helvetica', 'bold');
  const introText = "The instrument most appropriate for your current stage and profile is:";
  doc.text(introText, margin, yPosition);

  yPosition += 10;

  const instrument = assessmentResult?.instrument || 'N/A';
  doc.setFontSize(16);
  doc.text(instrument, margin, yPosition);

  yPosition += 10;

  const instrumentDesc = assessmentResult?.instrument_description || '';
  if (instrumentDesc) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const splitDesc = doc.splitTextToSize(instrumentDesc, contentWidth);
    doc.text(splitDesc, margin, yPosition);
    yPosition += (splitDesc.length * 5) + 5;
  } else {
    yPosition += 5;
  }

  yPosition += 10;

  // Graph Section - Impact, Risk, Return
  const impactScore = assessmentResult?.graph?.scores?.sections?.IMPACT ?? 0;
  const riskScore = assessmentResult?.graph?.scores?.sections?.RISK ?? 0;
  const returnScore = assessmentResult?.graph?.scores?.sections?.RETURN ?? 0;

  const getFilledRowCount = (score: number): number => {
    if (score === 0) return 0;
    if (score <= 20) return 1;
    if (score <= 40) return 2;
    if (score <= 60) return 3;
    if (score <= 80) return 4;
    return 5;
  };

  const impactFilledRows = getFilledRowCount(impactScore);
  const riskFilledRows = getFilledRowCount(riskScore);
  const returnFilledRows = getFilledRowCount(returnScore);

  const getCellColor = (row: number, column: 'impact' | 'risk' | 'return'): [number, number, number] => {
    const filledCount = column === 'impact' ? impactFilledRows : column === 'risk' ? riskFilledRows : returnFilledRows;
    const rowFromBottom = 4 - row;

    if (rowFromBottom < filledCount) {
      // Score-dependent coloring (Red to Green)
      if (filledCount <= 1) return [239, 68, 68];   // Red #EF4444
      if (filledCount <= 2) return [249, 115, 22];  // Orange #F97316
      if (filledCount <= 3) return [234, 179, 8];   // Yellow #EAB308
      if (filledCount <= 4) return [132, 204, 22];  // Light Green #84CC16
      return [34, 197, 94];                         // Green #22C55E
    }
    return [240, 240, 240]; // Light grey
  };

  const graphStartY = yPosition;
  const columnWidth = contentWidth / 3;
  const rowHeight = 15; // Slightly shorter to fit
  const graphHeight = rowHeight * 5;
  const graphStartX = margin;

  // Headers
  doc.setFontSize(11); // reduced font size for table headers
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 80, 120); // Blueish color for headers like in image? Or just black. Image has blue headers.
  // Closest to default blue
  doc.setTextColor(0, 0, 0); // Stick to black for safety unless user demanded color match exactly. Image headers are blue: "Impact", "Risk", "Return".

  // Let's try to match blue if possible, or just bold black. The image keeps things clean.
  // I will use a dark blue/grey.
  doc.setTextColor(40, 60, 90);

  const headers = ['Impact', 'Risk', 'Return'];
  headers.forEach((header, colIndex) => {
    const xPos = graphStartX + colIndex * columnWidth + columnWidth / 2;
    const textWidth = doc.getTextWidth(header);
    doc.text(header, xPos - textWidth / 2, graphStartY);
  });

  yPosition += 5; // spacing after header

  // Draw Grid
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 3; col++) {
      const xPos = graphStartX + col * columnWidth + 5; // +5 padding
      const yPos = yPosition + row * rowHeight;
      const cellWidth = columnWidth - 10; // spacing between columns
      const cellHeight = rowHeight - 2;   // spacing between rows

      const columnType = col === 0 ? 'impact' : col === 1 ? 'risk' : 'return';
      const [r, g, b] = getCellColor(row, columnType);

      doc.setFillColor(r, g, b);
      // Remove border for cleaner look or set it to same color
      doc.setDrawColor(r, g, b);

      // Rounded rect? jsPDF has roundedRect(x, y, w, h, rx, ry, style)
      doc.roundedRect(xPos, yPos, cellWidth, cellHeight, 2, 2, 'F');
    }
  }

  yPosition += graphHeight + 15;

  // Footer: Note and Disclaimer
  doc.setTextColor(0, 0, 0); // Reset to black
  doc.setFontSize(10);

  const noteText = "The result is derived from an evaluation of impact, risk, and return potential bench-marked for the sector. Each bar represents a 20-point increment on a 100-point scale for the respective section. It employs a standardised methodology developed by Villgro, based on our experience assessing key parameters via user inputs.";
  const disclaimerText = "Disclaimer: This tool provides indicative financing suggestions based solely on user inputs. It is not exhaustive or definitive advice.";

  // Helper for simple text justification
  const drawJustifiedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number): number => {
    const words = text.split(/\s+/);
    const lines: string[][] = [];
    let currentLine: string[] = [];
    let currentWidth = 0;

    words.forEach(word => {
      const wordWidth = doc.getTextWidth(word + ' ');
      if (currentWidth + wordWidth > maxWidth && currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = [word];
        currentWidth = doc.getTextWidth(word + ' ');
      } else {
        currentLine.push(word);
        currentWidth += wordWidth;
      }
    });
    lines.push(currentLine);

    let currentY = y;
    lines.forEach((line, index) => {
      if (index === lines.length - 1 || line.length === 1) {
        // Last line or single word line - left align
        doc.text(line.join(' '), x, currentY);
      } else {
        // Justify
        const totalWordWidth = line.reduce((sum, word) => sum + doc.getTextWidth(word), 0);
        const totalSpacing = maxWidth - totalWordWidth;
        const spacingPerGap = totalSpacing / (line.length - 1);
        
        let currentX = x;
        line.forEach((word) => {
          doc.text(word, currentX, currentY);
          currentX += doc.getTextWidth(word) + spacingPerGap;
        });
      }
      currentY += lineHeight;
    });
    return currentY;
  };

  // Note
  doc.setFont('helvetica', 'bold');
  doc.text('Note:', margin, yPosition);

  doc.setFont('helvetica', 'normal');
  const noteY = drawJustifiedText(noteText, margin + doc.getTextWidth('Note: '), yPosition, contentWidth - doc.getTextWidth('Note: '), 5);
  yPosition = Math.max(yPosition + 5, noteY) + 2;

  // Disclaimer
  doc.setFont('helvetica', 'italic');
  yPosition = drawJustifiedText(disclaimerText, margin, yPosition, contentWidth, 5);

  // Save PDF
  const safeName = (user?.name || 'User').replace(/[^a-zA-Z0-9]/g, '_');
  const fileName = `${safeName}_Assessment_Report_${dateTime.replace(/[: ]/g, '_')}.pdf`;
  doc.save(fileName);
};
