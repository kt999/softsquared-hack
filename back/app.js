const express = require('express')
const app = express();
const http = require('http').Server(app);
const fs = require('fs');
const socketio = require('socket.io');

const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;

const url = require('url');
const querystring = require('querystring');

/////youtube

//Configure YoutubeMp3Downloader with your settings
var YD = new YoutubeMp3Downloader({
    "ffmpegPath": ffmpegPath,        // Where is the FFmpeg binary located?
    "outputPath": "./",    // Where should the downloaded and encoded files be stored?
    "youtubeVideoQuality": "highest",       // What video quality should be used?
    "queueParallelism": 2,                  // How many parallel downloads/encodes should be started?
    "progressTimeout": 2000                 // How long should be the interval of the progress reports
});


var urlStr = 'https://www.youtube.com/watch?v=2uQV_xf4oTk';

var curUrl = url.parse(urlStr); //각 url 을 각 속성으로 분리

var testQuery = querystring.parse(curUrl.query);

//Download video and save as MP3 file
YD.download(testQuery.v, "music.mp3");

YD.on("finished", function(err, data) {
    console.log("finish music!!!");
});

YD.on("error", function(error) {
    console.log("err"+error);
});

YD.on("progress", function(progress) {
    console.log("progress");
});



//포트설정
let PORT = process.env.PORT;
if(!PORT){PORT=80;};

//기타모듈
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.static('../front'));

///////////// front routing

app.get('/',(req, res)=>{
    fs.readFile("../front/index.html", "utf-8", (err, data)=>{
        res.type('text/html');
        res.send(data);
    });
});

app.get('/download',(req,res)=>{
    const music = "./music.mp3";
    res.download(music);
});

///////////// server routing

///////////////////
http.listen(PORT,()=>{
    console.log(PORT+'번 포트에서 Connected!');
});

//////// socket

// 연결할 http 서버 객체 매개변수로 사용해 소켓 연결
// src에서 이 객체를 사용한다.
const io = socketio.listen(http);

let total = 0;
let roomName;
let musicChunk = new Array();

// const inFile = fs.createReadStream('music.mp3',{
//     "encoding":"base64",
// });
//
// inFile.addListener('data', (data) => {
//
//     musicChunk.push(data);
//
// });
//
// inFile.addListener('error', (err) => {
//
//     console.log(err);
//
// });
//
// inFile.addListener('end', () => {
//     console.log("finish!");
// });
//
// inFile.addListener('close', function () {
//     console.log('closed now');
// });

var time = 0;

var index = 1;

var master = '';

var testCount = 0;

var test;

// on : 이벤트를 만들어라 connection은 예약어

//io.of('/main').on ~~~~ 으로도 사용가능
io.sockets.on('connection', (socket) => {

    // 여기서 join,broadcast,receive는 임의로 프론트와 맞추면되는거임. 즉, 객체화 가능

    console.log("브라우저 연결 : " + socket.id);

    if(testCount == 0){
        master = socket.id;
        testCount++;
    }

    if(master == socket.id){
        test = setInterval(function() {
            console.log(index);
            io.sockets.emit("chunk",musicChunk[index]);
            index++;
        }, 2000);
    }


    // socket.on("count", (data) => {
    //
    //     if(master == socket.id){
    //
    //         console.log("client Data" + data);
    //
    //         if(data > 10000){
    //             data = data/1000;
    //         }
    //
    //         time = Number(data);
    //
    //         console.log("time1: "+time);
    //
    //         test = setTimeout(function() {
    //             console.log("time2: "+time);
    //             // console.log(musicChunk[index]);
    //             console.log(index);
    //             io.sockets.emit("chunk",musicChunk[index]);
    //             index++;
    //         }, time-260);
    //
    //     }
    //
    // });

    console.log("hjihi");

    // 참가할 방 선택 & 접속한 브라우저 객체를 특정 공간에 등록.
    socket.on("join", (data) => {
        socket.join(data.roomName);
        roomName = data.roomName;
    });



    let count = 0;


    // broadcast라는 메소드 socket 통해 호출되면 매개변수로 전달된 data와 함께 적당한 로직
    socket.on("broadcast", (data) => {

        console.log(data);
        // chat 공간에 등록된 브라우저들에 특정 이벤트 수행
        total = total + Number(data.data);
        let name = data.name;
        // io.sockets.in(roomName).emit('receive', name+':'+total);
        io.sockets.in(roomName).emit('receive', data.data);

    });

    socket.on('disconnect', () => {
        console.log("브라우저 퇴장 : " + socket.id)
        // if(master == socket.id){
        //     clearInterval(test);
        // }
    })

});

// socket.io 사용시 Http 모듈로 Express를 실행한다.
app.get('/main', (req, res) => {
    fs.readFile("../front/main.html", "utf-8", (err, data)=>{
        res.type('text/html');
        res.send(data);
    }) ;
});
