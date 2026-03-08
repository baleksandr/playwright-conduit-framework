import { Page } from "@playwright/test";
import { ArticlePage } from './ArticlePage'

export class PageManager {

    private readonly page: Page;
    // private readonly articlePage: ArticlePage; //присвоювати ці екземпляри полям

    constructor(page: Page) { //ініціалізувати конструктор, який буде створювати екземпляри ваших сторінок
        this.page = page
    }

    onArticlePage(title?: string) { //створити окремі методи, які повертатимуть вам цей екземпляр
        return new ArticlePage(this.page, title);
    }
}