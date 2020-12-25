const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

router.get('/registrieren', authController.signup_get);
router.post('/registrieren', authController.signup_post);
router.get('/anmelden', authController.login_get);
router.post('/anmelden', authController.login_post);

module.exports = router;