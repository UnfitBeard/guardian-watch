export const mask = (value?: string, visibleStart = 6, visibleEnd = 4) => {
  if (!value) return "";
  if (value.length <= visibleStart + visibleEnd) return "*".repeat(value.length);
  return `${value.slice(0, visibleStart)}...${value.slice(-visibleEnd)}`;
};

export const log = (...args: any[]) => console.log("[GW]", ...args);
export const warn = (...args: any[]) => console.warn("[GW]", ...args);
export const error = (...args: any[]) => console.error("[GW]", ...args);