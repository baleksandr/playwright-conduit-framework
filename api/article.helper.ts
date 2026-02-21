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
    async createNewArticle(articleData: { title: string, description: string, body: string, tagList: string[] }) {
        const response = await this.api.post('/articles', { article: articleData });

        // Перевіряємо статус прямо тут
        if (response.status !== 201) {
            throw new Error(`API Error: Expected 201, but got ${response.status}. Body: ${JSON.stringify(response.data)}`)
        }
        
        return response.data.article // Повертаємо ТІЛЬКИ дані статті. Тепер це зручно!
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
            throw new Error(`Delete failed for ${response.data.slug}! Status: ${response.status}`)
        }
        return response.status
    }
}