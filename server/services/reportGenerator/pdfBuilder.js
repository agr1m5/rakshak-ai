import PDFDocument from "pdfkit";
import fs from "fs";

const INK = "#111827";
const MUTED = "#6B7280";
const BORDER = "#E5E7EB";
const ACCENT = "#158C79"; // sentinel-600 — dark enough to stay readable on white/print

const SEVERITY_COLORS = {
  low: "#16A34A",
  medium: "#D97706",
  high: "#EA580C",
  critical: "#DC2626",
};

const THREAT_TYPE_LABELS = {
  brute_force: "Brute Force",
  sql_injection: "SQL Injection",
  xss: "Cross-Site Scripting (XSS)",
  directory_traversal: "Directory Traversal",
  command_injection: "Command Injection",
  anomalous_pattern: "Anomalous Pattern",
  other: "Other",
};

function sectionTitle(doc, text) {
  doc.moveDown(1.2);
  doc.fontSize(13).fillColor(ACCENT).font("Helvetica-Bold").text(text.toUpperCase(), { characterSpacing: 0.5 });
  doc.moveTo(doc.x, doc.y + 4).lineTo(doc.page.width - doc.page.margins.right, doc.y + 4).strokeColor(BORDER).stroke();
  doc.moveDown(0.6);
  doc.fillColor(INK).font("Helvetica");
}

function drawThreat(doc, threat) {
  const startY = doc.y;
  const severityColor = SEVERITY_COLORS[threat.severity] || MUTED;

  // Severity chip + type label on one line
  doc.fontSize(10).font("Helvetica-Bold").fillColor(severityColor);
  doc.text(threat.severity.toUpperCase(), doc.x, startY, { continued: true });
  doc.fillColor(INK).text(`   ${THREAT_TYPE_LABELS[threat.type] || threat.type}`, { continued: false });

  if (threat.sourceIp) {
    doc.fontSize(9).font("Helvetica").fillColor(MUTED).text(`Source IP: ${threat.sourceIp}`);
  }

  doc.moveDown(0.3);
  doc.fontSize(10).font("Helvetica").fillColor(INK).text(
    threat.explanation || "No AI explanation was available at detection time.",
    { align: "left" }
  );

  if (threat.evidence && threat.evidence.length > 0) {
    doc.moveDown(0.2);
    doc.fontSize(8).font("Courier").fillColor(MUTED);
    for (const line of threat.evidence.slice(0, 3)) {
      doc.text(`  ${line.slice(0, 110)}`, { lineBreak: true });
    }
  }

  const refs = [];
  if (threat.mitre) refs.push(`MITRE ${threat.mitre.id} — ${threat.mitre.name}`);
  if (threat.owasp) refs.push(`OWASP ${threat.owasp.id} — ${threat.owasp.name}`);
  if (refs.length > 0) {
    doc.moveDown(0.2);
    doc.fontSize(8).font("Helvetica-Oblique").fillColor(ACCENT).text(refs.join("    "));
  }

  doc.moveDown(0.9);
  doc.fillColor(INK).font("Helvetica");
}

export function buildIncidentReportPdf({ report, threats, log, outputPath }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 60, bottom: 60, left: 55, right: 55 },
      bufferPages: true, // needed to go back and stamp page numbers after content is laid out
    });

    const stream = fs.createWriteStream(outputPath);
    stream.on("finish", () => resolve(outputPath));
    stream.on("error", reject);
    doc.pipe(stream);

    // --- Header ---
    doc.fontSize(20).font("Helvetica-Bold").fillColor(ACCENT).text("RAKSHAK", { characterSpacing: 1 });
    doc.fontSize(10).font("Helvetica").fillColor(MUTED).text("AI Cybersecurity Assistant — Incident Report");
    doc.moveDown(0.8);
    doc.moveTo(doc.x, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).strokeColor(BORDER).stroke();
    doc.moveDown(0.8);

    doc.fontSize(16).font("Helvetica-Bold").fillColor(INK).text(report.title);
    doc.fontSize(9).font("Helvetica").fillColor(MUTED).text(
      `Source log: ${log.originalName}  ·  Generated: ${new Date(report.createdAt || Date.now()).toLocaleString()}`
    );

    const overallColor = SEVERITY_COLORS[report.overallSeverity] || MUTED;
    doc.moveDown(0.3);
    doc.fontSize(10).font("Helvetica-Bold").fillColor(overallColor).text(
      `Overall severity: ${report.overallSeverity.toUpperCase()}`
    );

    // --- Executive Summary ---
    sectionTitle(doc, "Executive Summary");
    doc.fontSize(10).text(report.executiveSummary, { align: "left" });

    // --- Detected Threats ---
    sectionTitle(doc, `Detected Threats (${threats.length})`);
    if (threats.length === 0) {
      doc.fontSize(10).fillColor(MUTED).text("No threats were detected in this log.");
    } else {
      for (const threat of threats) {
        if (doc.y > doc.page.height - doc.page.margins.bottom - 100) doc.addPage();
        drawThreat(doc, threat);
      }
    }

    // --- Recommended Mitigations ---
    sectionTitle(doc, "Recommended Mitigations");
    if (report.recommendedMitigations.length === 0) {
      doc.fontSize(10).fillColor(MUTED).text("No specific mitigations to report.");
    } else {
      doc.fontSize(10).fillColor(INK);
      for (const mitigation of report.recommendedMitigations) {
        doc.text(`•  ${mitigation}`, { indent: 0 });
        doc.moveDown(0.2);
      }
    }

    // --- Timeline ---
    sectionTitle(doc, "Timeline");
    if (report.timeline.length === 0) {
      doc.fontSize(10).fillColor(MUTED).text("No timeline events recorded.");
    } else {
      doc.fontSize(10).fillColor(INK);
      for (const event of report.timeline) {
        doc.font("Helvetica-Bold").text(new Date(event.timestamp).toLocaleString(), { continued: true });
        doc.font("Helvetica").text(`  —  ${event.label}`);
      }
    }

    // --- Footer: page numbers, stamped after all content is laid out ---
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      // PDFKit's auto-pagination compares the write position against
      // margins.bottom and will silently insert a new blank page if a
      // write lands inside that margin — exactly where a footer belongs.
      // Zeroing it for this one write avoids that.
      const originalBottomMargin = doc.page.margins.bottom;
      doc.page.margins.bottom = 0;
      doc.fontSize(8).fillColor(MUTED).text(
        `Rakshak Incident Report — Page ${i + 1} of ${range.count}`,
        doc.page.margins.left,
        doc.page.height - 40,
        { align: "center", width: doc.page.width - doc.page.margins.left - doc.page.margins.right }
      );
      doc.page.margins.bottom = originalBottomMargin;
    }

    doc.end();
  });
}
