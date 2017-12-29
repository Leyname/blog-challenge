const articlesController = require('../controllers/articles');
const router = require('express-promise-router')();
const strategy = require('../common/auth_strategy');
const passport = require('passport');
const injectionUser = require('../common/injectionUser');

passport.use(strategy);

router.put('/articles/:id', passport.authenticate('jwt', { session: false }), injectionUser, articlesController.editArticle);
router.post('/articles', passport.authenticate('jwt', { session: false }), injectionUser, articlesController.addArticle);
router.get('/articles', articlesController.getPubicArticles);
router.get('/my', passport.authenticate('jwt', { session: false }), injectionUser, articlesController.getMyArticles);
router.delete('/articles/:id', passport.authenticate('jwt', { session: false }), injectionUser, articlesController.deleteArticles);

module.exports = router;
