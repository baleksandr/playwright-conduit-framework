import * as fs from 'fs';
// import axios from 'axios';
import { AxiosInstance } from 'axios';

export class ArticleHelper {

    // 1. Оголошуємо змінну всередині класу
    private api: AxiosInstance;

    // 2. Конструктор чекає, що ви передасте йому готовий клієнт
    constructor(apiClient: AxiosInstance) {
        this.api = apiClient // Зберігаємо переданий клієнт у внутрішню змінну
    }

    // Метод для створення статті через POST запит
    async createNewArticle(articleData: { title: string, description: string, body: string, tagList: string[] }, token: string) {
        const response = await this.api.post('/articles', { article: articleData });

        if (response.status !== 201) {
            throw new Error(`API Error: Expected 201, but got ${response.status}`);
        }

        const initialArticle = response.data.article;

        const cleanupData = JSON.stringify({ slug: initialArticle.slug, token: token });
         fs.appendFileSync('.delete_slug', cleanupData + '\n');

        return initialArticle;
    }

    async updateArticle(slug: string, updatedData: { title?: string, description?: string, body?: string, tagList?: string[] }) {
        const response = await this.api.put(`/articles/${slug}`, {
            article: updatedData
        });

        if (response.status !== 200) {
            throw new Error(`Failed to update article ${slug}. Status: ${JSON.stringify(response.status)}`)
        }

        return response.data.article
    }

    async deleteArticle(slugId: string) {
        const response = await this.api.delete(`/articles/${slugId}`,
        );

        if (response.status !== 204 && response.status !== 200) {
            throw new Error(`Delete failed for ${slugId}! Status: ${response.status}`)
        }
        return response.status
    }
}