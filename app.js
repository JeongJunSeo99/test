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



/*
app.post("/angle", async (req, res) => {

    console.log(req.body);

    try {
       
        sid = req.body.serialnum
        let today = new Date();
        let cur_time = today.toLocaleString();

        var options = {
            qos:1
        };
        var bed_control = 'command/' + sid;

        var a = 4;
        var b = 1000;
        var c = 0;
        var d = 1;
        
        var msg = req.body.btnnum;
        //console.log(msg)
        
        var head_count= 0;
        var leg_count=0;

        if(msg== "headup" ){
            bed_c = {
                "function_mode" : req.body.f,
                "command_type" :req.body.c,
                "mh_sn" : sid,
                "head_count" : 5,
                "foot_count" : 0
            };
                
        }
        else if(msg == "headdown"){
            bed_c = {
                "function_mode" : req.body.f,
                "command_type" :req.body.c,
                "mh_sn" : sid,
                "head_count" : -5,
                "foot_count" : 0
            };
        }
        else if(msg == "legup"){
            bed_c = {
                "function_mode" : req.body.f,
                "command_type" :req.body.c,
                "mh_sn" : sid,
                "head_count" : 0,
                "foot_count" : 5
            };
            
        }
        else if(msg == "legdown"){
            bed_c = {
                "function_mode" : req.body.f,
                "command_type" :req.body.c,
                "mh_sn" : sid,
                "head_count" : 0,
                "foot_count" : -5
            };
            
        }
        else if(msg == "zg"){
            bed_c = {
                "function_mode" : 4,
                "command_type" :req.body.c,
                "mh_sn" : sid,
            };
        }
        else if(msg == "flat"){
            bed_c = {
                "function_mode" : 2,
                "command_type" :req.body.c,
                "mh_sn" : sid
            };
        }
    
        console.log(bed_c)
        client.publish(bed_control,JSON.stringify(bed_c),options);
        const result = {
            code: 200,
            msg: 'sucess',
            req_msg : msg
        };
        res.send(result);
    }
    catch (error) {
        console.error(error.message);
        const result = {
            code: 500,
            msg: 'server error'
        };
        res.send(result);
    }
});

*/