const articlesController = require('../controllers/articles');
const router = require('express-promise-router')();
const strategy = require('../common/auth_strategy');
const passport = require('passport');

passport.use(strategy);

router.put('/articles/:id', passport.authenticate('jwt', { session: false }), articlesController.editArticle);
router.post('/articles', passport.authenticate('jwt', { session: false }), articlesController.addArticle);
router.get('/articles', articlesController.getPubicArticles);
router.get('/my', passport.authenticate('jwt', { session: false }), articlesController.getMyArticles);
router.delete('/articles/:id', passport.authenticate('jwt', { session: false }), articlesController.deleteArticles);

router.post('/articles/:id/comments', passport.authenticate('jwt', { session: false }), articlesController.addComment);
router.get('/articles/:id/comments', articlesController.getCommentList);
router.get('/articles/:id/comments/:id', articlesController.getComment);
router.delete('/articles/:id/comments/:commentId', passport.authenticate('jwt', { session: false }), articlesController.deleteComment);

module.exports = router;
