/**
 * Component Object for the header/summary block on /profile
 * that shows the logged-in user's name and the logout action.
 */
class ProfileComponent {
  constructor(page) {
    this.page = page;

    this.userNameLabel = page.locator('#userName-label');
    this.userNameValue = page.locator('#userName-value');
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
  }
}

module.exports = { ProfileComponent };
