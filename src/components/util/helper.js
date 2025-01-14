import { Tooltip } from "antd";
import React from "react";

/**
 * A reusable Tooltip wrapper for a component.
 *
 * @param {React.ReactNode} children - The component to wrap with a Tooltip.
 * @param {boolean} isDisabled - Whether the feature is disabled.
 * @param {boolean} isGuest - Whether the user is a guest.
 * @returns {React.ReactNode} The wrapped component.
 */

export const withTooltip = (children, isDisabled, isGuest) => {
  const tooltipMessage = isGuest
    ? "You must log in or register to use this feature."
    : "You can only use this feature for your own collections.";

  return <Tooltip title={isDisabled ? tooltipMessage : ""}>{children}</Tooltip>;
};
