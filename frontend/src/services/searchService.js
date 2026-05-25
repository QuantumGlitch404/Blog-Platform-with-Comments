import api from './api';

export const searchService = {
  search: (query, type = '') => api.get('/search', { params: { q: query, type } }),
};
