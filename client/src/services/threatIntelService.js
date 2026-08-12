import api from "./api";

export async function checkIpReputation(ip) {
  const { data } = await api.get(`/threat-intel/virustotal/ip/${encodeURIComponent(ip)}`);
  return data.data.result;
}

export async function lookupCve(cveId) {
  const { data } = await api.get(`/threat-intel/cve/${encodeURIComponent(cveId)}`);
  return data.data.result;
}
