var net = require('net'); //TCP 통신을 위한 모듈 임포트
var mongoose = require('mongoose'); //MongoDB 사용을 위한 모듈 임포트

var db = mongoose.connection; //MongoDB와 연동
db.on('error', console.error);
db.once('open', function(){
console.log('connected mongodb server!');
});
mongoose.connect('mongodb://localhost/Net');

const UserSchema = new mongoose.Schema({ //DB Shcema 정의
	id: {
		type: String,
		required: true,
		unique : true
	},
	pw: {
		type: String,
		required: true
	},
	msg: {
		type: Number,
		require: true
	}
});

const User = mongoose.model("user", UserSchema); //Schema를 기반으로 Mongoose Model 생성

var server = net.createServer(async (socket) => //비동기 방식의 TCP Server를 만듦
{ 
	console.log(socket.address().address + " connected."); 

	socket.setEncoding('utf8'); // utf8로 인코딩

	socket.on('data', async(data) => { // Client가 전송한 data 출력
		console.log('rcv:' + data);
		
		try {
			var D = JSON.parse(data); // Client가 전송한 data를 JSON으로 파싱
			var usrid = D.id;
			var usrmsg = D.msg;

			if(usrmsg == 0){ //usrmsg가 0이면 회원가입을 의미
				let user = await User.findOne({ id: usrid }); //DB에 중복된 ID값이 존재하는지 Query문을 돌려 판단

				if (user) { //ID 중복 시
					console.log(user);
					return socket.write("유저 중복");
				}
				else{ // 중복된 ID가 아니라면 회원가입 성공
					user = new User({
						id : usrid,
						pw : D.pw,
						msg : usrmsg
						});
						
					const saveUser= await user.save();
						
					socket.write("회원가입 성공");
				}		
			}
			else if(usrmsg == 1){ //usrmsg가 0이면 로그인을 의미
				let user = await User.findOne({ id: usrid }); //DB에 로그인 정보가 존재하는지 Query문을 돌려 판단


				if(user){ //ID가 DB에 있을 시
					if(user.pw == D.pw){ //pw도 같으면 로그인 성공
						socket.write("login sucess");
					}
					else{// 비밀번호 오류
						socket.write("pw error");
					}
				}
				else{ //DB에 로그인 정보가 없을 경우
					socket.write("No User");
				}
			}
			else{ //mesagge 값이 존재하지 않는 경우
				socket.write("No message");
			}
		} 
    	catch (error) { //에러처리
        	console.error(error.message);
	        const result = {
    	        code: 500,
        	    msg: 'server error'
        	};
        	res.send(result);
    	} 
	}); 

	socket.on('close', function(){ // client와 접속 끊김
		console.log('client disconnted.'); });
 
	socket.write('welcome to server'); // client가 접속하면 화면에 message 출력
}); 

server.on('error', function(err){ console.log('err'+ err ); }); // 에러가 발생할 경우 화면에 에러메시지 출력 

server.listen(5000, function(){ console.log('linsteing on 5000..'); });// Port 5000으로 접속 가능하도록 대기 
