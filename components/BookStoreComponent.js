
class BookStoreComponent {
  constructor(page) {
    this.page = page;

    this.searchBox = page.locator('#searchBox');
    this.resultsTable = page.locator('tbody');
  }

  row(title) {
    return this.resultsTable.locator('tr').filter({ hasText: title });
  }

  async searchBooks(term) {
    await this.searchBox.fill(term);
  }

  async openBook(title) {
    await this.row(title).getByText(title, { exact: true }).click();
  }
}

module.exports = { BookStoreComponent };
