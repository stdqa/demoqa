const { test, expect } = require('../../fixtures/fixtures');
const { generateUser } = require('../../utils/testData');

test.describe('Login — positive (full flow)', () => {
  test('register via UI, then log in and land on the profile page', async ({
    registerForm,
    loginForm,
    profile,
    page,
  }) => {
    const user = generateUser();

    // 1. Register
    await registerForm.register(user);
    await expect(registerForm.successModalBody).toContainText('User Register Successfully.');
    await registerForm.closeModalButton.click();

    // 2. Go to login and sign in with the same credentials
    await page.goto('/login');
    await loginForm.login(user.userName, user.password);

    // 3. Verify redirect + profile state
    await expect(page).toHaveURL(/profile/);
    await expect(profile.logoutButton).toBeVisible();
    await expect(profile.userNameValue).toContainText(user.userName);
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
  });

  test('empty password is rejected (required field)', async ({ loginForm, page, registeredUser }) => {
    await loginForm.login(registeredUser.userName, '');

    await expect(page).toHaveURL(/login/);
  });
});
