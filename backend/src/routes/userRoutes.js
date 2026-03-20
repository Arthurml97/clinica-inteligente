const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/userController');
const { protect, restrictTo } = require('../middlewares/auth');

router.use(protect);
router.get('/', restrictTo('secretario'), getUsers);

module.exports = router;