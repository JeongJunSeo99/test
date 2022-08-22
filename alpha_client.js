var PORT = 5001; // Port 번호 설정
var HOST = '127.0.0.1'; //IP 주소 localhost로 설정
var dgram = require('dgram'); //UDP 통신에 필요한 모듈 임포트
var message1 = new Buffer('NetWork'); //Server로 수신 할 message를 Buffer에 담음
var message2 = new Buffer('NETWORK');
var message3 = new Buffer('network');
var client = dgram.createSocket('udp4'); //UDP Socket 생성

client.send(message1, 0, message1.length, PORT, HOST, function(err, bytes) { // Server로 message 전송
    if (err) throw err; //에러 처리
    console.log('UDP message sent to ' + HOST +':'+ PORT); // message를 보내는 Host + Port 번호를 log 찍음

});

client.send(message2, 0, message2.length, PORT, HOST, function(err, bytes) {
    if (err) throw err;
    console.log('UDP message sent to ' + HOST +':'+ PORT);

});

client.send(message3, 0, message3.length, PORT, HOST, function(err, bytes) {
    if (err) throw err;
    console.log('UDP message sent to ' + HOST +':'+ PORT);
    client.close();
});

