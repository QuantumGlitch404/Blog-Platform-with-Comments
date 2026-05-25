import api from './api';

export const userService = {
  getUserProfile: (id) => api.get(`/users/${id}`),
  followUser: (id) => api.post(`/users/${id}/follow`),
  unfollowUser: (id) => api.delete(`/users/${id}/unfollow`),
  bookmarkPost: (postId) => api.post(`/users/bookmark/${postId}`),
  unbookmarkPost: (postId) => api.delete(`/users/bookmark/${postId}`),
  getBookmarks: () => api.get('/users/bookmarks'),
  getUserStats: (id) => api.get(`/users/${id}/stats`),
};
