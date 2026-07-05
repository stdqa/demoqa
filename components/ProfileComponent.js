/**
 * Component Object for the header/summary block on /profile
 * that shows the logged-in user's name and the logout action.
 */
class ProfileComponent {
  constructor(page) {
    this.page = page;

    this.userNameLabel = page.getByText('User Name :');
    this.userNameValue = page.getByText(userName);
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
  }
}

module.exports = { ProfileComponent };
