const url = require('url');
const querystring = require('querystring');
const {YD} = require('../config/youtube');

const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config/jwt");

// const {database} = require('./config/database');
//
// database.connect();


const addPlayList = (req, res)=>{

    // read the token from header or url
    const token = req.headers['x-access-token'] || req.query.token;

    if(!token) {
        return res.json({
            isSuccess:false,
            code: 300,
            message: '토큰이 없습니다.'
        });
    }

    const tokenInfo = jwt.verify(token, JWT_SECRET, (err,verifiedToken) => {
        if(err){
            return null;
        }
        else{
            return verifiedToken;
        }
    });

    if(!tokenInfo){
        res.json({
            isSuccess:false,
            code: 301,
            message:"유효하지 않은 토큰입니다"
        });
    }

    const {youtubeUrl, songName} = req.body;

    if(!youtubeUrl || !songName){
        res.json({
            isSuccess:false,
            code: 200,
            message:"곡 제목 혹은 유튜브링크를 입력해주세요"
        });
    }

    const curUrl = url.parse(youtubeUrl); //각 url 을 각 속성으로 분리

    const videoId = querystring.parse(curUrl.query);

    //Download video and save as MP3 file
    YD.download(videoId.v, songName+'.mp3');

    YD.on("finished", function(err, data) {
        console.log("finish music!!!");

        //db logic

        res.json({
            isSuccess:true,
            code: 100,
            message:"플레이리스트 등록 성공"
        });

    });

    YD.on("error", function(error) {
        console.log("err"+error);

        res.json({
            isSuccess:false,
            code: 201,
            message:"플레이리스트 등록 실패"
        });
    });

    YD.on("progress", function(progress) {
        console.log("progress");
    });

};

const addBackGround = (req, res)=>{
    res.send("good");
};


module.exports = {
    addPlayList,
    addBackGround,
};
