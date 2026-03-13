import { Page } from "@playwright/test";
import { ArticlePage } from './ArticlePage'

export class PageManager {

    private readonly page: Page;

    constructor(page: Page) {
        this.page = page
    }

// Фабричний метод, який створює компонент "на льоту" /  Component-Based Page Objects
    onArticlePage(title?: string) {
        return new ArticlePage(this.page, title);
    }
}