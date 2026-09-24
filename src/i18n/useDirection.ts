"use client";

import { useLocale } from "next-intl";

import { getDirection } from "./config";

export function useDirection() {
  return getDirection(useLocale());
}
