import { test, expect } from '../fixtures/conduit.fixture.ts'
import { faker } from '@faker-js/faker'

test('Create article with defoult title', async ({ testArticle, page }) => {

    await page.goto(`/article/${testArticle.slug}`);
    await expect(page.locator('.tag-list')).toContainText('default');
    await expect.soft(page.locator('h1')).toHaveText(testArticle.title);
});

test('Create, update annd delete article with custom title', async ({ articlePage, articleBuilder, page, userToken }) => {
    const pageObj = articlePage();
    const newTitle = `Updated ${faker.word.sample()} ${Date.now()}`;
    const articlePageWithFilters = articlePage(newTitle);
    
    const initialArticle = await articleBuilder.createNewArticle(
        {
            title: `${faker.word.sample()}`,
            description: "Custom Desc Aleks",
            body: "Custom Body Aleks",
            tagList: ["cool", "test", "tag5"]
        }, userToken
    );

    await page.goto(`/article/${initialArticle.slug}`);
    await expect(page.locator('.tag-list')).toContainText('tag5')

    const updatedArticle = await articleBuilder.updateArticle(initialArticle.slug,
        {
            title: newTitle
        });

    await page.goto(`/article/${updatedArticle.slug}`);
    await pageObj.veriFyPageTitle(newTitle)
    expect(updatedArticle.title).toEqual(newTitle);

    await articleBuilder.deleteArticle(updatedArticle.slug)

    await page.goto(`/article/${updatedArticle.slug}`);
    await expect(pageObj.articleCard).not.toHaveText(newTitle)
    await expect(articlePageWithFilters.articleCard).not.toBeVisible()
});

test('Create article with check Screenshot', async ({ articlePage, testArticle, page }) => {
    const pageObj = articlePage();

    await page.goto(`/article/${testArticle.slug}`);
    await pageObj.verifyTag('default')
    await pageObj.goToHome()
    await pageObj.veriFyPageTitle(testArticle.title)
    await pageObj.clickLikeButton()
    await pageObj.verifyLikes('1')

    await pageObj.makeVisualCheck(pageObj.likeButton, 'click-likes.png', { mask: [] })
    await pageObj.makeVisualCheck(pageObj.articleCard, 'first-article.png')
});