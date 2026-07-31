import { listThreatsForUser, getThreatForUser } from "../services/threatDetectionService.js";

export async function listThreats(req, res) {
  const threats = await listThreatsForUser(req.user._id, { logId: req.query.logId });
  res.json({ success: true, data: { threats } });
}

export async function getThreat(req, res) {
  const threat = await getThreatForUser(req.user._id, req.params.id);
  res.json({ success: true, data: { threat } });
}
