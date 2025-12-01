/**
 * Application Constants
 * Centralized location for all constant values
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:5000",
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  POSTS_PER_PAGE: 20,
  COMMENTS_PER_PAGE: 50,
  COURSES_PER_PAGE: 50,
};

// Cache Configuration
export const CACHE_CONFIG = {
  USER_PROFILE_TTL: 5 * 60 * 1000, // 5 minutes
  SEARCH_RESULTS_TTL: 1 * 60 * 1000, // 1 minute
  POSTS_TTL: 2 * 60 * 1000, // 2 minutes
  COURSES_TTL: 5 * 60 * 1000, // 5 minutes
};

// Debounce Delays
export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  INPUT: 500,
  SCROLL: 100,
};

// Post Types
export const POST_TYPES = {
  DISCUSSION: "discussion",
  QUESTION: "question",
  ANNOUNCEMENT: "announcement",
  EVENT: "event",
};

export const POST_TYPE_OPTIONS = [
  { value: POST_TYPES.DISCUSSION, label: "Discussion" },
  { value: POST_TYPES.QUESTION, label: "Question" },
  { value: POST_TYPES.ANNOUNCEMENT, label: "Announcement" },
  { value: POST_TYPES.EVENT, label: "Event" },
];

// Reaction Types
export const REACTION_TYPES = {
  LIKE: "like",
  LOVE: "love",
  LAUGH: "laugh",
  SHOCKED: "shocked",
  SAD: "sad",
};

// User Roles
export const USER_ROLES = {
  STUDENT: "student",
  INSTRUCTOR: "instructor",
  ADMIN: "admin",
};

export const USER_ROLE_OPTIONS = [
  { value: USER_ROLES.STUDENT, label: "Student" },
  { value: USER_ROLES.INSTRUCTOR, label: "Instructor" },
];

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  ALLOWED_DOCUMENT_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  MAX_IMAGES_PER_POST: 5,
};

// Routes
export const ROUTES = {
  HOME: "/",
  AUTH: "/auth",
  PROFILE: "/profile",
  PROFILE_USER: "/profile/:userId",
  COURSES: "/courses",
  COURSE_DETAILS: "/courses/:id",
  CHATS: "/chats",
  POST_DETAILS: "/posts/:postId",
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  THEME: "theme",
  LANGUAGE: "language",
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  SERVER_ERROR: "Server error. Please try again later.",
  VALIDATION_ERROR: "Please check your input and try again.",
  FILE_TOO_LARGE: `File size must be less than ${
    FILE_UPLOAD.MAX_SIZE / 1024 / 1024
  }MB`,
  INVALID_FILE_TYPE: "Invalid file type. Please upload a supported file.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  POST_CREATED: "Post created successfully!",
  POST_DELETED: "Post deleted successfully!",
  COMMENT_ADDED: "Comment added!",
  PROFILE_UPDATED: "Profile updated successfully!",
  LOGIN_SUCCESS: "Logged in successfully!",
  REGISTER_SUCCESS: "Account created successfully!",
  LOGOUT_SUCCESS: "Logged out successfully!",
};

// UI Configuration
export const UI_CONFIG = {
  TOAST_DURATION: 3000,
  ANIMATION_DURATION: 300,
  SKELETON_COUNT: 3,
  AVATAR_SIZE: {
    SMALL: 32,
    MEDIUM: 40,
    LARGE: 64,
  },
};

// Date Formats
export const DATE_FORMATS = {
  FULL: "MMMM DD, YYYY HH:mm",
  SHORT: "MMM DD, YYYY",
  TIME: "HH:mm",
  RELATIVE: "relative", // Use relative time (e.g., "2 hours ago")
};

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  POST_TITLE_MIN_LENGTH: 3,
  POST_TITLE_MAX_LENGTH: 200,
  POST_BODY_MIN_LENGTH: 10,
  POST_BODY_MAX_LENGTH: 5000,
  COMMENT_MIN_LENGTH: 1,
  COMMENT_MAX_LENGTH: 1000,
};

export default {
  API_CONFIG,
  PAGINATION,
  CACHE_CONFIG,
  DEBOUNCE_DELAYS,
  POST_TYPES,
  POST_TYPE_OPTIONS,
  REACTION_TYPES,
  USER_ROLES,
  USER_ROLE_OPTIONS,
  FILE_UPLOAD,
  ROUTES,
  STORAGE_KEYS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  UI_CONFIG,
  DATE_FORMATS,
  VALIDATION,
};
