const base = require('@playwright/test');
const { RegisterFormComponent } = require('../components/RegisterFormComponent');
const { LoginFormComponent } = require('../components/LoginFormComponent');
const { ProfileComponent } = require('../components/ProfileComponent');
const { BookStoreComponent } = require('../components/BookStoreComponent');
const { BookDetailComponent } = require('../components/BookDetailComponent');
const { AccountApiClient } = require('../api/accountApiClient');

const test = base.test.extend({
  // Navigates to /register and hands back the component
  registerForm: async ({ page }, use) => {
    await page.goto('/register');
    await use(new RegisterFormComponent(page));
  },

  // Navigates to /login and hands back the component.
  loginForm: async ({ page }, use) => {
    await page.goto('/login');
    await use(new LoginFormComponent(page));
  },

  // Doesn't navigate — used together with loginForm once already on /profile.
  profile: async ({ page }, use) => {
    await use(new ProfileComponent(page));
  },

  bookStore: async ({ page }, use) => {
    await use(new BookStoreComponent(page));
  },

  bookDetail: async ({ page }, use) => {
    await use(new BookDetailComponent(page));
  },

  apiUser: async ({ request }, use) => {
    const client = new AccountApiClient(request);
    const user = await client.createUser();

    await use(user);

    if (user.userId && user.token) {
      await client.deleteUser(user.userId, user.token);
    }
  },

  // Creates a user via the API (fast, no UI flakiness) for tests that only
  // care about the login step, then deletes it afterwards to keep accounts clean.
  registeredUser: async ({ request }, use) => {
    const client = new AccountApiClient(request);
    const user = await client.createUser();

    await use(user);

    if (user.userId && user.token) {
      await client.deleteUser(user.userId, user.token);
    }
  },
});

module.exports = { test, expect: base.expect };
