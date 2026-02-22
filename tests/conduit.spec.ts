import { test, expect } from '../fixtures/conduit.fixture.ts'
import {faker} from '@faker-js/faker'

test('Create article with defoult title', async ({ testArticle, page }) => {

    await page.goto(`/article/${testArticle.slug}`);
    await expect(page.locator('.tag-list')).toContainText('default');
});

test('Create, update annd delete article with custom title', async ({ articleBuilder, page }) => {
    const initialArticle = await articleBuilder.createNewArticle(
        {
            title: `${faker.word.sample()}`,
            description: "Custom Desc Aleks",
            body: "Custom Body Aleks",
            tagList: ["cool", "test", "tag5"]
        }
    );

    await page.goto(`/article/${initialArticle.slug}`);
    await expect(page.locator('.tag-list')).toContainText('tag5')

    const newTitle = `Updated ${faker.word.sample()} ${Date.now()}`;

    const updatedArticle = await articleBuilder.updateArticle(initialArticle.slug, {
        title: newTitle
    });

    await page.goto(`/article/${updatedArticle.slug}`);
    await expect(page.locator('h1')).toHaveText(newTitle)
    expect(updatedArticle.title).toEqual(newTitle);

    await articleBuilder.deleteArticle(updatedArticle.slug)
});