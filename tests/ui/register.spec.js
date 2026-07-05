const { test, expect } = require('../../fixtures/fixtures');
const { generateUser } = require('../../utils/testData');

test.describe('Registration — positive', () => {
  test('a user can register with valid data and sees a success popup', async ({ registerForm }) => {
    const user = generateUser();

    await registerForm.register(user);

    await expect(registerForm.successModalTitle).toHaveText(/Sign up/i);
    await expect(registerForm.successModalBody).toContainText('User Register Successfully.');
  });
});

test.describe('Registration — negative / required fields / boundaries', () => {
  test('registering twice with the same username shows "User already exists!"', async ({
    registerForm,
    page,
  }) => {
    const user = generateUser();

    await registerForm.register(user);
    await expect(registerForm.successModalBody).toContainText('User Register Successfully.');
    await registerForm.closeModalButton.click();

    // Same page, fresh attempt with the same username
    await page.reload();
    await registerForm.register(user);

    await expect(registerForm.errorMessage).toContainText('User already exists!');
  });

  const requiredFieldCases = [
    { field: 'first name', overrides: { firstName: '' } },
    { field: 'last name', overrides: { lastName: '' } },
    { field: 'username', overrides: { userName: '' } },
    { field: 'password', overrides: { password: '' } },
  ];

  for (const { field, overrides } of requiredFieldCases) {
    test(`registration is rejected when ${field} is empty`, async ({ registerForm, page }) => {
      const user = generateUser(overrides);

      await registerForm.register(user);

      await expect(registerForm.successModalTitle).toBeHidden();
      await expect(page).toHaveURL(/register/);
    });
  }

  // Equivalence classes for an invalid password (too short, no digit/symbol, common word)
  const weakPasswords = ['12345', 'password', 'abcdefgh'];

  for (const password of weakPasswords) {
    test(`registration is rejected for a weak password: "${password}"`, async ({ registerForm }) => {
      const user = generateUser({ password });

      await registerForm.register(user);

      await expect(registerForm.errorMessage).toBeVisible();
    });
  }

  test('a username made of only whitespace is treated as empty (boundary case)', async ({
    registerForm,
  }) => {
    const user = generateUser({ userName: '   ' });

    await registerForm.register(user);

    await expect(registerForm.successModalTitle).toBeHidden();
  });
});
