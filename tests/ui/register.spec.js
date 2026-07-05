const { test, expect } = require('../../fixtures/fixtures');
const { generateUser } = require('../../utils/testData');

async function skipIfCaptchaBlocked(registerForm) {
  const text = await registerForm.errorMessage
    .textContent({ timeout: 3000 })
    .catch(() => null);

  if (text && text.includes('Please verify reCaptcha')) {
    test.skip(true, 'Blocked by reCAPTCHA — environment issue, not app logic');
  }
}

test.describe('Registration — positive', () => {
  test('a user can register with valid data and sees a success popup', async ({ registerForm, page }) => {
    const user = generateUser();

    const dialogPromise = page.waitForEvent('dialog');
    await registerForm.register(user);
    await skipIfCaptchaBlocked(registerForm);
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
    const existingUser = {
      firstName: 'Test',
      lastName: 'User',
      userName: 'test',
      password: 'Test123$%',
    };

    await registerForm.register(existingUser);
    await skipIfCaptchaBlocked(registerForm);

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
      await skipIfCaptchaBlocked(registerForm);
      await expect(registerForm[locator]).toHaveClass(/is-invalid/);
      test.fail(true, 'App does not display a required-field error message (only red border)');
      await expect(registerForm.errorMessage).toContainText('required');
      await expect(page).toHaveURL(/register/);
    });
  }

  // Equivalence classes for an invalid password (too short, no digit/symbol, common word)
  const weakPasswords = ['12345', 'password', 'abcdefgh'];

  for (const password of weakPasswords) {
    test(`registration is rejected for a weak password: "${password}"`, async ({ registerForm }) => {
      const user = generateUser({ password });

      await registerForm.register(user);
      await skipIfCaptchaBlocked(registerForm);
      await expect(registerForm.errorMessage).toContainText('Passwords must have at least one non alphanumeric character');
    });
  }

  test('a username made of only whitespace is treated as empty (boundary case)', async ({
    registerForm,
  }) => {
    const user = generateUser({ userName: '   ' });

    await registerForm.register(user);
    await skipIfCaptchaBlocked(registerForm);
    await expect(registerForm.successModalTitle).toBeHidden();
  });
});
