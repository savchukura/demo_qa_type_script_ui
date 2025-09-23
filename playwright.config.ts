// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test';
//import * as path from 'path';

const config: PlaywrightTestConfig = {
    testDir: './tests',
    timeout: 30000,
    fullyParallel: true,
    reporter: [
        ['list'],
        ['allure-playwright']
    ],
    use: {
        headless: false,
        viewport: { width: 1920, height: 1080 },
        ignoreHTTPSErrors: true,
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: {
                browserName: 'chromium',
            },
        },
    ],
};

export default config;