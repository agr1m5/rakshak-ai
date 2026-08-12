/**
 * api.js — Axios instance for all backend communication.
 *
 * Why a singleton instance (not bare axios)?
 *   • Single place to set baseURL — change one env var, everything follows.
 *   • Request interceptor can attach the latest Bearer token.
 *   • Response interceptor centralises 401 handling (redirect to /login).
 *   • Easy to mock in tests.
 */
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',            // resolved by the Vite dev proxy to http://localhost:5000/api
  timeout: 30_000,            // 30 s — generous for AI streaming calls
  headers: { 'Content-Type': 'application/json' },
});

/* ── Response interceptor ───────────────────────────────────── */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Let AuthContext handle the state; just navigate away.
      // We post a custom event so AuthContext can react without a circular import.
      window.dispatchEvent(new Event('rakshak:unauthorized'));
    }
    return Promise.reject(err);
  }
);

/* ── Typed API helpers ──────────────────────────────────────── */

// Auth
export const authApi = {
  signup:    (data)  => api.post('/auth/signup', data),
  login:     (data)  => api.post('/auth/login', data),
  logout:    ()      => api.post('/auth/logout'),
  pairAgent: ()      => api.post('/agent/pair'),
  revokeAgent: ()    => api.delete('/agent/pair'),
};

// Threats
export const threatApi = {
  list:    (params) => api.get('/threats', { params }),
  get:     (id)     => api.get(`/threats/${id}`),
  dismiss: (id)     => api.delete(`/threats/${id}`),
};

// Correlated Incidents
export const incidentApi = {
  list:       (params) => api.get('/incidents', { params }),
  get:        (id)     => api.get(`/incidents/${id}`),
  updateStatus: (id, status) => api.patch(`/incidents/${id}/status`, { status }),
};

// Chat
export const chatApi = {
  list:    ()           => api.get('/chat'),
  create:  ()           => api.post('/chat'),
  get:     (id)         => api.get(`/chat/${id}`),
  message: (id, content) => api.post(`/chat/${id}/message`, { content }),
  remove:  (id)         => api.delete(`/chat/${id}`),
};

// Reports
export const reportApi = {
  list:     ()       => api.get('/reports'),
  generate: (body)   => api.post('/reports', body),
  download: (id)     => api.get(`/reports/${id}/download`, { responseType: 'blob' }),
  remove:   (id)     => api.delete(`/reports/${id}`),
};

// Threat Intelligence
export const tiApi = {
  ip:     (ip)          => api.get(`/ti/ip/${ip}`),
  cve:    (cveId)       => api.get(`/ti/cve/${cveId}`),
  mitre:  (techniqueId) => api.get(`/ti/mitre/${techniqueId}`),
  owasp:  (category)    => api.get(`/ti/owasp/${category}`),
};

// Log Import (secondary path)
export const logApi = {
  upload:  (formData) => api.post('/logs/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  list:    ()         => api.get('/logs'),
  threats: (id)       => api.get(`/logs/${id}/threats`),
};

export default api;
