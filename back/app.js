const express = require('express')
const app = express();
const http = require('http').Server(app);
const fs = require('fs');
const socketio = require('socket.io');

//포트설정
let PORT = process.env.PORT;
if(!PORT){PORT=3000;};

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

// on : 이벤트를 만들어라 connection은 예약어

//io.of('/main').on ~~~~ 으로도 사용가능
io.sockets.on('connection', (socket) => {

    // 여기서 join,broadcast,receive는 임의로 프론트와 맞추면되는거임. 즉, 객체화 가능

    console.log("브라우저 연결 : " + socket.id);

    console.log("hjihi");

    // 참가할 방 선택 & 접속한 브라우저 객체를 특정 공간에 등록.
    socket.on("join", (data) => {
        socket.join(data.roomName);
        roomName = data.roomName;
    });

    // let count = 0;
    //
    // const inFile = fs.createReadStream('music.mp3');
    //
    // inFile.addListener('data', (data) => {
    //
    //     console.log(data);
    //     console.log( typeof data[0]);
    //     console.log(count++);
    //     io.sockets.in(roomName).emit('chunk', data)
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
    })

});

// socket.io 사용시 Http 모듈로 Express를 실행한다.
app.get('/main', (req, res) => {
    fs.readFile("../front/main.html", "utf-8", (err, data)=>{
        res.type('text/html');
        res.send(data);
    }) ;
});
