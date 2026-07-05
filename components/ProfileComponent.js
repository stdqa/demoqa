/**
 * Component Object for the header/summary block on /profile
 * that shows the logged-in user's name and the logout action.
 */
class ProfileComponent {
  constructor(page) {
    this.page = page;

    this.userNameValue = page.locator('#userName-value');
    this.logoutButton = page.locator('#submit');
  }
}

module.exports = { ProfileComponent };
