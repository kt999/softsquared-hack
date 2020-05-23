const router = require('express').Router();

// import controller
const apiController = require('../controllers/api');

// API 1
router.post('/login',apiController.login);

// API 2
router.post('/music/playList',apiController.addPlayList);

// API 3
router.post('/music/backGround',apiController.addBackGround);

// API 4
router.get('/room',apiController.joinRoom);

// API 5
router.post('/room',apiController.addRoom);


module.exports = router;