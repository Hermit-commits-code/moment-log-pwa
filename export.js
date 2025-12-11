// export.js (Enhanced Layout)
import { loadLogs } from './data.js';

const pdf = window.jspdf;

// Define consistent colors for mood states in the PDF
const MOOD_COLORS = {
  UP: [229, 115, 115], // Light Red
  MIXED: [255, 183, 77], // Amber/Orange
  DOWN: [100, 181, 246], // Light Blue
  DEFAULT: [189, 189, 189], // Gray
};
const PRIMARY_COLOR = [63, 81, 181]; // Dark Blue for main text

/**
 * Generates and downloads a PDF summary of all logs.
 */
export function exportLogsToPDF() {
  const logs = loadLogs().sort((a, b) => b.timestamp - a.timestamp);

  if (logs.length === 0) {
    alert('Cannot create PDF: No logs recorded yet.');
    return;
  }

  const doc = new pdf.jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  let y = 10;
  const margin = 15;
  const pageWidth = doc.internal.pageSize.width;
  const logBoxWidth = pageWidth - 2 * margin;

  // --- Title & Header ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(PRIMARY_COLOR[0], PRIMARY_COLOR[1], PRIMARY_COLOR[2]);
  doc.text('Moment Log PWA: Clinical Report', margin, y);
  y += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Report Generated: ${new Date().toLocaleString()}`, margin, y);
  doc.text(`Total Logs: ${logs.length} (Newest First)`, margin, y + 5);
  y += 15;

  // --- Log Iteration ---
  logs.forEach((log) => {
    const logDate = new Date(log.timestamp).toLocaleString();
    const moodColor = MOOD_COLORS[log.moodState] || MOOD_COLORS['DEFAULT'];
    const lineHeight = 5;
    let startY = y; // Vertical position where the current log box starts

    // 1. Calculate required height for content
    const notesLines = doc.splitTextToSize(
      `Notes: ${log.notes || 'No notes recorded.'}`,
      logBoxWidth - 4,
    );
    const contentHeight = 5 + lineHeight * 4 + notesLines.length * 4.5;
    const requiredHeight = contentHeight + 5; // Add some padding

    // Check for new page
    if (y + requiredHeight > doc.internal.pageSize.height - margin) {
      doc.addPage();
      y = margin;
      startY = y;
    }

    // 2. Draw the colored box (Mood State Indicator)
    doc.setFillColor(moodColor[0], moodColor[1], moodColor[2]);
    doc.setDrawColor(200, 200, 200); // Light gray border
    doc.rect(margin, startY, logBoxWidth, requiredHeight, 'FD'); // Fill and Draw rectangle

    y += 4; // Start text inside the box

    // 3. Mood State & Time (Bold)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(20, 20, 20); // Dark text for clarity on colored background
    doc.text(`${log.moodState} Moment - ${logDate}`, margin + 3, y);
    y += 6;

    // 4. Details
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    // Details Line 1: Duration & Tags
    const detailsLine1 = `Duration: ${log.moodDuration || 'N/A'} | Tags: ${
      log.tags.join(', ') || 'None'
    }`;
    doc.text(detailsLine1, margin + 3, y);
    y += 5;

    // Details Line 2: Context
    const detailsLine2 = `Context: Sleep: ${
      log.sleepHours || 'N/A'
    }h | Caffeine: ${log.caffeineUnits || 'N/A'}`;
    doc.text(detailsLine2, margin + 3, y);
    y += 7;

    // 5. Notes (Section header then content)
    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', margin + 3, y);
    doc.setFont('helvetica', 'normal');
    y += 2;

    // Notes Content
    const contentMargin = margin + 3;
    doc.text(notesLines, contentMargin, y + 2);
    y += notesLines.length * 4.5; // Advance y for each line

    y += 5; // Space after the log box
  });

  // --- Final Download ---
  doc.save(`Mood_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
}
