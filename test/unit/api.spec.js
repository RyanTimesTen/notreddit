import { expect } from 'chai';
import nock from 'nock';

import { getUser } from '../../src/api';
import response from '../recordings/user.json';

describe('Get User Tests', () => {
  beforeEach(() => {
    nock('https://oauth.reddit.com')
      .get('/user/__gilb__/about')
      .reply(200, response);
  });

  it('Should get a user by username', () =>
    getUser('__gilb__', 'FAKETOKEN')
      .then(res => expect(typeof res).to.equal('object')));
});
