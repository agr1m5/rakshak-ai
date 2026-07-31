import api from "./api";

export async function listLogs() {
  const { data } = await api.get("/logs");
  return data.data.logs;
}

export async function getLog(logId) {
  const { data } = await api.get(`/logs/${logId}`);
  return data.data.log;
}

export async function reparseLog(logId) {
  const { data } = await api.post(`/logs/${logId}/parse`);
  return data.data.log;
}

export async function uploadLog(file, onProgress) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post("/logs", formData, {
    onUploadProgress: (e) => {
      if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100));
    },
  });
  return data.data.log;
}

export async function deleteLog(logId) {
  await api.delete(`/logs/${logId}`);
}
