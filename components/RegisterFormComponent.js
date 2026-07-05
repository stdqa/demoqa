/**
 * Component Object for the registration form on /register.
 * Encapsulates only what belongs to this widget — no page-level navigation logic here.
 */
class RegisterFormComponent {
  constructor(page) {
    this.page = page;

    this.firstName = page.getByRole('textbox', { name: 'First Name' });
    this.lastName = page.getByRole('textbox', { name: 'Last Name' });
    this.userName = page.getByRole('textbox', { name: 'UserName' });
    this.password = page.getByRole('textbox', { name: 'Password' });
    this.registerButton = page.getByRole('button', { name: 'Register' });

    // Inline error text (e.g. "User already exists!", weak password message)
    this.errorMessage = page.locator('#name');
  
  }

  async fill({ firstName, lastName, userName, password } = {}) {
    if (firstName !== undefined) await this.firstName.fill(firstName);
    if (lastName !== undefined) await this.lastName.fill(lastName);
    if (userName !== undefined) await this.userName.fill(userName);
    if (password !== undefined) await this.password.fill(password);
  }

  async submit() {
    await this.registerButton.click();
  }

  async register(user) {
    await this.fill(user);
    await this.submit();
  }
}

module.exports = { RegisterFormComponent };
