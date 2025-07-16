/**
 * Design System Utilities
 * Centralized design tokens and utility classes for consistent UI
 */

// ===============================
// COLOR PALETTE
// ===============================
export const colors = {
  // Primary Colors
  primary: {
    50: "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    300: "#93C5FD",
    400: "#60A5FA",
    500: "#3B82F6", // Main primary
    600: "#2563EB",
    700: "#1D4ED8",
    800: "#1E40AF",
    900: "#1E3A8A",
  },

  // Secondary Colors
  secondary: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
  },

  // Status Colors
  success: {
    50: "#F0FDF4",
    100: "#DCFCE7",
    500: "#22C55E",
    600: "#16A34A",
  },

  warning: {
    50: "#FFFBEB",
    100: "#FEF3C7",
    500: "#F59E0B",
    600: "#D97706",
  },

  error: {
    50: "#FEF2F2",
    100: "#FEE2E2",
    500: "#EF4444",
    600: "#DC2626",
  },
};

// ===============================
// COMPONENT STYLES
// ===============================

// Background Styles
export const backgrounds = {
  main: "bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40",
  card: "bg-white",
  sidebar: "bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900",
  header: "bg-white",
  overlay: "bg-black/50 backdrop-blur-sm",
};

// Container Styles
export const containers = {
  page: "p-4 lg:p-6 max-w-7xl mx-auto",
  section: "space-y-6",
  cardGrid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  flexRow: "flex flex-col sm:flex-row gap-4",
  flexCol: "flex flex-col gap-4",
};

// Card Styles
export const cards = {
  base: "bg-white rounded-lg shadow-md border border-gray-200 p-6",
  elevated:
    "bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-200",
  interactive:
    "bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer",
  compact: "bg-white rounded-lg shadow-sm border border-gray-200 p-4",
  statistic: "bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500",
};

// Button Styles
export const buttons = {
  primary:
    "bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
  secondary:
    "bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
  danger:
    "bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
  success:
    "bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
  warning:
    "bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2",
  ghost:
    "bg-transparent hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
  link: "text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
};

// Badge Styles
export const badges = {
  success:
    "bg-green-100 text-green-800 border border-green-200 px-2.5 py-0.5 rounded-full text-xs font-medium",
  warning:
    "bg-yellow-100 text-yellow-800 border border-yellow-200 px-2.5 py-0.5 rounded-full text-xs font-medium",
  error:
    "bg-red-100 text-red-800 border border-red-200 px-2.5 py-0.5 rounded-full text-xs font-medium",
  info: "bg-blue-100 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full text-xs font-medium",
  neutral:
    "bg-gray-100 text-gray-800 border border-gray-200 px-2.5 py-0.5 rounded-full text-xs font-medium",
};

// Form Styles
export const forms = {
  input:
    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200",
  label: "block text-sm font-medium text-gray-700 mb-2",
  select:
    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white",
  textarea:
    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-vertical",
  checkbox: "h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500",
  radio: "h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500",
};

// Table Styles
export const tables = {
  container: "bg-white shadow-md rounded-lg overflow-hidden",
  table: "w-full divide-y divide-gray-200",
  header: "bg-gray-50",
  headerCell:
    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
  body: "bg-white divide-y divide-gray-200",
  row: "hover:bg-gray-50 transition-colors duration-150",
  cell: "px-6 py-4 whitespace-nowrap text-sm text-gray-900",
};

// Typography Styles
export const typography = {
  pageTitle: "text-2xl font-bold text-gray-900 mb-6",
  sectionTitle: "text-xl font-semibold text-gray-800 mb-4",
  cardTitle: "text-lg font-medium text-gray-900 mb-2",
  bodyText: "text-gray-700 text-sm",
  secondaryText: "text-gray-500 text-xs",
  mutedText: "text-gray-400 text-xs",
  link: "text-blue-500 hover:text-blue-600 transition-colors duration-200",
};

// Animation Styles
export const animations = {
  fadeIn: "animate-in fade-in duration-200",
  slideInFromTop: "animate-in slide-in-from-top-2 duration-200",
  slideInFromBottom: "animate-in slide-in-from-bottom-2 duration-200",
  scaleIn: "animate-in zoom-in-95 duration-200",
  spin: "animate-spin",
  pulse: "animate-pulse",
};

// Spacing Styles
export const spacing = {
  none: "space-y-0",
  xs: "space-y-1",
  sm: "space-y-2",
  md: "space-y-4",
  lg: "space-y-6",
  xl: "space-y-8",
  xxl: "space-y-12",
};

// Shadow Styles
export const shadows = {
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  inner: "shadow-inner",
  none: "shadow-none",
};

// Utility Functions
export const utils = {
  // Combine multiple className strings
  cn: (...classes) => classes.filter(Boolean).join(" "),

  // Get status color classes
  getStatusColor: (status) => {
    const statusMap = {
      success: "text-green-600 bg-green-50",
      warning: "text-yellow-600 bg-yellow-50",
      error: "text-red-600 bg-red-50",
      info: "text-blue-600 bg-blue-50",
      neutral: "text-gray-600 bg-gray-50",
    };
    return statusMap[status] || statusMap.neutral;
  },

  // Get priority color classes
  getPriorityColor: (priority) => {
    const priorityMap = {
      high: "text-red-600 bg-red-50 border-red-200",
      medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
      low: "text-green-600 bg-green-50 border-green-200",
    };
    return priorityMap[priority] || priorityMap.medium;
  },
};

// Export default design system object
const designSystem = {
  colors,
  backgrounds,
  containers,
  cards,
  buttons,
  badges,
  forms,
  tables,
  typography,
  animations,
  spacing,
  shadows,
  utils,
};

export default designSystem;
