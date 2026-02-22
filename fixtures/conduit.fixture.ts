import { test as base } from '@playwright/test';
import { AxiosInstance } from 'axios'; // Імпортуємо тип для Axios
import { ArticleHelper } from '../api/article.helper';
import { CreateApiClient } from '../api/client'; // ваша функція, що створює axios з токеном
export { expect } from '@playwright/test';
import axios from 'axios';

// 1. Чітко описуємо інтерфейс фіктур
type MyFixtures = {
    userToken: string;            // Тільки токен
    apiClient: AxiosInstance;     // Готовий Axios інстанс
    articleBuilder: ArticleHelper;
    testArticle: { title: string; slug: string }; // Дані статті
}

// 2. Передаємо інтерфейс у extend
export const test = base.extend<MyFixtures>({
    // --- ФІКСТУРА 1: Логін і отримання токена ---
    userToken: async ({ }, use) => {
        const login = await axios.post('https://conduit-api.bondaracademy.com/api/users/login', {
            user: {
                // process.env — це глобальний об'єкт Node.js, де лежать твої секрети
                email: process.env.USER_EMAIL,
                password: process.env.USER_PASSWORD
            }
        })
        const token = login.data.user.token // Токен тепер лежить у пам'яті вашого скрипта
        await use(token); // Віддаємо токен далі, userToken: Просто рядок (Token).
    },

    // Фікстура 2: створює налаштований axios
    apiClient: async ({ userToken }, use) => {
        const client = CreateApiClient(userToken);
        await use(client); //apiClient: Отримує рядок  повертає Axios (інструмент)
    },

    // Фікстура 3: створює сам Хелпер (це і є наш articleBuilder)
    articleBuilder: async ({ apiClient }, use) => {
        const helper = new ArticleHelper(apiClient)
        await use(helper); //articleBuilder: Отримує Axios створює ArticleHelper (вашого робота).
    },

    // Фікстура 4: створює дефолтну статтю (використовує наш articleBuilder!)
    testArticle: async ({ articleBuilder, page, userToken }, use) => {
        // 1. Готуємо UI (підкидаємо токен в браузер)
        await page.addInitScript((t) => {
            window.localStorage.setItem('jwtToken', t)
        }, userToken)

        // Створюємо СТАНДАРТНУ статтю (як ми робили раніше)
        const defaultData = {
            title: `Default Title ${Date.now()}`,
            description: "Standard description",
            body: "Standard body",
            tagList: ["default"]
        };

        const article = await articleBuilder.createNewArticle(defaultData)

        await use(article) // 3. Віддаємо дані в тест

        await articleBuilder.deleteArticle(article.slug) // 5. CLEANUP (виконається ПІСЛЯ тесту)
    }
})