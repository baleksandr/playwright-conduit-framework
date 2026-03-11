import * as fs from 'fs';
import axios from 'axios';

async function globalTeardown() {
    const filePath = '.delete_slug';
    if (!fs.existsSync(filePath)) return;

    // Зчитуємо файл і розбиваємо на рядки, прибираючи порожні
    const lines = fs.readFileSync(filePath, 'utf-8').split('\n').filter(line => line.trim());

    console.log(`\n🧹 [Cleanup] Знайдено статей для видалення: ${lines.length}`);
    
    for (const line of lines) {
        let currentSlug = 'unknown'; // Объявляем переменную заранее
        try {
            const { slug, token } = JSON.parse(line);
            currentSlug = slug; // Присваиваем реальное значение
            console.log(`[Cleanup] Видаляю: ${slug}`);
            await axios.delete(`https://conduit-api.bondaracademy.com/api/articles/${slug}`, {
                headers: { 'Authorization': `Token ${token}` }
            });
        } catch (e: any) {
            // ТУТ МИ ПОБАЧИМО РЕАЛЬНУ ПРИЧИНУ
            const status = e.response?.status;
            if (status === 404) {
                console.log(`ℹ️ [Cleanup] Стаття ${currentSlug} вже видалена (404).`);
            } else {
                console.error(`❌ [Cleanup] Помилка ${status}: ${e.message}`);
            }
        }
    }

    fs.unlinkSync(filePath);
    console.log('✅ [Cleanup] Глобальне очищення завершено!');
}
export default globalTeardown;