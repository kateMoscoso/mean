import { ClientWebPage } from './app.po';

describe('client-web App', function() {
  let page: ClientWebPage;

  beforeEach(() => {
    page = new ClientWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
