/**
 * Component Object for the registration form on /register.
 * Encapsulates only what belongs to this widget — no page-level navigation logic here.
 */
class RegisterFormComponent {
  constructor(page) {
    this.page = page;

    this.firstName = page.locator('#firstname');
    this.lastName = page.locator('#lastname');
    this.userName = page.locator('#userName');
    this.password = page.locator('#password');
    this.registerButton = page.locator('#register');

    // Inline error text (e.g. "User already exists!", weak password message)
    this.errorMessage = page.locator('#name');

    // Success popup shown after a valid registration
    this.successModalTitle = page.locator('.modal-title');
    this.successModalBody = page.locator('.modal-body');
    this.closeModalButton = page.locator('#closeSmallModal-ok, #closeSmallModal');
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
