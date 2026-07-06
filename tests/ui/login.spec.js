const { test, expect } = require('../../fixtures/fixtures');
const { SEED_USER } = require('../../data/credentials');

test.describe('Login — positive (full flow)', () => {
  test('a user registered via the API can log in and lands on the profile page', async ({
      apiUser,
      loginForm,
      profile,
      page,
    }) => {
      
      await loginForm.login(apiUser.userName, apiUser.password);
  
      await expect(page).toHaveURL(/profile/);
      await expect(profile.logoutButton).toBeVisible();
      await expect(profile.userNameValue).toContainText(apiUser.userName);
    });
  
  test('the seeded demo account (test / Test123$%) can log in', async ({ loginForm, profile, page }) => {
    await loginForm.login(SEED_USER.userName, SEED_USER.password);

    await expect(page).toHaveURL(/profile/);
    await expect(profile.userNameValue).toContainText(SEED_USER.userName);
  });
});


test.describe('Login — negative / required fields', () => {
  // registeredUser is created via API — keeps these cases independent from the
  // UI registration flow and from each other.
  test('wrong password shows an invalid credentials error', async ({ loginForm, registeredUser }) => {
    await loginForm.login(registeredUser.userName, 'WrongPass1!');

    await expect(loginForm.errorMessage).toContainText('Invalid username or password!');
  });

  test('a non-existent username shows an invalid credentials error', async ({ loginForm }) => {
    await loginForm.login(`ghost_${Date.now()}`, 'SomePass1!');

    await expect(loginForm.errorMessage).toContainText('Invalid username or password!');
  });

  test('empty username is rejected (required field)', async ({ loginForm, page }) => {
    await loginForm.login('', 'SomePass1!');

    await expect(page).toHaveURL(/login/);
    await expect(loginForm.usernameInput).toHaveClass(/is-invalid/);
  });

  test('empty password is rejected (required field)', async ({ loginForm, page, registeredUser }) => {
    await loginForm.login(registeredUser.userName, '');
    
    await expect(page).toHaveURL(/login/);
    await expect(loginForm.passwordInput).toHaveClass(/is-invalid/);
  });
});
