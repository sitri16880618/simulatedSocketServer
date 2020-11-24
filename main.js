const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 9090 });

var MaxSeconds = 30000;
var counter = 4;
const personList = ['P001', 'P002', 'P003', 'P004', 'P005', 'P006', 'P007', 'P008', 'P009', 'P010'];

wss.on('connection', function connection(ws) {

    sendRandomData(ws);

    ws.on('message', function incoming(message) {
        console.log(new Date(), 'Event:', message);

        // 解析
        switch (message) {
            case "getDeviceInfo":
                console.log('getDeviceInfo');
                break;
            case "getAlarmHis":
                console.log('getAlarmHis');
                break;
        }

    });
});

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// 送數據回iWorkSite Server
function sendRandomData(ws) {
    let timer = getRandomInt(MaxSeconds) + 30;
    setTimeout(() => {
        // console.log('After', timer);

        // 場內人數
        // let number = 10;

        getRecognitionData().then(data => {
            // console.log(data);
            let msg = {
                title: "FaceRecognitionEvent",
                data: data
            };
            ws.send(JSON.stringify(msg));

        }).catch(error => {
            console.log(error);
        });
        sendRandomData(ws);
    }, timer);
}

// 接收數據
function getRecognitionData() {
    return new Promise((resolve, reject) => {

        // 事件UUID
        counter++;
        // 取得現在時間
        let date = new Date().format("yyyy-MM-dd hh:mm:ss");
        // 隨機人員ID
        let person = personList[getRandomInt(personList.length)];

        // JSON格式資料 <TagName>:<Value>，體溫35-40度，小數點後第一位
        let data = {
            "deviceID": "D003",
            "人形偵測-事件UUID": counter.toString(),
            "口罩辨識-事件UUID": counter.toString(),
            "安全帽辨識-事件UUID": counter.toString(),
            "背心辨識-事件UUID": counter.toString(),
            "口罩辨識-人員UUID": person,
            "安全帽辨識-人員UUID": person,
            "背心辨識-人員UUID": person,
            "口罩辨識-結果": getRandomInt(2),
            "安全帽辨識-結果": getRandomInt(2),
            "背心辨識-結果": getRandomInt(2),
            "人形偵測-結果": getRandomInt(2),
            "體溫": (Math.random() * 5 + 35).toFixed(1),
            "口罩辨識-觸發時間": date,
            "安全帽辨識-觸發時間": date,
            "背心辨識-觸發時間": date,
            "人形偵測-觸發時間": date,
            "口罩辨識-截圖URL": "口罩辨識截圖",
            "背心辨識-截圖URL": "背心辨識截圖",
            "人形偵測-截圖URL": "人形偵測截圖",
            "安全帽辨識-截圖URL": "安全帽辨識截圖",
            "connectStatus": 1,
            "連線狀態更新時間": date
        };
        // console.log(data);
        resolve(data);
    });
}

// 將日期轉換成指定格式
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份 
        "d+": this.getDate(),                    //日 
        "h+": this.getHours(),                   //小时 
        "m+": this.getMinutes(),                 //分 
        "s+": this.getSeconds(),                 //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds()             //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}