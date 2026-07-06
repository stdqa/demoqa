const base = require('@playwright/test');
const { RegisterFormComponent } = require('../components/RegisterFormComponent');
const { LoginFormComponent } = require('../components/LoginFormComponent');
const { ProfileComponent } = require('../components/ProfileComponent');
const { generateUser } = require('../utils/testData');
const { AccountApiClient } = require('../api/accountApiClient');

const test = base.test.extend({
  // Navigates to /register and hands back the component, ready to use.
  registerForm: async ({ page }, use) => {
    await page.goto('/register');
    await use(new RegisterFormComponent(page));
  },

  // Navigates to /login and hands back the component, ready to use.
  loginForm: async ({ page }, use) => {
    await page.goto('/login');
    await use(new LoginFormComponent(page));
  },

  // Doesn't navigate — used together with loginForm once already on /profile.
  profile: async ({ page }, use) => {
    await use(new ProfileComponent(page));
  },

  apiUser: async ({ request }, use) => {
      const client = new AccountApiClient(request);
      const user = await client.createUser();
  
      await use(user); // <-- test runs here
  
      if (user.userId && user.token) {
        await client.deleteUser(user.userId, user.token);
      }
    },

  // Creates a user via the API (fast, no UI flakiness) for tests that only
  // care about the login step, then deletes it afterwards to keep accounts clean.
  registeredUser: async ({ request }, use) => {
    const user = generateUser();

    const registerResponse = await request.post('/Account/v1/User', {
      data: { userName: user.userName, password: user.password },
    });
    const body = await registerResponse.json();
    user.userId = body.userId;

    await use(user); // <-- test runs here

    // Teardown: authenticate as the user, then delete the account.
    const tokenResponse = await request.post('/Account/v1/GenerateToken', {
      data: { userName: user.userName, password: user.password },
    });
    const { token } = await tokenResponse.json();

    if (token) {
      await request.delete(`/Account/v1/User/${user.userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  },
});

module.exports = { test, expect: base.expect };
