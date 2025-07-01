/**
 * Reusable Duty Schedule Header Component
 *
 * This component provides a consistent header for duty schedule pages
 * including navigation, title, and action buttons.
 *
 * @author HRIS Development Team
 * @version 1.0.0
 */

import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";

/**
 * Back navigation button component
 */
const BackButton = ({ onClick, disabled = false, className = "" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`flex items-center text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <IoMdArrowBack className="mr-2" />
      Back
    </button>
  );
};

/**
 * Header action button component
 */
const ActionButton = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
  type = "button",
  ...props
}) => {
  const baseClasses =
    "px-4 py-2 rounded font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    success: "bg-green-600 text-white hover:bg-green-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    warning: "bg-yellow-600 text-white hover:bg-yellow-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * Main Duty Schedule Header Component
 */
const DutyScheduleHeader = ({
  title,
  subtitle,
  showBackButton = true,
  onBack,
  actions = [],
  loading = false,
  className = "",
  isPrintView = false,
}) => {
  // Don't render header in print view
  if (isPrintView) {
    return null;
  }

  return (
    <div
      className={`mb-6 flex flex-col items-center space-y-4 sm:space-y-0 sm:flex-row sm:justify-between print:hidden ${className}`}
    >
      {/* Left section - Back button and title */}
      <div className="flex items-center space-x-4">
        {showBackButton && <BackButton onClick={onBack} disabled={loading} />}

        <div className="text-center sm:text-left">
          {title && <h1 className="text-xl font-bold uppercase">{title}</h1>}
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      </div>

      {/* Right section - Action buttons */}
      {actions.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
          {actions.map((action, index) => (
            <ActionButton
              key={action.key || index}
              onClick={action.onClick}
              variant={action.variant || "primary"}
              disabled={action.disabled || loading}
              className={action.className}
              type={action.type || "button"}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </ActionButton>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Loading state component
 */
const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="flex flex-col justify-center items-center h-[40vh] space-y-4">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    <p className="text-gray-600">{message}</p>
  </div>
);

/**
 * Error state component
 */
const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex flex-col justify-center items-center h-[40vh] space-y-4">
    <div className="text-red-500 text-center">
      <p className="text-lg font-semibold">Error</p>
      <p className="text-sm mt-2">{message}</p>
    </div>
    {onRetry && (
      <ActionButton onClick={onRetry} variant="outline">
        Try Again
      </ActionButton>
    )}
  </div>
);

/**
 * Empty state component
 */
const EmptyState = ({ message = "No data available", icon, action }) => (
  <div className="flex flex-col justify-center items-center h-[40vh] space-y-4">
    {icon && <div className="text-gray-400 text-4xl">{icon}</div>}
    <div className="text-gray-500 text-center">
      <p className="text-lg">{message}</p>
    </div>
    {action && (
      <ActionButton
        onClick={action.onClick}
        variant={action.variant || "primary"}
      >
        {action.label}
      </ActionButton>
    )}
  </div>
);

// PropTypes for type checking and documentation
DutyScheduleHeader.propTypes = {
  /** Main title text */
  title: PropTypes.string,

  /** Subtitle text */
  subtitle: PropTypes.string,

  /** Whether to show the back button */
  showBackButton: PropTypes.bool,

  /** Custom back button handler */
  onBack: PropTypes.func,

  /** Array of action button configurations */
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      variant: PropTypes.oneOf([
        "primary",
        "secondary",
        "success",
        "danger",
        "warning",
        "outline",
      ]),
      disabled: PropTypes.bool,
      className: PropTypes.string,
      icon: PropTypes.node,
      type: PropTypes.string,
    })
  ),

  /** Whether the page is in loading state */
  loading: PropTypes.bool,

  /** Additional CSS classes */
  className: PropTypes.string,

  /** Whether this is for print view */
  isPrintView: PropTypes.bool,
};

BackButton.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

ActionButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "outline",
  ]),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.string,
};

LoadingSpinner.propTypes = {
  message: PropTypes.string,
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
};

EmptyState.propTypes = {
  message: PropTypes.string,
  icon: PropTypes.node,
  action: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    variant: PropTypes.string,
  }),
};

export default DutyScheduleHeader;
export { LoadingSpinner, ErrorMessage, EmptyState, ActionButton, BackButton };
