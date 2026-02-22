import { test, expect } from '../fixtures/conduit.fixture.ts'
import { ArticleHelper } from '../api/article.helper';

test('Create article with defoult title', async ({ testArticle, page }) => {

    await page.goto(`/article/${testArticle.slug}`);
    await expect(page.locator('.tag-list')).toContainText('default');
});

test('Create, update annd delete article with custom title', async ({ articleBuilder, page }) => {
    const initialArticle = await articleBuilder.createNewArticle(
        {
            title: "My Super Custom Title",
            description: "Custom Desc Aleks",
            body: "Custom Body Aleks",
            tagList: ["cool", "test", "tag5"]
        }
    );

    await page.goto(`/article/${initialArticle.slug}`);
    await expect(page.locator('.tag-list')).toContainText('tag5')

    const newTitle = `Updated Title ${Date.now()}`;

    const updatedArticle = await articleBuilder.updateArticle(initialArticle.slug, {
        title: newTitle
    });

    await page.goto(`/article/${updatedArticle.slug}`);
    await expect(page.locator('h1')).toHaveText('WRONG TITLE FOR REPORT TEST')
    expect(updatedArticle.title).toEqual(newTitle);

    await articleBuilder.deleteArticle(updatedArticle.slug)
});