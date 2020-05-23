const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config/jwt");

const login = (req, res)=>{

    const { nickName } = req.body;

    if(!nickName){
        res.json({
            "isSuccess":false,
            "code":200,
            "message":"닉네임을 입력해주세요"
        });
    }

    let token = jwt.sign(
        {
            nickname: nickName   // 토큰의 내용(payload)
        },
        JWT_SECRET ,    // 비밀 키
        {
            expiresIn: '30 days'    // 유효 시간은 1달
        });

    res.json({
        "result":token,
        "isSuccess":true,
        "code":100,
        "message":"닉네임등록 성공"
    });

};


module.exports = {
    login,
};