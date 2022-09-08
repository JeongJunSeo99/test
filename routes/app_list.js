const express = require("express"); 
const User = require("../model/user");
const Bed = require("../model/bed");
const Enviroment_data = require("../model/enviroment_data");
const Snore_data = require("../model/snore_data");
const File = require("../model/file");
const Today = require("../model/today");
const Mat = require("../model/mat_data");
const router = express.Router();          
//const bcrypt = require("bcryptjs");     
const mongoose = require("mongoose");
const multer = require("multer");
const schedule = require('node-schedule');
const { PythonShell }= require("python-shell");
var fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads') // 파일 업로드 경로
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()) //파일 이름 설정
    }
})

//const upload = multer({dest : 'uploads/', limits: { filesize: 100 * 1024 * 1024}});
const upload = multer({storage: storage});

/* 
1. 모델 폴더에 스키마 정의 
2. 해당 스크립트에 정의한 스키마를 변수로 선언
3. 몽고DB model을 가져오기 위해 var 변수명 = mongoose.model('변수명', 정의한 스키마); 를 선언
4. 3번에서 정의한 변수명으로 쿼리문 사용
*/

router.post("/sign_up", async (req, res) => { //회원가입
    const result123 = {
        code: 100,
        msg: 'server nodt'
    };
    let timestamp = + new Date();

    let today = new Date();

    //console.log(today.getDate.toLocaleString() + "/" + timestamp);
    res.send(today.toLocaleString() + "/" + timestamp);

    try { // id 비교 
        usrid = req.body.userid
      
        let user = await User.findOne({ id: usrid });

        const re = {
            code: 400,
            msg: '유저 중복'
        };

        if (user) {
            console.log(user);
            return res.send(re);
        }
        /*
        const salt = await bcrypt.genSalt(10);
        usrpw = await bcrypt.hash(usrpw, salt);
        */
        user = new User({
        id : req.body.userid,
        password : req.body.userpw,
        phone_number : req.body.userph,
        gender : '0',
        birth: '0',
        height: '0',
        weight: '0',
        sleeptime: '0',
        wakeuptime: '0',
        sickness: '0',
        satisfaction: '0',
        serialnum : req.body.serialnum
        //name
        });

        const saveUser=await user.save();
        const r1 = {
            code: 200,
            msg: 'sucess'
        };
        res.send(r1);
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

router.post("/sign_in", async (req, res) => { //로그인

    let user = await User.findOne({ id: req.body.id });

    User.findOne({ id: req.body.id, password: req.body.password }, (err,user) => {
        if (err){
            const result123 = {
                code: 100,
                msg: 'server nodt'
            };
            res.send(result123);
            const result = {
                code: 500,
                msg: 'server error'
            };
            res.send(result);
        }
        else if(user){
            const r1 = {
                code: 200,
                msg: 'sucess',
                serial : user.serialnum
                //name

            };
            res.send(r1);
        }
        else{
            const re = {
                code: 400,
                msg: 'data null'
            };
            res.send(re);
        }
    });
    /*
    var Usr_model = mongoose.model('User', User); // 'User'는 데이터베이스 이름, User_model은 class 이름 -> 클래스 정의

    Usr_model.findOne({ id: req.body.id, password: req.body.password }, (err,user) => {
        if (err){
            const result = {
                code: 500,
                msg: 'server error'
            };
            res.send(result);
        }
        else if(user){
            const r1 = {
                code: 200,
                msg: 'sucess'
            };
            res.send(r1);
        }
        else{
            const re = {
                code: 400,
                msg: '유저 중복'
            };
            res.send(re);
        }
    });
    */
});

router.post("/information", async (req, res) => { //인포메이션 찾기
    
    console.log(req.body);

    try { // id 비교 
		let info = await Information.find({serialnumn : req.body.serialnum})
        
        const r1 = {
            code: 200,
            msg: 'sucess'
        };
        res.send(r1);
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

router.post("/survey", async (req, res) => { //설문조사
    
    console.log(req.body);

    try { // id 비교 
        serial = req.body.serialnum

        //let user = await User.findOne({ serial });
		
        let user = await User.update({serialnum : serial }, {
        $set: {
            gender : req.body.gender,
            birth: req.body.birth,
            height: req.body.height, 
            weight: req.body.weight,
            sleeptime: req.body.sleeptime, 
            wakeuptime: req.body.wakeuptime, 
            sickness: req.body.sickness, 
            satisfaction:req.body.satisfaction 
        }
        });

        const r1 = {
            code: 200,
            msg: 'sucess'
        };
        res.send(r1);
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

router.post("/change", async (req, res) => { //설문조사
    
    console.log(req.body);
    
    try { // id 비교 
        serial = req.body.serialnum;
        user_name = req.body.name;
        phone_number = req.body.ph;
        console.log(user_name + "/" + phone_number);    

		if(user_name == ""){
            let user = await User.findOne({ serialnum : serial });  
            user_name = user.name;
        }
        else if(phone_number == ""){
            let user = await User.findOne({ serialnum : serial });  
            phone_number = user.phone_number
        }
        
        let user = await User.update({serialnum : serial }, {
        $set: {
            name : user_name,
            phone_number: phone_number
        }
        });

        const r1 = {
            code: 200,
            msg: 'sucess'
        };
        res.send(r1);
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

router.post("/pw_1", async (req, res) => { //비밀번호 찾기 (확인하는단계)
    User.findOne({ id: req.body.id, phone_number: req.body.ph }, (err,user) => {
        if (err){
            const result = {
                code: 500,
                msg: 'server error'
            };
            res.send(result);
        }
        else if(user){
            const r1 = {
                code: 200,
                msg: 'sucess'
            };
            res.send(r1);
        }
        else{
            const re = {
                code: 400,
                msg: 'data null'
            };
            res.send(re);
        }
    });
});

router.post("/pw_2", async (req, res) => { //비밀번호 찾기(비밀번호 수정하는 단계)
    try { // id 비교 
        serial = req.body.serialnum

        //let user = await User.findOne({ serial });
		
        let user = await User.update({id: req.body.id, phone_number: req.body.ph }, {
        $set: {
            password : req.body.pw
        }
        });

        const r1 = {
            code: 200,
            msg: 'sucess'
        };
        res.send(r1);
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

router.post("/sleep_check", async (req, res) => { 
    try { // id 비교 
        serial = req.body.serialnum

        let day = new Date(); // 현재 시간 구하는 함수
        //let cur_time = day.toLocaleString();
        let cur_time = day.getTime();

        let bed = await Bed.findOne({ serialnum: serial, msg: "sleep" }).sort({"_id":-1}).limit(1);
        console.log(bed);
        if(bed){
            tmp = bed.sleep_seq + 1; //전 날 수면체크 + 1

            bed = new Bed({
                time : cur_time,
                msg : "sleep",
                sleep_seq: tmp,
                serial : serial
                });
    
            const saveBed=await bed.save();
            const r1 = {
                code: 200,
                msg: 'sucess'
            };
            res.send(r1);
            
        }
        else{
            let tmp = 1;

            bed = new Bed({
            time : cur_time,
            msg : "sleep",
            sleep_seq: tmp,
            serial : serial
            });
    
            const saveBed=await bed.save();
            const r1 = {
                code: 200,
                msg: 'sucess'
            };
            res.send(r1);
        }

        
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

router.post("/snore", async (req, res) => { 
    try { // id 비교 
        serial = req.body.serialnum

        let day = new Date(); // 현재 시간 구하는 함수
        let cur_time = day.getTime();
        let min = day.getMinutes();
        let c = 1;
        snore = new Snore_data({
            serial : serial,
            min : min,
            time : cur_time,
            snore_db1 : req.body.snore_db1,
            snore_db2 : req.body.snore_db2,
            snore_db3 : req.body.snore_db3,
            snore_db4 : req.body.snore_db4,
            snore_db5 : req.body.snore_db5,
            snore_db6 : req.body.snore_db6,
            snore_db7 : req.body.snore_db7,
            snore_db8 : req.body.snore_db8,
            snore_db9 : req.body.snore_db9,
            snore_db10 : req.body.snore_db10,
            check : c
        });

        const saveSnore_data=await snore.save();
        const r1 = {
            code: 200,
            msg: 'sucess'
        };
        res.send(r1);
        
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

router.post("/en", async (req, res) => { 
    try { // id 비교 
        serial = req.body.serialnum

        let day = new Date(); // 현재 시간 구하는 함수
        //let cur_time = day.toLocaleString();
        let cur_time = day.getTime();

        en = new Enviroment_data({
            serial : serial,
            ev_temp : 20,
            ev_hum: 20,
            ev_co2 : 10,
            time : cur_time
            });

        const saveEnviroment_data=await en.save();
        const r1 = {
            code: 200,
            msg: 'sucess'
        };
        res.send(r1);
        
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

router.post("/mat", async (req, res) => { 
    try { // id 비교 
        serial = req.body.serialnum

        let day = new Date(); // 현재 시간 구하는 함수
        //let cur_time = day.toLocaleString();
        let cur_time = day.getTime();

        mat = new Mat({
            mh_sn : serial,
            ble_connect : "a",
            current_temp : 30, /*default, max, unique ... */
            setting_temp : 35,
            off_time : 1,
            on_time : 1,
            mode : 1,
            cover: 1,
            water_level: 1,
            pump: 1,
            heater: 1,
            error: 1,
            time : cur_time,
            s_day : 0
            });

        const saveMat=await mat.save();
        const r1 = {
            code: 200,
            msg: 'sucess'
        };
        res.send(r1);
        
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

router.post("/wake_up_check", async (req, res) => { //여기에서 하루치 수면 저장
    try { 
        //하루치 수면 데이터 저장 할 때, 데이터 값을 하나 추가해 DB에 저장해 다른 날들과 구별해서 저장
        serial = req.body.serialnum
        let day = new Date(); // 현재 시간 구하는 함수
        let tmp2 = day.getTime();
        let sleep = await Bed.findOne({ serialnum: serial, msg: "sleep" }).sort({"_id":-1}).limit(1);
        tmp1 = sleep.time;
        var en = await Enviroment_data.find({serial: serial, time: {$gt : tmp1, $lt : tmp2} });
        var snore = await Snore_data.find({serial: serial, time: {$gt : tmp1, $lt : tmp2} });
        var tem_avg = 0;
        var hum_avg = 0;
        var co2_avg = 0;
        var pose_count =0;
        var snore_count =0;
        var snore_min = [];
        var s_count = 0;
        var mat_s_day = [];
        var m_count = 0;

        var sleep_time = Math.trunc((tmp2 - tmp1) /1000 /60 /60);
        console.log(sleep_time);

        var mat_ch = await Mat.find({serial: serial});

        console.log(mat_ch);

        for(var i=0; i<mat_ch.length; i++){
            if(mat_ch[i].s_day>0){
                mat_s_day.push(mat_ch[i].s_day);
            }
        }
        console.log(mat_s_day);

        if(mat_s_day.length>0){
            for(var i=0; i<mat_s_day.length; i++){
                if(m_count < mat_s_day[i]){
                    m_count=mat_s_day[i];
                    
                }
            }
            console.log(m_count);
        }

        let mat_1 = await Mat.update({serial: serial, time: {$gt : tmp1, $lt : tmp2} }, {
            $set: {
                s_day : m_count + 1
            }
        });

        // tmp1 ~ tmp2 사이 값 쿼리
        for( i=0; i<en.length; i++){
            tem_avg += en[i].ev_temp;
            console.log(tem_avg);

            if(i==en.length-1){
                tem_avg = tem_avg/en.length;
                console.log(tem_avg);
            }
        }

        for( i=0; i<en.length; i++){
            hum_avg += en[i].ev_hum;
            console.log(tem_avg);

            if(i==en.length-1){
                hum_avg = hum_avg/en.length;
                console.log(um_avg);
            }
        }

        for( i=0; i<en.length; i++){
            co2_avg += en[i].ev_co2;
            console.log(tem_avg);

            if(i==en.length-1){
                co2_avg = co2_avg/en.length;
                console.log(co2_avg);
            }
        }

        for( i=0; i<snore.length; i++){
            // snore 저장 시 min 값 저장
            
            //수면 시작 후 1분 단위로 코골이 값 평균 저장
            var j = i

            if(i==0){
                if(snore[i].min != snore[i+1].min){
                    if(snore[i].check == "1"){
                        var s1 = 0;
                        var s2 = 0;
                        s1 =Math.max(snore[i].snore_db1, snore[i].snore_db2, snore[i].snore_db3, snore[i].snore_db4, snore[i].snore_db5, 
                            snore[i].snore_db6, snore[i].snore_db7, snore[i].snore_db8, snore[i].snore_db9, snore[i].snore_db10);
                        snore_min.push(s1);
                    }
                    else{
                        snore_min.push(0);
                    }
                }
            }

            while(j+1<snore.length && snore[j].min == snore[j+1].min){

                var s1 = 0;
                var s2 = 0;
                var s3 = 0;
                var s4 = 0;
                var s5 = 0;
                var s_f =0;
                var snore_sec = [];
                
                
                console.log("b");

                if(snore[j].check == "1"){
                    console.log("c");
                    s1 =Math.max(snore[j].snore_db1, snore[j].snore_db2, snore[j].snore_db3, snore[j].snore_db4, snore[j].snore_db5, 
                        snore[j].snore_db6, snore[j].snore_db7, snore[j].snore_db8, snore[j].snore_db9, snore[j].snore_db10);

                    snore_sec.push(s1);
                    console.log(snore_sec);
                    s_count++;
                }

                
                if(j+2==snore.length){
                    /*
                    if(snore[j+1].check =="1"){
                        s4 = Math.max(snore[j+1].snore_db1, snore[j+1].snore_db2, snore[j+1].snore_db3, snore[j+1].snore_db4, snore[j+1].snore_db5, 
                            snore[j+1].snore_db6, snore[j+1].snore_db7, snore[j+1].snore_db8, snore[j+1].snore_db9, snore[j+1].snore_db10);

                        snore_sec.push(s4);
                        console.log(snore_sec);
                        s_count++;
                    }
                    */
                    if(s_count == 0){
                        s3 = 0 ;
                    }
                    else{
                        for(a=0;a<snore_sec.length;a++){
                            if(s3 < snore_sec[a]){
                                s3 = snore_sec[a];
                            }
                        }
                    }
                    snore_min.push(s3);
                    s_count = 0;
                    console.log("코골이 : " + snore_min);
                }
                else if(snore[j].min != snore[j+2].min){
                    if(s_count == 0){
                        s3 = 0 ;
                    }
                    else{
                        for(a=0;a<snore_sec.length;a++){
                            if(s3<snore_sec[a]){
                                s3 = snore_sec[a];
                            }
                        }    
                    }
                    snore_min.push(s3);
                    s_count = 0;
                    console.log("코골이 : " + snore_min);
                }

                console.log("e");
                j++;
            }     

            
            /*

            ---------------------------------------------------------------------------
            if(snore[i].코골이 존재 == true){
                if(i!=0){
                    if(snore[i-1].코골이 존재 == false){
                        var a[].append() = snore[i-1].time
                    }
                }

                코골이 존재하는 시간 + 분값을 전부 받음
                코골이 true인 데이터 개수 * 5초 = 전체 코골이 시간
                코골이 true인 데이터 시간
                
            }

            if(snore[i].코골이 존재 == false){
                if(i!=0){
                    if(snore[i-1].코골이 존재 == true){
                        var b[].append() = snore[i-1].time
                    }
                }
                //만약 일어나기 직전까지 코를 곤다면 a[], b[] 원소의 개수가 달라지므로, 예외처리해야함
                // a[].length != b[].length 이라면 b[] 마지막 원소에 일어나기 직전 시간 추가
                


                코골이 존재하는 시간 + 분값을 전부 받음
                코골이 true인 데이터 개수 * 5초 = 전체 코골이 시간
                코골이 true인 데이터 시간
                
            }
            */
        }

        let bed_wake = await Bed.findOne({ serialnum: serial, msg: "wake" }).sort({"_id":-1}).limit(1);

        if(bed_wake){
            var tmp = bed_wake.wake_seq + 1; //전 날 수면체크 + 1

            bed_wake = new Bed({
                time : tmp2,
                msg : "wake",
                wake_seq: tmp,
                serial : serial
            });

            const saveBed=await bed_wake.save();
        }
        else{
            let tmp = 1;

            bed_wake = new Bed({
                time : tmp2,
                msg : "wake",
                wake_seq: tmp,
                serial : serial
            });

            const saveBed=await bed_wake.save();
        }

        let today = await Today.findOne({ serial: serial }).sort({"_id":-1}).limit(1);

        if(today){
            let tmp = today.seq + 1; //전 날 수면체크 + 1

            today = new Today({
                serial: serial,
                temp: tem_avg,
                co2: co2_avg,
                hum: hum_avg,
                sleep_time: sleep_time,
                snore: snore_min,
                seq: tmp
            });
    
            const saveToday=await today.save();
            const r1 = {
                code: 200,
                msg: 'sucess'
            };
            res.send(r1);
            
        }
        else{
            let tmp = 1;

            today = new Today({
                serial: serial,
                temp: tem_avg,
                co2: co2_avg,
                hum: hum_avg,
                sleep_time: sleep_time,
                snore: snore_min,
                seq: tmp
            });
    
            const saveToday=await today.save();
            const r1 = {
                code: 200,
                msg: 'sucess'
            };
            res.send(r1);
        }
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

router.post("/today_sleep", async (req, res) => { 
    try { 
        let today = await Today.findOne({ serial: req.body.serial }).sort({"_id":-1}).limit(1);

        const r1 = {
            code: 200,
            msg: 'sucess',
            temp: today.temp,
            co2: today.co2,
            hum: today.hum,
            sleep_time: today.sleep_time,
            snore: today.snore
        };

        res.send(r1);
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

router.post('/test', upload.array('file'), async (req, res) => { //현준이랑 file 송수신 테스트
    try{

            console.log("destinatin에 저장된 파일 명 : ", req.files[0].filename);
            console.log("업로드된 파일의 전체 경로 ", req.files[0].path);
            console.log("사용자가 업로드한 파일 명 : ", req.files[0].originalname);
            
            let file = await File.findOne({ origin_name: req.files[0].originalname});
    
            if(file){
                if(fs.existsSync("./uploads/" + file.dest_name)){
                    fs.unlinkSync("./uploads/" + file.dest_name);
                    console.log("기존 파일 삭제");
                }

                let file_1 = await File.update({origin_name: req.files[0].originalname }, {
                    $set: {
                        origin_name : req.files[0].originalname,
                        dest_name: req.files[0].filename,
                        path : req.files[0].path
                    }
                });
            }
            else{
                file = await new File({
                    origin_name : req.files[0].originalname,
                    dest_name: req.files[0].filename,
                    path : req.files[0].path
                });
    
                const saveFile= await file.save();
            }
   
        //파일 메타데이터 오리지널 네임 + 데스티네이션 네임 + 경로를 DB에 저장해 맵핑
        
        console.log(req.body);
        console.log(req.files);
        res.send("hi");
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




router.post("/mdx", async (req, res) => {
    
    try {
        // 맞춤형 온도 서비스 모델에 사용
        serial = req.body.serialnum;
        /*
        let bed_wake = await Bed.findOne({ serialnum: serial, msg: "wake" }).sort({"_id":-1}).limit(1);
        let bed_sleep = await Bed.findOne({ serialnum: serial, msg: "sleep" }).sort({"_id":-1}).limit(1);

        var mat_1 = await Mat.find({serial: serial, time: {$gt : bed_sleep.time, $lt : bed_wake.time} }, 
        {"_id":false, "mh_sn":true, "current_temp" : true, "setting_temp" : true, "time":true, "s_day":true});
       */

        var mat_1 = await Mat.find({serial: serial, s_day : { $gt: 0 } }, 
        {"_id":false, "mh_sn":true, "current_temp" : true, "setting_temp" : true, "time":true, "s_day":true});

        console.log(mat_1);
        
        let options = {
            args: mat_1
        };

        
        PythonShell.run("./data_creation.py", options, function(err, data) {
            if (err) throw err;
            console.log(data);
        });

        res.send("ok");
        /*
        let p_options = {
            scriptPath: '/home/hadoop/Desktop/Medex/server',
            args: ['value1', 'value2']/home/hadoop/Desktop/Medex/server
          };
        
        let pyshell = new PythonShell('logistic_regression.py', p_options);
        //pyshell.send('/home/hadoop/Desktop/Medex/server/mdx_data.csv');
        pyshell.send('./mdx_data.csv')
        pyshell.on('msg', (msg) => {
	        console.log(msg)
            
        })
        */
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

module.exports = router; 