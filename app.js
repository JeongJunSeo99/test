var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
//var http = require('http').Server(app);
const port = 3001;

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
console.log('connected mongodb server!');
});
mongoose.connect('mongodb://localhost/Medex');

/*
//router 사용할 때, http://url:port/app_list까지는 여기서 설정되어 있음
// 만약, post url을 바꾸고 싶으면 밑에 app.use("app_list") -> 이 부분에서 /app_list를 다른걸로 바꾸면 http://url:port/~~로 설정 가능
//app.use("/1", require("./routes/1"));
//app.use("/2", require("./routes/2"));
//app.use("/3", require("./routes/3"));
// 위처럼 추가도 가능
*/
app
    .use(bodyParser.urlencoded({extended: true}))
    .use(bodyParser.json())
    .use(express.json({ extended: false }))
    .use(express.urlencoded({extended: true}))
    .use("/app_list", require("./routes/app_list"))
    .listen(port, () => {console.log('Express is listening on port', port);})
/*
app.listen(port, () => {
    console.log('Express is listening on port', port);
});
*/

/*
http.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });
*/
