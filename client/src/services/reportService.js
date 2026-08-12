import api from "./api";

export async function listReports() {
  const { data } = await api.get("/reports");
  return data.data.reports;
}

export async function createReport(logId) {
  const { data } = await api.post("/reports", { logId });
  return data.data.report;
}

export async function getReport(reportId) {
  const { data } = await api.get(`/reports/${reportId}`);
  return data.data.report;
}

export async function deleteReport(reportId) {
  await api.delete(`/reports/${reportId}`);
}

// Downloads are a protected endpoint (needs the Bearer token), so a plain
// <a href> won't work — fetch as a blob through the authenticated axios
// instance, then trigger a save via a temporary object URL.
export async function downloadReport(reportId, filename) {
  const response = await api.get(`/reports/${reportId}/download`, { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "incident-report.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
