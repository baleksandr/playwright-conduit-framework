import { Page } from "@playwright/test";
import { ArticlePage } from './ArticlePage'

export class PageManager {

    private readonly page: Page;

    constructor(page: Page) {
        this.page = page
    }

    onArticlePage(title?: string) {
        return new ArticlePage(this.page, title);
    }
}