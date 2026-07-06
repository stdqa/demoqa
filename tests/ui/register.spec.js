const { test, expect } = require('../../fixtures/fixtures');
const { generateUser } = require('../../utils/testData');
const { SEED_USER } = require('../../data/credentials');


test.describe('Registration — positive', () => {
  test('a user can register with valid data and sees a success popup', async ({ registerForm, page }) => {
    const user = generateUser();

    const dialogPromise = page.waitForEvent('dialog');
    await registerForm.register(user);
    const dialog = await dialogPromise;
    const message = dialog.message();
    await dialog.accept();

    expect(message).toContain('User Registered Successfully');
  });
});

test.describe('Registration — negative / required fields / boundaries', () => {
  test('registering with an already-used username shows "User already exists!"', async ({
  registerForm,
  }) => {
    await registerForm.register({
      firstName: 'Test',
      lastName: 'User',
      ...SEED_USER,
    });

    await expect(registerForm.errorMessage).toContainText('User exists!');
  });

  const requiredFieldCases = [
    { field: 'first name', overrides: { firstName: '' }, locator: 'firstName' },
    { field: 'last name', overrides: { lastName: '' }, locator: 'lastName' },
    { field: 'username', overrides: { userName: '' }, locator: 'userName' },
    { field: 'password', overrides: { password: '' }, locator: 'password' },
  ];

  for (const { field, overrides, locator } of requiredFieldCases) {
    test(`registration is rejected when ${field} is empty`, async ({ registerForm, page }) => {
      const user = generateUser(overrides);

      await registerForm.register(user);
      await expect(registerForm[locator]).toHaveClass(/is-invalid/);
    });
  }

  // Equivalence classes for an invalid password (too short, no digit/symbol, common word)
  const weakPasswords = ['12345', 'password', 'abcdefgh'];

  for (const password of weakPasswords) {
    test(`registration is rejected for a weak password: "${password}"`, async ({ registerForm }) => {
      const user = generateUser({ password });

      await registerForm.register(user);
      await expect(registerForm.errorMessage).toContainText('Passwords must have at least one non alphanumeric character');
    });
  }

  test('a username made of only whitespace is treated as empty (boundary case)', async ({
    registerForm,
    page,
  }) => {
    const user = generateUser({ userName: '   ' });
    
    const outcomePromise = Promise.race([
      page.waitForEvent('dialog').then((dialog) => dialog.dismiss()).then(() => 'dialog'),
      new Promise((resolve) => setTimeout(() => resolve('timeout'), 3000)),
    ]);

    await registerForm.register(user);
    await skipIfCaptchaBlocked(registerForm);

    expect(await outcomePromise, 'a whitespace-only username should not be accepted as valid').toBe('timeout');
  });
});
