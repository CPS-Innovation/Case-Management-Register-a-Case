import { expect, type Page } from "@playwright/test";

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const expectStep = async (
  page: Page,
  pathname: string,
): Promise<void> => {
  await expect(page).toHaveURL(
    new RegExp(String.raw`^https?://[^/]+${escapeRegExp(pathname)}/?(\?.*)?$`),
  );
};
