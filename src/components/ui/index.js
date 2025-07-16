/**
 * Reusable UI Components
 * Consistent, accessible components using the design system
 */

import React from "react";
import {
  cards,
  buttons,
  badges,
  containers,
  typography,
  utils,
} from "../../utils/designSystem";

// ===============================
// CARD COMPONENTS
// ===============================

export const Card = ({
  children,
  variant = "base",
  className = "",
  ...props
}) => {
  const baseClasses = cards[variant] || cards.base;
  return (
    <div className={utils.cn(baseClasses, className)} {...props}>
      {children}
    </div>
  );
};

export const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  className = "",
}) => {
  return (
    <Card variant="statistic" className={className}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              {icon}
            </div>
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <span
            className={`text-sm font-medium ${
              trend.positive ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend.value}
          </span>
          <span className="text-xs text-gray-500 ml-2">{trend.label}</span>
        </div>
      )}
    </Card>
  );
};

// ===============================
// BUTTON COMPONENTS
// ===============================

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  ...props
}) => {
  const baseClasses = buttons[variant] || buttons.primary;
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const finalClasses = utils.cn(
    baseClasses,
    sizeClasses[size],
    loading || disabled ? "opacity-50 cursor-not-allowed" : "",
    className
  );

  return (
    <button className={finalClasses} disabled={loading || disabled} {...props}>
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

// ===============================
// BADGE COMPONENTS
// ===============================

export const Badge = ({
  children,
  variant = "neutral",
  className = "",
  ...props
}) => {
  const baseClasses = badges[variant] || badges.neutral;
  return (
    <span className={utils.cn(baseClasses, className)} {...props}>
      {children}
    </span>
  );
};

export const StatusBadge = ({ status, lateMinutes = 0 }) => {
  const getStatusConfig = (status, lateMinutes) => {
    switch (status) {
      case "Present":
        return { variant: "success", label: "Present" };
      case "Late":
        return { variant: "warning", label: `Late (${lateMinutes}m)` };
      case "Absent":
        return { variant: "error", label: "Absent" };
      case "Off":
        return { variant: "neutral", label: "Off" };
      default:
        return { variant: "neutral", label: "Unknown" };
    }
  };

  const config = getStatusConfig(status, lateMinutes);
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

// ===============================
// LAYOUT COMPONENTS
// ===============================

export const PageContainer = ({ children, className = "" }) => {
  return <div className={utils.cn(containers.page, className)}>{children}</div>;
};

export const PageHeader = ({ title, subtitle, actions, className = "" }) => {
  return (
    <div
      className={utils.cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6",
        className
      )}
    >
      <div>
        <h1 className={typography.pageTitle}>{title}</h1>
        {subtitle && <p className={typography.secondaryText}>{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  );
};

export const Section = ({ title, children, className = "" }) => {
  return (
    <div className={utils.cn("space-y-4", className)}>
      {title && <h2 className={typography.sectionTitle}>{title}</h2>}
      {children}
    </div>
  );
};

// ===============================
// FORM COMPONENTS
// ===============================

export const Input = ({
  label,
  error,
  required = false,
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={utils.cn(
          "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200",
          error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "",
          className
        )}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export const Select = ({
  label,
  options = [],
  error,
  required = false,
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        className={utils.cn(
          "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white",
          error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

// ===============================
// TABLE COMPONENTS
// ===============================

export const Table = ({ columns, data, loading = false, className = "" }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={utils.cn(
        "bg-white shadow-md rounded-lg overflow-hidden",
        className
      )}
    >
      <table className="w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ===============================
// LOADING COMPONENTS
// ===============================

export const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div
      className={utils.cn(
        sizes[size],
        "border-2 border-blue-500 border-t-transparent rounded-full animate-spin",
        className
      )}
    ></div>
  );
};

export const LoadingSkeleton = ({ lines = 3, className = "" }) => {
  return (
    <div className={utils.cn("animate-pulse space-y-2", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="h-4 bg-gray-200 rounded"></div>
      ))}
    </div>
  );
};

// ===============================
// MODAL COMPONENTS
// ===============================

export const Modal = ({ isOpen, onClose, title, children, className = "" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={utils.cn(
          "bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto",
          className
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const UIComponents = {
  Card,
  StatCard,
  Button,
  Badge,
  StatusBadge,
  PageContainer,
  PageHeader,
  Section,
  Input,
  Select,
  Table,
  LoadingSpinner,
  LoadingSkeleton,
  Modal,
};

export default UIComponents;
