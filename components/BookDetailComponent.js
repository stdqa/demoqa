
class BookDetailComponent {
  constructor(page) {
    this.page = page;

    this.title = page.locator('#title-wrapper').locator('#userName-value');
    this.addToCollectionButton = page.getByRole('button', { name: 'Add To Your Collection' });
  }
}

module.exports = { BookDetailComponent };
