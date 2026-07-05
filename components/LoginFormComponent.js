/**
 * Component Object for the login form on /login.
 */
class LoginFormComponent {
  constructor(page) {
    this.page = page;

    this.userName = page.getByRole('textbox', { name: 'UserName' });
    this.password = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('.error-message');
  }

  async login(userName, password) {
    await this.userName.fill(userName);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}

module.exports = { LoginFormComponent };
