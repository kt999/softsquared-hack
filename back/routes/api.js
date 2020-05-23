const router = require('express').Router();

// import controller
const {login} = require('../controllers/login');
const {addPlayList, addBackGround} = require('../controllers/music');
const {joinRoom, addRoom} = require('../controllers/room');


// API 1
router.post('/login',login);

// API 2
router.post('/music/playList',addPlayList);

// API 3
router.post('/music/backGround',addBackGround);

// API 4
router.get('/room',joinRoom);

// API 5
router.post('/room',addRoom);


module.exports = router;