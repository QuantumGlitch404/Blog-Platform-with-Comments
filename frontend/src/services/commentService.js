import api from './api';

export const commentService = {
  getComments: (postId) => api.get(`/comments/${postId}`),
  createComment: (data) => api.post('/comments', data),
  replyToComment: (id, data) => api.post(`/comments/${id}/reply`, data),
  editComment: (id, data) => api.put(`/comments/${id}`, data),
  deleteComment: (id) => api.delete(`/comments/${id}`),
  likeComment: (id) => api.put(`/comments/${id}/like`),
  unlikeComment: (id) => api.put(`/comments/${id}/unlike`),
};
