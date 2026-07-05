/**
 * Component Object for the login form on /login.
 */
class LoginFormComponent {
  constructor(page) {
    this.page = page;

    this.userName = page.locator('#userName');
    this.password = page.locator('#password');
    this.loginButton = page.locator('#login');
    this.errorMessage = page.locator('#name');
  }

  async login(userName, password) {
    await this.userName.fill(userName);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}

module.exports = { LoginFormComponent };
