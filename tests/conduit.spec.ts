import { test, expect } from '../fixtures/conduit.fixture.ts'
import { faker } from '@faker-js/faker'

test('Create article with defoult title', async ({ testArticle, page }) => {

    await page.goto(`/article/${testArticle.slug}`);
    await expect(page.locator('.tag-list')).toContainText('default');
    await expect.soft(page.locator('h1')).toHaveText(testArticle.title);
});

test('Create, update annd delete article with custom title', async ({pageManager, articleBuilder, page }) => {
    const newTitle = `Updated ${faker.word.sample()} ${Date.now()}`;
    const articleFirstPage = pageManager.onArticlePage();
    const articlePageWithFilters = pageManager.onArticlePage(newTitle);
    const initialArticle = await articleBuilder.createNewArticle(
        {
            title: `${faker.word.sample()}`,
            description: "Custom Desc Aleks",
            body: "Custom Body Aleks",
            tagList: ["cool", "test", "tag5"]
        }
    );

    await page.goto(`/article/${initialArticle.slug}`);
    await expect(page.locator('.tag-list')).toContainText('tag6')

    const updatedArticle = await articleBuilder.updateArticle(initialArticle.slug, {
        title: newTitle
    });

    await page.goto(`/article/${updatedArticle.slug}`);
    await articleFirstPage.veriFyPageTitle(newTitle)
    expect(updatedArticle.title).toEqual(newTitle);

    await articleBuilder.deleteArticle(updatedArticle.slug)

    await page.goto(`/article/${updatedArticle.slug}`);
    await expect(articleFirstPage.articleCard).not.toHaveText(newTitle)
    await expect(articlePageWithFilters.articleCard).not.toBeVisible()
});

test('Create article with check Screenshot', async ({ pageManager, testArticle, page }) => {
    const articlePage = pageManager.onArticlePage();

    await page.goto(`/article/${testArticle.slug}`);
    await articlePage.verifyTag('default')
    await articlePage.goToHome()
    await articlePage.veriFyPageTitle(testArticle.title)
    await articlePage.clickLikeButton()
    await articlePage.verifyLikes('1')

    await articlePage.makeVisualCheck(articlePage.likeButton, 'click-likes.png', {mask: []})
    await articlePage.makeVisualCheck(articlePage.articleCard, 'first-article.png')
});