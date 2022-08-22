var net = require('net'); //TCP 통신을 위한 모듈 임포트

var socket = net.connect({port : 5000}); // 서버 5000번 포트로 접속 

socket.setEncoding('utf8'); // utf8로 인코딩

socket.on('connect', function(){  //Server와 connect
    console.log('connected to server!'); 

}); 

socket.write(JSON.stringify({ //JSON으로 변경 후 Server에게 message 전송
    id: "network",
    pw: "12",
    msg: "1"
    })
);

socket.on('data', function(chunk){ // 서버로부터 받은 데이터를 화면에 출력 
    console.log('recv:' + chunk); 
}); // 서버로부터 받은 데이터를 화면에 출력 

// 접속이 종료 message
socket.on('end', function(){ // 접속이 종료 message
    console.log('disconnected.'); 
}); 

socket.on('error', function(err){ // 에러 처리
    console.log(err); 
});

socket.on('timeout', function(){ //connection에서 timeout이 발생 시 message 출력 
    console.log('connection timeout.'); 
});
