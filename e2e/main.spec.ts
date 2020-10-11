import { expect } from 'chai';
import { SpectronClient } from 'spectron';
import commonSetup from './common-setup';


describe('dopamine App', () => {
  commonSetup.apply(this);

  let browser: any;
  let client: SpectronClient;

  beforeEach(() => {
    client = this.app.client;
    browser = client as any;
  });

  it('should display message saying App works !', async () => {
    const text = await browser.getText('app-home h1');
    expect(text).to.equal('App works !');
  });


  it('creates initial windows', async () => {
    const count = await client.getWindowCount();
    expect(count).to.equal(1);
  });
});
