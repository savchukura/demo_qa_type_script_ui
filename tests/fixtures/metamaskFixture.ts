import { test as base, chromium, type BrowserContext } from '@playwright/test';
import path from 'path';
import fs from 'fs';

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  context: async ({}, use) => {
    // Шлях до вашого .crx файлу
    const pathToExtension = path.join(process.cwd(), 'extensions', 'metamask-extension');
    const userDataDir = path.join(process.cwd(), 'user_data');

    // Перевірка, чи існує файл розширення
    if (!fs.existsSync(pathToExtension)) {
      throw new Error(`Екстеншин не знайдено за шляхом: ${pathToExtension}`);
    }

    const context = await chromium.launchPersistentContext(userDataDir, {
      headless: false,
      args: [
        // Вказуємо завантаження саме з вашої папки extensions
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });

    await use(context);
    await context.close();
  },

  extensionId: async ({ context }, use) => {
    // Для Metamask ID в Chrome завжди статичний
    const extensionId = "nkbihfbeogaeaoehlefnkodbefgpgknn";
    await use(extensionId);
  },
});

export const expect = test.expect;