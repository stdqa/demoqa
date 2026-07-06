/**
 * Component Object for the login form on /login.
 */
class LoginFormComponent {
  constructor(page) {
    this.page = page;

    this.usernameInput = page.getByRole('textbox', { name: 'UserName' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('#name');
  }

  async login(userName, password) {
    await this.usernameInput.fill(userName);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

module.exports = { LoginFormComponent };
