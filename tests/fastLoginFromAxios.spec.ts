import { test, expect } from '@playwright/test'
import axios from 'axios'
import { error } from 'node:console';

test('Hibrid API + UI Test (Fast Login)', async ({ page }) => {
    // 1. API: Получаем токен (Login через Axios)

    try {
        // 1. API: Логин с добавлением Headers
        const loginresponse = await axios.post('https://conduit-api.bondaracademy.com/api/users/login',
            {
                user: {
                    email: process.env.USER_EMAIL, // Берем из .env
                    password: process.env.USER_PASSWORD
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });

        const token = loginresponse.data.user.token
        console.log('loginresponse', loginresponse);

        // 2. UI: Инъекция токена в браузер (JWT Authentication)
        // Мы делаем это ДО перехода на страницу
        await page.addInitScript((t) => {
            window.localStorage.setItem('jwtToken', t);
        }, token);

        await page.goto('https://conduit.bondaracademy.com');
        await expect(page.getByRole('link', { name: 'Aleks_test' })).toBeVisible()

    } catch (error) {
        console.error('Login Error');
        throw error;
    }
})

// 🚀 Варіант 1: Через Axios (Твій основний проект)
// Крок 1: Підготовка даних
// Ми беремо облікові дані (email, password) не з коду, а з безпечного файлу .env через process.env. Це база безпеки.
// Крок 2: API-запит (Login)
// Ми надсилаємо POST запит на ендпоінт /api/users/login.
// Важливо: Додаємо заголовок Content-Type: application/json та User-Agent (щоб сервер не думав, що ми бот).
// Результат: Сервер повертає JSON, з якого ми дістаємо token.
// Крок 3: Ін'єкція в браузер (Injection)
// Це "фішка" Playwright — метод page.addInitScript.
// Він виконує код усередині браузера ДО того, як завантажиться сама сторінка.
// Ми кажемо: window.localStorage.setItem('jwtToken', token).
// Крок 4: Навігація
// Ми робимо page.goto(). Фронтенд Conduit при завантаженні шукає токен у localStorage, знаходить його і одразу малює інтерфейс залогіненого юзера. Ми зекономили 5-10 секунд на заповненні форми логіну.