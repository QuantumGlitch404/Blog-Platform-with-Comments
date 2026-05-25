export const ROUTES = {
  HOME: '/',
  BLOG: '/blog',
  BLOG_DETAIL: '/blog/:slug',
  CATEGORY: '/category/:category',
  TAG: '/tag/:tag',
  SEARCH: '/search',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile/:id',
  SETTINGS: '/settings',
  BOOKMARKS: '/bookmarks',
  CREATE_POST: '/post/create',
  EDIT_POST: '/post/edit/:id',
  VERIFY_EMAIL: '/verify-email/:token',
  RESET_PASSWORD: '/reset-password/:token',
  ABOUT: '/about',
  NOT_FOUND: '*',
};

export const CATEGORIES = [
  'Technology',
  'Design',
  'Business',
  'Lifestyle',
  'Other',
];
