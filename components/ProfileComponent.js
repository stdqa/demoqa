/**
 * Component Object for the header/summary block on /profile
 * that shows the logged-in user's name and the logout action.
 */
class ProfileComponent {
  constructor(page) {
    this.page = page;

    this.userNameLabel = page.locator('#userName-label');
    this.userNameValue = page.locator('#userName-value');
    this.logoutButton = page.locator('#submit').filter({ hasText: 'Log out' })
    this.logoutButtonProfile = page.locator('#submit').filter({ hasText: 'Logout' })
  }

  bookRow(title) {
    return this.collectionTable.locator('tr').filter({ hasText: title });
  }

  async deleteBook(title) {
    const row = this.bookRow(title);
    await row.locator('[id^="delete-record"], button, svg').last().click();

    const confirmButton = this.page.getByRole('button', { name: /yes/i });
    if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await confirmButton.click();
    }
  }
}

module.exports = { ProfileComponent };
