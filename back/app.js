const express = require('express');
const app = express();
const http = require('http').Server(app);

const fs = require('fs');
const socketio = require('socket.io');


//포트설정
let PORT = process.env.PORT;
if(!PORT){PORT=80;};

//기타모듈

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.static('../front'));

///////////// routing

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

app.use('/',apiRouter);
app.use('/test',indexRouter);


///////////////////

http.listen(PORT,()=>{
    console.log(PORT+'번 포트에서 Connected!');
});

//music split test

let total = 0;
let roomName;
let playList = new Array();
let musicChunk1 = new Array();
let musicChunk2 = new Array();
let musicChunk3 = new Array();

var size1 = 0;
var size2 = 0;

const inFile1 = fs.createReadStream('./public/music/test1.mp3',{
    "encoding":"base64",
});

inFile1.addListener('data', (data) => {
    musicChunk1.push(data);
    size1++;
});

inFile1.addListener('end', () => {
    console.log("finish!");
});

const inFile2 = fs.createReadStream('./public/music/test2.mp3',{
    "encoding":"base64",
});

inFile2.addListener('data', (data) => {
    musicChunk2.push(data);
    size2++;
});

inFile2.addListener('end', () => {
    console.log("finish!");
});


//////// socket

// 연결할 http 서버 객체 매개변수로 사용해 소켓 연결
// src에서 이 객체를 사용한다.
const io = socketio.listen(http);

var time = 0;

var index = 1;

var master = '';

var testCount = 0;

var test;

var userList = new Array();

var thisSong;
var thisSize;

io.sockets.on('connection', (socket) => {

    console.log("브라우저 연결 : " + socket.id);

    if(testCount == 0){
        master = socket.id;

        thisSong = musicChunk1;
        thisSize = size1;

        io.sockets.emit("chunk",thisSong[index]);
        index++;

        testCount++;
    }

    socket.on("join",(data)=>{

        var userInfo = new Object();

        userInfo.nickName = data;
        userInfo.id = socket.id;

        userList.push(userInfo);

        io.sockets.emit("userList", userList);

    });

    socket.on("count", (data) => {

        if(master == socket.id){

            console.log("client Data" + data);

            if(data > 10000){
                data = data/1000;
            }

            time = Number(data);

            console.log("time1: "+time);

            test = setTimeout(function() {
                // console.log(musicChunk1[index]);

                if(index < thisSize-5){
                    console.log(thisSong[index].length);
                    io.sockets.emit("chunk",thisSong[index]);
                    index++;
                }

                else{
                    index=1;
                }

                console.log(time*0.0005)

            }, time-(time*0.0005));

        }

    });

    socket.on("changeSong", (data) => {

        if(master == socket.id){

            if(data == 1){
                thisSong = musicChunk1;
                thisSize = size1;
                index = 1;
            }
            else if(data == 2){
                thisSong = musicChunk2;
                thisSize = size2;
                index = 1;
            }
        }

    });

    socket.on('chatServer', (data) => {

        console.log("chat data");
        console.log(data);
        io.sockets.emit("chatBroadcast", data);

    });


    socket.on('disconnect', () => {

        for(var i=0; i < userList.length; i++){
            if(userList[i]["id"]==socket.id){
                userList.splice(i, 1);
            }
        }

        io.sockets.emit("userList", userList);

        console.log("브라우저 퇴장 : " + socket.id)

    })

});