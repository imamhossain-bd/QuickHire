import api from './api';

const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN || 'quickhire-admin-secret-2024';

const cfg = () => ({ headers: { 'X-Admin-Token': ADMIN_TOKEN } });

export const adminGetStats = () => api.get('/admin/stats', cfg()).then(r => r.data);

export const adminGetJobs = (params = {}) => api.get('/admin/jobs', { ...cfg(), params }).then(r => r.data);
export const adminCreateJob = (payload) => api.post('/admin/jobs', payload, cfg()).then(r => r.data);
export const adminUpdateJob = (id, payload) => api.put(`/admin/jobs/${id}`, payload, cfg()).then(r => r.data);
export const adminDeleteJob = (id) => api.delete(`/admin/jobs/${id}`, cfg()).then(r => r.data);
export const adminToggleJob = (id) => api.patch(`/admin/jobs/${id}/toggle`, {}, cfg()).then(r => r.data);

export const adminGetUsers = (params = {}) => api.get('/admin/users', { ...cfg(), params }).then(r => r.data);
export const adminUpdateRole = (id, role) => api.patch(`/admin/users/${id}/role`, { role }, cfg()).then(r => r.data);
export const adminDeleteUser = (id) => api.delete(`/admin/users/${id}`, cfg()).then(r => r.data);