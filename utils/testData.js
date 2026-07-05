function randomString(length = 6) {
  return Math.random().toString(36).slice(2, 2 + length);
}

/**
 * Generates a unique, valid user payload so each test run
 * doesn't collide with previously created accounts.
 */
function generateUser(overrides = {}) {
  const unique = `${Date.now()}_${randomString()}`;

  return {
    firstName: 'Test',
    lastName: 'User',
    userName: `user_${unique}`,
    password: 'StrongPass1!',
    ...overrides,
  };
}

module.exports = { generateUser, randomString };
