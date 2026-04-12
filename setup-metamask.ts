import { chromium } from '@playwright/test';
import path from 'path';

async function setup() {
  // Тепер вказуємо шлях до папки, а не до .crx
  const pathToExtension = path.join(process.cwd(), 'extensions', 'metamask-extension');
  const userDataDir = path.join(process.cwd(), 'user_data');

  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
    ],
  });

  console.log('Браузер відкрито. Налаштуйте гаманець і мережу, потім закрийте браузер.');
}

setup().catch(console.error);