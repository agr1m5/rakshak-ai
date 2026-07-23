import { Chat, UploadedLog, Threat, IncidentReport } from "../models/index.js";

// All severities always present in the response, even at 0 — so the
// frontend chart doesn't need to special-case "no threats yet".
const SEVERITIES = ["low", "medium", "high", "critical"];

export async function getDashboardStats(req, res) {
  const userId = req.user._id;

  const [
    totalLogs,
    totalReports,
    totalThreats,
    totalConversations,
    severityAgg,
    recentConversations,
  ] = await Promise.all([
    UploadedLog.countDocuments({ userId }),
    IncidentReport.countDocuments({ userId }),
    Threat.countDocuments({ userId }),
    Chat.countDocuments({ userId }),
    Threat.aggregate([
      { $match: { userId } },
      { $group: { _id: "$severity", count: { $sum: 1 } } },
    ]),
    Chat.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("title updatedAt"),
  ]);

  const severityCounts = Object.fromEntries(SEVERITIES.map((s) => [s, 0]));
  for (const row of severityAgg) {
    severityCounts[row._id] = row.count;
  }

  res.json({
    success: true,
    data: {
      totals: {
        logs: totalLogs,
        reports: totalReports,
        threats: totalThreats,
        conversations: totalConversations,
      },
      severityDistribution: severityCounts,
      recentConversations: recentConversations.map((c) => ({
        id: c._id,
        title: c.title,
        updatedAt: c.updatedAt,
      })),
    },
  });
}
