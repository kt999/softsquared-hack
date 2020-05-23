const router = require('express').Router();


// API 1
router.post('/login',(req, res)=>{
    res.send("good");
});

// API 2
router.post('/music/playList',(req, res)=>{
    res.send("good");
});

// API 3
router.post('/music/backGround',(req, res)=>{
    res.send("good");
});

// API 4
router.get('/room',(req, res)=>{
    res.send("good");
});

// API 5
router.post('/room',(req, res)=>{
    res.send("good");
});


module.exports = router;