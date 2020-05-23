const router = require('express').Router();
const jwt = require("jsonwebtoken");

const JWT_SECRET = "dasdsfDSFDS#@$DFSFSa";

router.get('/',(req, res)=>{
    let token = jwt.sign(
        {
            nickname: "kiteak99"   // 토큰의 내용(payload)
        },
        JWT_SECRET ,    // 비밀 키
        {
            expiresIn: '30 days'    // 유효 시간은 1달
        });

    res.json({
        jwt:token,
    })
});


router.post('/',(req, res)=>{

    const {token} = req.body;

    const tokenInfo = jwt.verify(token, JWT_SECRET, (err,verifiedToken) => {
        if(err){
            return 0;
        }
        else{
            return verifiedToken;
        }
    });

    res.json({
        info:tokenInfo,
    })
});

module.exports = router;