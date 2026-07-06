const { test, expect } = require('../../fixtures/fixtures');
const { KNOWN_BOOK } = require('../../data/books');
const { SEED_USER } = require('../../data/credentials');


test.describe('Book collection — full user journey', () => {
  test('register, log in, add a book to my collection, view it, delete it, and log out', async ({
    apiUser,
    loginForm,
    profile,
    bookStore,
    bookDetail,
    page,
  }) => {
    // 1 & 2. Registration already happened via the apiUser fixture
    // (bypassing the reCAPTCHA-guarded /register page); log in with those
    // credentials through the real UI form.
    await test.step('log in with the API-registered user', async () => {
      await loginForm.login(apiUser.userName, apiUser.password);
      //await loginForm.login(SEED_USER.userName, SEED_USER.password);
      console.log(await page.evaluate(() => ({
        token: localStorage.getItem('token'),
        userId: localStorage.getItem('userId'),
        userName: localStorage.getItem('userName'),
      })));
      await expect(page).toHaveURL(/profile/);
      await expect(profile.userNameValue).toContainText(apiUser.userName);
    });

    // 3. Search for a known, fixed catalogue title and add it.
    await test.step('search for a book and add it to my collection', async () => {
      await page.goto('/books');
      await bookStore.searchBooks(KNOWN_BOOK.title);
      await expect(bookStore.row(KNOWN_BOOK.title)).toBeVisible();

      await bookStore.openBook(KNOWN_BOOK.title);
      await expect(bookDetail.title).toContainText(KNOWN_BOOK.title);

      const addToCollectionResponse = page.waitForResponse(
        (response) =>
          response.url().includes("/BookStore/v1/Books") &&
          response.request().method() === "POST",
      );
      await bookDetail.addToCollectionButton.click();
      const response = await addToCollectionResponse;
      const responseBody = await response.text().catch(() => "<no body>");
      expect(
        response.status(),
        `Add-to-collection failed: ${responseBody}`,
      ).toBe(201);
    });

    // 4. Confirm it shows up in the collection.
    await test.step('see the book in my collection', async () => {

      // site is broken and i dont have time to find the issue , after adding the book to collection it is not showing in profile page 
      // and looks like i unauthorized so i am tried logging out and logging in again to see the book in collection
      // this doesnt help as well, cuz books just not loading in profile in case i know for sure that they exist
      // tried to wait as well but still not working.
    //   await page.goto('/login');
    //   await test.step('log out', async () => {
    //   await profile.logoutButton.click();
    //   await expect(page).toHaveURL(/login/);
    // });
    //   await page.goto('/login');
      // here i tried to login with bre created profile
    //  await loginForm.login(SEED_USER.userName, SEED_USER.password);

      await page.goto('/profile');
      await expect(profile.logoutButtonProfile).toBeVisible();
      await expect(page).toHaveURL(/profile/);
      
      //await expect(profile.userNameValue).toContainText(apiUser.userName);
      //await page.waitForTimeout(9000);
      await expect(profile.bookRow(KNOWN_BOOK.title)).toBeVisible();
    });

    // 5. Delete it and confirm it's gone.
    await test.step('delete the book from my collection', async () => {
      await profile.deleteBook(KNOWN_BOOK.title);
      await expect(profile.bookRow(KNOWN_BOOK.title)).toHaveCount(0);
    });

    // 6. Log out.
    await test.step('log out', async () => {
      await profile.logoutButton.click();
      await expect(page).toHaveURL(/login/);
    });
  });
});
