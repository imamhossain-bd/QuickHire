import api from './api';

export const getJobs = (params = {}) => api.get('/jobs', { params }).then(r => r.data);
export const getJob = (id) => api.get(`/jobs/${id}`).then(r => r.data);
export const getCategories = () => api.get('/jobs/categories').then(r => r.data);
export const getLocations = () => api.get('/jobs/locations').then(r => r.data);

export const submitApplication = (formData) =>
    api.post('/applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);

export const getMyApplications = () =>
    api.get('/user/applications').then(r => r.data);