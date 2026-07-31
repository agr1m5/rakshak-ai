import api from "./api";

export async function listThreatsForLog(logId) {
  const { data } = await api.get("/threats", { params: { logId } });
  return data.data.threats;
}

export async function detectThreats(logId) {
  const { data } = await api.post(`/logs/${logId}/detect-threats`);
  return data.data.threats;
}
