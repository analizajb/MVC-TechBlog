const router = require('express').Router();
const { Comment } = require('../../models');

router.post('/', (req, res) => {
    Comment.create({
      ...req.body,
      user_id: req.session.user_id
    })
      .then(dbCommentData => res.json(dbCommentData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  });