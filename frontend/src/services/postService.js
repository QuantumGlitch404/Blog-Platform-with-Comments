import api from './api';

export const postService = {
  getPosts: (params) => api.get('/posts', { params }),
  getPost: (id) => api.get(`/posts/${id}`),
  getPostBySlug: (slug) => api.get(`/posts/slug/${slug}`),
  createPost: (data) => api.post('/posts', data),
  updatePost: (id, data) => api.put(`/posts/${id}`, data),
  deletePost: (id) => api.delete(`/posts/${id}`),
  likePost: (id) => api.put(`/posts/${id}/like`),
  unlikePost: (id) => api.put(`/posts/${id}/unlike`),
  incrementView: (id) => api.put(`/posts/${id}/view`),
  getRelatedPosts: (id) => api.get(`/posts/${id}/related`),
};
