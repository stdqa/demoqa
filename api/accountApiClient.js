const { generateUser } = require('../utils/testData');


class AccountApiClient {
  constructor(request) {
    this.request = request;
  }

  async register({ userName, password }) {
    const response = await this.request.post('/Account/v1/User', {
      data: { userName, password },
    });
    const body = await response.json().catch(() => ({}));
    return { status: response.status(), body };
  }

  async generateToken({ userName, password }) {
    const response = await this.request.post('/Account/v1/GenerateToken', {
      data: { userName, password },
    });
    const body = await response.json().catch(() => ({}));
    return { status: response.status(), body };
  }

  async deleteUser(userId, token) {
    return this.request.delete(`/Account/v1/User/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async createUser(overrides = {}) {
    const user = generateUser(overrides);

    const { status, body } = await this.register(user);
    if (status !== 201) {
      throw new Error(`API registration failed (status ${status}): ${JSON.stringify(body)}`);
    }
    user.userId = body.userId;

    const { body: tokenBody } = await this.generateToken(user);
    user.token = tokenBody.token;

    return user;
  }
}

module.exports = { AccountApiClient };
