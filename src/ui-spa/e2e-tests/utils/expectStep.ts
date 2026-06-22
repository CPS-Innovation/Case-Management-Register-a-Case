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

export const expectNotStep = async (
  page: Page,
  pathname: string,
): Promise<void> => {
  await expect(page, `expected flow to skip ${pathname}`).not.toHaveURL(
    new RegExp(String.raw`^https?://[^/]+${escapeRegExp(pathname)}/?(\?.*)?$`),
  );
};
