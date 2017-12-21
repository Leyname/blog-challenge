const authController = require('../controllers/auth');
const router = require('express-promise-router')();
const strategy = require('../common/auth_strategy');
const passport = require('passport');

passport.use(strategy);

router.post('/registration', authController.registration);
router.post('/auth/confirm/:hash_code', authController.confirmUser);
router.post('/auth/login', authController.login);
router.post('/auth/forgot_password', authController.changePassword);
router.post('/auth/reset', authController.reset);
router.get('/auth/check_code/:code', passport.authenticate('jwt', { session: false }), authController.checkCode);

module.exports = router;
