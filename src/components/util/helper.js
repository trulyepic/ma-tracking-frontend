import { Modal, Tooltip } from "antd";
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

export const showConfirmModal = (title, content, onOk) => {
  Modal.confirm({
    title,
    content,
    okText: "Delete",
    okType: "danger",
    cancelText: "Cancel",
    onOk,
  });
};

// Helper to convert base64 to File
export const base64ToFile = (base64, fileName) => {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mime });
};

export const applySharpenFilter = (ctx, canvas) => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const sharpenKernel = [-1, -1, -1, -1, 9, -1, -1, -1, -1]; // Sharpen kernel
  const kernelSize = Math.sqrt(sharpenKernel.length);
  const halfKernel = Math.floor(kernelSize / 2);

  const output = new Uint8ClampedArray(data.length);

  for (let y = halfKernel; y < canvas.height - halfKernel; y++) {
    for (let x = halfKernel; x < canvas.width - halfKernel; x++) {
      let r = 0,
        g = 0,
        b = 0,
        a = 0;
      for (let ky = -halfKernel; ky <= halfKernel; ky++) {
        for (let kx = -halfKernel; kx <= halfKernel; kx++) {
          const pixelIndex = ((y + ky) * canvas.width + (x + kx)) * 4;
          const kernelValue =
            sharpenKernel[(ky + halfKernel) * kernelSize + (kx + halfKernel)];
          r += data[pixelIndex] * kernelValue;
          g += data[pixelIndex + 1] * kernelValue;
          b += data[pixelIndex + 2] * kernelValue;
          a += data[pixelIndex + 3] * kernelValue;
        }
      }
      const destIndex = (y * canvas.width + x) * 4;
      output[destIndex] = Math.min(255, Math.max(0, r));
      output[destIndex + 1] = Math.min(255, Math.max(0, g));
      output[destIndex + 2] = Math.min(255, Math.max(0, b));
      output[destIndex + 3] = Math.min(255, Math.max(0, a));
    }
  }

  imageData.data.set(output);
  ctx.putImageData(imageData, 0, 0);
};
