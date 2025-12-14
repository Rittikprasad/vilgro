import jsPDF from 'jspdf';
import type { User } from '../features/auth/authTypes';
import type { AssessmentResult } from '../services/assessmentApi';

interface UserAssessmentPDFData {
  user: User | null;
  assessmentResult: AssessmentResult | null;
  organizationName?: string;
}

/**
 * Generate PDF report for user assessment with personal information and graph visualization
 * Similar to the admin SPO report but uses user assessment data
 */
export const generateUserAssessmentPDF = (data: UserAssessmentPDFData): void => {
  const { user, assessmentResult, organizationName } = data;
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  
  let yPosition = margin;

  // Get organization name or use user's name or default
  const companyName = organizationName || 
                     user?.name || 
                     ([user?.first_name, user?.last_name].filter(Boolean).join(' ').trim()) ||
                     'Assessment Report';
  
  // Get current date and time
  const now = new Date();
  const dateTime = now.toISOString().replace('T', ' ').substring(0, 16);

  // Header - Company Name (centered)
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  const companyNameWidth = doc.getTextWidth(companyName);
  doc.text(companyName, (pageWidth - companyNameWidth) / 2, yPosition);
  
  // Date and time (top right)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(dateTime, pageWidth - margin - doc.getTextWidth(dateTime), yPosition);
  
  yPosition += 15;

  // Personal Information Section
  const personalInfo = {
    name: user?.name || 
          [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 
          'User',
    email: user?.email || 'N/A',
    mobile: 'N/A', // User profile doesn't have phone in auth state
    diitNo: 'N/A', // User profile doesn't have CIN number
  };

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  // Personal info labels and values
  const infoItems = [
    { label: 'Name:', value: personalInfo.name },
    { label: 'Email:', value: personalInfo.email },
  ];

  infoItems.forEach((item) => {
    doc.setFont('helvetica', 'normal');
    doc.text(`${item.label} ${item.value}`, margin, yPosition);
    yPosition += 7;
  });

  yPosition += 5;

  // Draw horizontal line
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  // Graph Section - Impact, Risk, Return
  // Use graph scores from assessment result (these are the normalized 0-100 scores)
  const impactScore = assessmentResult?.graph?.scores?.sections?.IMPACT ?? 0;
  const riskScore = assessmentResult?.graph?.scores?.sections?.RISK ?? 0;
  const returnScore = assessmentResult?.graph?.scores?.sections?.RETURN ?? 0;

  // Map scores (0-100) to determine how many rows should be filled from bottom
  // Each row represents a 20-point range: 0-20, 21-40, 41-60, 61-80, 81-100
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

  // Determine cell color based on row and column
  const getCellColor = (row: number, column: 'impact' | 'risk' | 'return'): [number, number, number] => {
    const filledCount = column === 'impact' ? impactFilledRows : column === 'risk' ? riskFilledRows : returnFilledRows;
    const rowFromBottom = 4 - row;
    
    if (rowFromBottom < filledCount) {
      if (column === 'impact') return [96, 196, 96]; // Green #60C460
      if (column === 'risk') return [210, 220, 100]; // Light yellow/Chartreuse #D2DC64
      if (column === 'return') return [240, 170, 50]; // Orange/Amber #F0AA32
    }
    return [240, 240, 240]; // Light grey for inactive cells
  };

  // Graph dimensions
  const graphStartY = yPosition;
  const columnWidth = contentWidth / 3;
  const rowHeight = 20;
  const graphHeight = rowHeight * 5;
  const graphStartX = margin;

  // Column headers
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  const headers = ['Impact', 'Risk', 'Return'];
  headers.forEach((header, colIndex) => {
    const xPos = graphStartX + colIndex * columnWidth + columnWidth / 2;
    const textWidth = doc.getTextWidth(header);
    doc.text(header, xPos - textWidth / 2, graphStartY);
  });

  yPosition += 8;

  // Draw grid cells - 5 rows x 3 columns
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 3; col++) {
      const xPos = graphStartX + col * columnWidth;
      const yPos = yPosition + row * rowHeight;
      
      const columnType = col === 0 ? 'impact' : col === 1 ? 'risk' : 'return';
      const [r, g, b] = getCellColor(row, columnType);
      
      // Draw filled rectangle
      doc.setFillColor(r, g, b);
      doc.setDrawColor(200, 200, 200);
      doc.rect(xPos, yPos, columnWidth - 2, rowHeight - 2, 'FD'); // FD = Fill and Draw
    }
  }

  yPosition += graphHeight + 5;

  // Save PDF
  const fileName = `${companyName.replace(/\s+/g, '_')}_Report_${dateTime.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
};
