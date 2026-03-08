import { test, expect } from "@playwright/test"

test('Hybrid Login via Playwright API Request', async ({ page, playwright }) => {
    // 1. Создаем контекст для запроса (API Request Context)
    const apiContext = await playwright.request.newContext();

    // 2. API: Логин (встроенный метод post)
    const loginResponse = await apiContext.post('https://conduit-api.bondaracademy.com/api/users/login',
        {
        data: 
        {
            "user": { "email": "Aleks@ukr.net", "password": "Aleks123" }
        }
        });

    const responseBody = await loginResponse.json();
    const accessToken = responseBody.user.token;

    await page.addInitScript((t) => {
        window.localStorage.setItem('jwtToken', t)
    }, accessToken);

    await page.goto('https://conduit.bondaracademy.com');
    await expect(page.getByRole('link', { name: 'Aleks_test' })).toBeVisible()
});

// 🛠 Варіант 2: Без Axios (Вбудований Playwright Request)
// Якщо на співбесіді кажуть "а зроби це без бібліотек", кроки майже ті самі, але інструмент інший:
// Крок 1: Використовуємо playwright.request.newContext(). Це вбудований API-клієнт Playwright.
// Крок 2: Робимо await apiContext.post(...).
// Різниця: Playwright автоматично додає багато заголовків, тому 403 там вилітає рідше.
// Крок 3: Так само через addInitScript кладемо токен у localStorage.
