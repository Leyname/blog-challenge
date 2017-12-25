const articlesController = require('../controllers/articles');
const router = require('express-promise-router');
const strategy = require('../common/auth_strategy');
const passport = require('passport');

passport.use(strategy);

// router.put('/articles/:id', articlesController.editArticle);
// router.post('/articles', articlesController.addArticle);
// router.get('/articles', articlesController.getPubicArticles);
// router.get('/my', articlesController.getMyArticles);
// router.delete('/articles/:id', passport.authenticate('jwt', { session: false }), articlesController.deleteArticles);
// router.post('/auth/reset', articlesController.reset);

// router.post('/articles/:id/comments', articlesController.addComment);
// router.get('/articles/:id/comments', articlesController.getCommentList);
// router.get('/articles/:id/comments/:id', articlesController.getComment);
// router.delete('/articles/:id/comments/:id', articlesController.deleteComment);

module.exports = router;
