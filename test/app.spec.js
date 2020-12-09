'use strict';
const supertest = require('supertest');
const app = require('../src/app');
const bookmarks = require('../src/store');


describe('App', () => {
  it('GET / responds with 200 containing "Hi"', () => {
    return supertest(app)
      .get('/')
      .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
      .expect(200, 'Hi');
  });

  it('GET /bookmarks returns a list of bookmarks', () => {
    return supertest(app)
      .get('/bookmarks')
      .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
      .expect(200, bookmarks);
  });

  it('GET /bookmarks/:id return a single bookmark with the given id', () => {
    const id = 1;

    return supertest(app)
      .get(`/bookmarks/${id}`)
      .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
      .expect(200, bookmarks);
  });
})