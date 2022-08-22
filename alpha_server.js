var PORT = 5001; // Port 번호 설정
var HOST = '127.0.0.1'; //IP 주소 localhost로 설정
var dgram = require('dgram'); //UDP 통신에 필요한 모듈 임포트
var server = dgram.createSocket('udp4'); //UDP Socket 생성

server.on('listening', function () { // UDP Server 준비
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) { //Client로부터 message 수신 시 이벤트 처리
    var msg = message.toString();

    if(msg == msg.toLowerCase()){ //입력받은 문자열의 소문자, 대문자 판단
        console.log(remote.address + ':' + remote.port +' - ' + msg.toUpperCase() + " -> 입력받은 문자열은 소문자입니다");
    }
    else if(msg == msg.toUpperCase()){
        console.log(remote.address + ':' + remote.port +' - ' + msg.toLowerCase() + " -> 입력받은 문자열은 대문자입니다");
    }
    else{
        console.log(remote.address + ':' + remote.port +' - ' + msg + " -> 입력받은 문자열에 소문자와 대문자가 섞여 있습니다");
    }
});

server.bind(PORT, HOST); //Socket에 Host 주소, Port번호 부여

