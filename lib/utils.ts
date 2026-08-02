import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { COLOR_MAP } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ActionSuccessResult<T> = { success: true; data: T; id: string };
export type ActionErrorResult = { success: false; message: string; id: string };
export type ActionResult<T> = ActionSuccessResult<T> | ActionErrorResult;

export const success = <T>(data: T): ActionSuccessResult<T> => {
  return { success: true, data, id: crypto.randomUUID() };
};

export const error = (message: string): ActionErrorResult => {
  return { success: false, message, id: crypto.randomUUID() };
};

export function formatPrice(amount: string | number, currencyCode: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(Number(amount));
}

export function createUrl(pathname: string, params: URLSearchParams | string) {
  const paramsString = params?.toString();
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
}

export function getColorHex(colorName: string): string | [string, string] {
  const lowerColorName = colorName.toLowerCase();

  if (COLOR_MAP[lowerColorName]) {
    return COLOR_MAP[lowerColorName];
  }

  for (const [key, value] of Object.entries(COLOR_MAP)) {
    if (lowerColorName.includes(key) || key.includes(lowerColorName)) {
      return value;
    }
  }

  return '#666666';
}

export const getLabelPosition = (index: number): 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' => {
  const positions = ['top-left', 'bottom-right', 'top-right', 'bottom-left'] as const;
  return positions[index % positions.length];
};