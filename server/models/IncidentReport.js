import mongoose from "mongoose";

const timelineEventSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    timestamp: { type: Date, required: true },
  },
  { _id: false }
);

const incidentReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    relatedLogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UploadedLog",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    executiveSummary: {
      type: String,
      required: true,
    },
    threats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Threat",
      },
    ],
    // Overall severity for the report — typically the max severity
    // across `threats`, computed when the report is generated.
    overallSeverity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
    },
    recommendedMitigations: {
      type: [String],
      default: [],
    },
    timeline: {
      type: [timelineEventSchema],
      default: [],
    },
    // Set once PDFKit generates the file (Step 13).
    pdfPath: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export const IncidentReport = mongoose.model(
  "IncidentReport",
  incidentReportSchema
);
