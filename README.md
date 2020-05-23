프로젝트 소개
=============

방장이 유튜브링크로 PlayList를 등록하고, 참여자들과 실시간으로 음악을 같이듣는 서비스

------

> 기술 스택
```text
Node.js(express + socket.io) + NBP(naver business platform)
```

> 작업 순서
```text
<방장>

1. 사용자가 닉네임을 등록
2. 유튜브링크를 이용해 PlayList를 등록
3. 자신의 닉네임으로 방을 접속

<참여자>

1. 사용자가 닉네임을 등록
2. 방장의 닉네임으로 방을 접속

```

오픈소스 사용
====

>Host Server address
```text
http://27.96.134.23 (80번 port)
```
#
>API
- 닉네임 등록
 ```javascript
- URI : POST /login

- request body : { "nickName": 유저 닉네임 }
```

- 플레이리스트 등록

 ```javascript
- URI : POST /music/playList

- request Header : { "x-access-token" : 발급받은 jwt토큰 }
- request Body : { "songName" : 유저 닉네임, "youtubeUrl" : 유튜브 링크 }
```

- 방 접속

 ```javascript
- URI : GET /room

- request Header : { "x-access-token" : 발급받은 jwt토큰 }
- request QueryString : { "roomCode" : 입장하려는 방의 방장닉네임 }
```

- 방 생성

 ```javascript
- URI : POST /room

- request Header : { "x-access-token" : 발급받은 jwt토큰 }
- request Body : { "roomName" : 방 제목 }
```

#
>Socket.io
- 방 접속
```javascript
socket.emit('join', 자신닉네임);
```

- 현재 접속자 확인
```javascript
socket.on('userList', 현재 접속자 리스트);
```

- 실시간 노래 데이터 받기 (base64 형)
```javascript
socket.on('chunk', chunkData);
```

- 노래 변경하기
```javascript
socket.on('changeSong', 노래순서 값(int));
```

- 실시간 채팅 보내기
```javascript
socket.emit('chatServer', {
    "nickName" : 본인 닉네임,
    "message"  : 메세지 내용
});
```

- 실시간 채팅 받기
```javascript
socket.on('chatBrodcast', {
    "nickName" : 작성자 닉네임,
    "message"  : 메세지 내용
});
```
