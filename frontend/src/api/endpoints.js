import client from './client';

/* ---------- Autenticación ---------- */
export const authAPI = {
  login: (username, password) =>
    client.post('/token/', { username, password }),
  register: (data) => client.post('/auth/register/', data),
  me: () => client.get('/auth/me/'),
  google: (credential, role) => client.post('/auth/google/', { credential, role }),
};

/* ---------- Categorías y servicios ---------- */
export const catalogAPI = {
  categories: () => client.get('/categories/'),
  services: (params = {}) => client.get('/services/', { params }),
};

/* ---------- Obreros y maestros ---------- */
export const workerAPI = {
  search: (params = {}) => client.get('/workers/', { params }),
  detail: (id) => client.get(`/workers/${id}/`),
  me: () => client.get('/workers/me/'),
  create: (data) =>
    client.post('/workers/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id, data) =>
    client.patch(`/workers/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

/* ---------- Proyectos ---------- */
export const projectAPI = {
  list: (params = {}) => client.get('/projects/', { params }),
  detail: (id) => client.get(`/projects/${id}/`),
  create: (formData) =>
    client.post('/projects/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

/* ---------- Reseñas y evaluaciones ---------- */
export const reviewAPI = {
  list: (params = {}) => client.get('/reviews/', { params }),
  create: (data) => client.post('/reviews/', data),
  supervisorList: (params = {}) =>
    client.get('/supervisor-evaluations/', { params }),
};

/* ---------- Solicitudes de contacto / cotización ---------- */
export const contactAPI = {
  list: (params = {}) => client.get('/contact-requests/', { params }),
  create: (data) => client.post('/contact-requests/', data),
  updateStatus: (id, status) =>
    client.patch(`/contact-requests/${id}/`, { status }),
};
