import { Page, Locator, expect } from '@playwright/test';

export class ArticlePage {
    readonly page: Page;
    readonly tagList: Locator;
    readonly articleCard: Locator;
    readonly homeButton: Locator;
    readonly pageTitle: Locator;
    readonly likeButton: Locator;

    constructor(page: Page, articleTitle?: string) {
        this.page = page
        this.tagList = page.locator('.tag-list');
        const baseLocator = page.locator('app-article-preview');
        this.articleCard = articleTitle
            ? baseLocator.filter({ hasText: articleTitle })
            : baseLocator.first()

        this.homeButton = page.getByText(' Home ');
        this.pageTitle = page.locator('h1');
        this.likeButton = this.articleCard.locator('button');
    }

    async verifyTag(tagName: string) {
        await expect(this.tagList).toContainText(tagName)
    }

    async goToHome() {
        await this.homeButton.click()
    }

    async veriFyPageTitle(tagName: string) {
        await expect(this.pageTitle).toHaveText(tagName)
    }

    async clickLikeButton() {
        await this.likeButton.click()
    }

    async verifyLikes(likeAmount: string) {
        await expect(this.likeButton).toContainText(likeAmount)
    }

    async makeVisualCheck(locator: Locator, fileName: string, options: { mask?: Locator[], maxDiffPixelRatio?: number } = {}) {
        // Встановлюємо дефолтні маски, якщо вони не передані
        const defaultMask = [
            this.page.locator('.date'),
            this.page.locator('.author')
        ]

        await expect(locator).toHaveScreenshot(fileName, {
            mask: options.mask || defaultMask,
            maxDiffPixelRatio: options.maxDiffPixelRatio || 0.01,
            threshold: 0.3, //(чутливість окремого пікселя)
            ...options 
        })
    }
}

// Твій клас ArticlePage — це «креслення» інструмента. Щоб цей інструмент запрацював у тесті, йому потрібен доступ до браузера (об'єкта page).
// 1. Навіщо поле readonly page: Page?
// Це місце для зберігання. Представ це як кишеню в куртці майстра.
// Сам по собі клас — це просто код. Коли тест запускається, Playwright створює реальне вікно браузера (page).
// Поле дозволяє класу «запам'ятати» це конкретне вікно, щоб усі методи всередині (наприклад, waitForNumberOfSeconds) знали, у якому саме браузері їм треба чекати.
// readonly — це запобіжник. Він гарантує, що всередині класу ніхто випадково не перезапише об'єкт браузера іншим значенням.
// 2. Навіщо Конструктор constructor(page: Page)?
// Це механізм передачі. Представ це як вхідні двері.
// Коли ти робиш new ArticlePage(page), ти передаєш «ключ» від браузера всередину класу.
// Рядок this.page = page каже: «Візьми ту сторінку, яку мені дали при створенні, і поклади її в мою внутрішню кишеню (this.page)».
// Як це працює в ланцюжку:
// Тест починається і отримує від Playwright об'єкт page.
// Фікстура створює екземпляр твого помічника: const helper = new HelperBase(page).
// Конструктор записує цю page у внутрішнє поле.
// Метод waitForNumberOfSeconds бере this.page з кишені і виконує команду