const express = require('express');
const { v4: uuid } = require('uuid');
const logger = require('../logger');
const bookmarks = require('../store');

const bookmarksRouter = express.Router();
const bodyParser = express.json();
let regEx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/

bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    const { title, url, description, rating } = req.body;
    if (!title || title.length < 1) {
      logger.error(`Title is required`);
      return res
        .status(400)
        .send('Invalid data');
    }
    if (!url || !url.match(regEx)) {
      logger.error(`Url is required`);
      return res
        .status(400)
        .send('Invalid data');
    }
    if (!description || description.length < 3) {
      logger.error(`description is required(at least 3 characters)`);
      return res
        .status(400)
        .send('Invalid data');
    }
    if (!rating || rating < 1 || rating > 5 || typeof rating !== 'number') {
      logger.error(`rating is required`);
      return res
        .status(400)
        .send('Invalid data');
    }

    const id = uuid();

    let newBookmark = {
      id,
      title,
      url,
      description,
      rating: parseInt(rating),
    };
    bookmarks.push(newBookmark);

    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${id}`)
      .json({ newBookmark, message: 'bookmark created' });
  });

bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    const { id } = req.params
    const bookmark = bookmarks.find(bookmark => bookmark.id === id);
    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found`);
      return res
        .status(404)
        .send('Bookmark not found');
    }
    res.json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;
    const bookmarkIdx = bookmarks.findIndex(bookmark => bookmark.id === id);

    if (bookmarkIdx === -1) {
      logger.error(`Bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Bookmark not found');
    }

    bookmarks.splice(bookmarkIdx, 1);
    logger.info(`Bookmark with id ${id} deleted.`);
    res
      .status(204)
      .end();
  });


module.exports = bookmarksRouter;