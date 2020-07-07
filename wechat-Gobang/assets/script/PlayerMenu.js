var mvs = require("Mvs");
var glb = require("Glb");

cc.Class({
    extends: cc.Component,

    //空组件
    properties: {

        login: { //匹配房间
            default: null,
            type: cc.Button,
        },

        
        exito: { //创建房间
            default: null,
            type: cc.Button,
        },

        startg: {  //开始游戏
            default: null,
            type: cc.Button,
        },

        /*
        join: {
            default: null,
            type: cc.Button,
        }
        */

        roomover: {  //关闭房间
            default: null,
            type: cc.Button,
        },

        roomst: { //匹配信息
            default: null,
            type:cc.Sprite,

        },

        /*
        chessboard: {
            default: null,
            type: cc.Sprite,

        },*/

        roomid: { //房间号
            default: null,
            type: cc.Label,

        },

        owner: { //房主ID
            default: null,
            type: cc.Label,

        },

        
        playsec: {  //房间内其他玩家信息
            default: null,
            type: cc.Label,

        },

        roomstu: {  //房间关闭时返回的负载结果
            default: null,
            type: cc.Label,

        },

    },

    onLoad: function () {

        this.roomst.node.x = 10000;
        //this.chessboard.node.active = false;

        mvs.response.initResponse = this.initResponse.bind(this);
        mvs.response.registerUserResponse = this.registerUserResponse.bind(this);
        mvs.response.loginResponse = this.loginResponse.bind(this);
        mvs.response.joinRoomResponse = this.joinRoomResponse.bind(this);
        mvs.response.joinRoomNotify = this.joinRoomNotify.bind(this); 
        mvs.response.joinOverResponse = this.joinOverResponse.bind(this); 
        mvs.response.createRoomResponse = this.createRoomResponse.bind(this);
        mvs.response.joinOverNotify = this.joinOverNotify.bind(this);
        mvs.response.sendEventResponse = this.sendEventResponse.bind(this);
        mvs.response.sendEventNotify = this.sendEventNotify.bind(this);
        mvs.response.errorResponse = this.errorResponse.bind(this);
        

        this.login.node.on('click', this.joinRodom, this);  //匹配房间监听
        this.exito.node.on('click', this.createRoom, this); //加入房间监听
        this.startg.node.once('click', this.startgames, this); //开始游戏按钮
        this.roomover.node.once('click', this.rover, this);
        //this.exito.node.on('click', this. , this);
        //this.join.node.on('click', this. , this);

        this.init(); //初始化

        //this.logoinButton.node.on('click', this.logoint(), this);
        //this.exitOut.node.on('click', this.exitout(), this);
    },


    
    //初始化函数
    init: function () {

        var result = mvs.engine.init(mvs.response, 'Matchvs', 'alpha', 218337, 'f60937c9d99f4d3f8b6af985f5fff0d6#C', 1);
        if (result === 0) {
            console.log("开始初始化");
        }
        
    },

    //初始化函数回调
    initResponse(status) {
        if (status == 200) {
            console.log('初始化成功！' + status);

            var result = mvs.engine.registerUser();
            if (result != 0) {
                console.log('获取用户' + result);
            } else {
                console.log('用户获取成功');
            }

        } else {
            console.log('初始化失败：' + status);
        }
    },
    

    //注册函数回调
    registerUserResponse(userInfo) {

        var deviceId = 'abcdef';
        var gatewayId = 0;
        console.log('开始登录，用户ID：' + userInfo.id)
        var result = mvs.engine.login(userInfo.id, userInfo.token, deviceId);
        //var result = mvs.engine.login(userInfo.id, userInfo.token, 218337, 1, 'f60937c9d99f4d3f8b6af985f5fff0d6#C', '7befafa652574e1783f9ae3f65742c35', deviceId, gatewayId);
        if (result == 0) {
            glb.userInfo = userInfo; //用户信息保存到glb中
            console.log('正在登录' + result);
        } else {
            console.log('登录失败：' + result);
        }
    },

    //登录回调
    loginResponse(MsLoginRsp) {

        // 登录成功，loginRsp包含登录相关信息
        if (MsLoginRsp.status == 200) {
            console.log('登录成功' + MsLoginRsp.status);


        } else {
            console.log('登录失败');

            //登录成功，在此处添加场景跳转
        }
    },

    //匹配房间
    joinRodom() {

        this.roomst.node.x = 320;
        var result = mvs.engine.joinRandomRoom(2, 'I love China');  //加入房间
        if (result == 0) {

            console.log('玩家加入成功');  //输出玩家加入成功
        } else {
            console.log('result:' + result);
        }
    },

    //加入房间回调
    joinRoomResponse(status, roomUserInfoList, roomInfo) {  // 加入房间成功，status表示结果，roomUserInfoList为房间用户列表，roomInfo为房间信息

        if (status == 200) {

            this.roomid.string = '房间号:' + roomInfo.roomID;
            this.owner.string = '房主:' + roomInfo.ownerId;


            console.log('加入房间成功，房间号：' + roomInfo.roomID + '  房主：' + roomInfo.ownerId + '  房间状态：' + roomInfo.roomProperty);
            for (var i = 0; i < roomUserInfoList.length; i++) {
                console.log('加入房间的玩家ID：' + roomUserInfoList[i].userID);
            }
            if (roomUserInfoList.length == 0) {
                console.log('房间内无其他玩家');
            } 
            glb.playerUserIds = roomUserInfoList;  //记录下房间的用户列表
            
        } else {
            console.log('加入房间失败：' + status);
        }
    },

    //其他玩家加入房间通知
    joinRoomNotify(roomUserInfo) {
        for (var i = 0; i < roomUserInfo.length; i++) {
            console.log('加入房间的玩家ID：' + roomUserInfo[i].userID);
        }
    },


    //创建房间
    createRoom: function () {

        this.roomst.node.x = 320;
        var create = mvs.CreateRoomInfo;
        create.roomName = 'my room';
        create.maxPlayer = 2;
        create.mode = 0;
        create.canWatch = 0;
        create.visibility = 1;
        create.roomProperty = 2;
        console.log(create);
        var result = mvs.engine.createRoom(create, { maxPlayer: 2});
        if (result !== 0) {
            console.log('Failed to create room: ' + result);
        }
    },

    //创建房间回调
    createRoomResponse: function (rsp) {
        var status =rsp.status;
        if (status !== 200) {
            console.log('创建房间失败,异步回调错误码: ' + status);
        } else {

            this.roomid.string = '房间号：' + rsp.roomID;
            this.owner.string = '房主号：' + rsp.ownerId;

            console.log('成功创建房间，房间ID：' + rsp.roomID);
        }
    },

    

    
    //房间关闭
    rover: function () {

        var result = mvs.engine.joinOver("");
        if (result == 0) {
            console.log('房间关闭成功！');
        }

    },

    //房间关闭回调
    joinOverResponse(rsp) {
        if (rsp.status == 200) {
            this.roomstu.string = '房间已经关闭';
            console.log('房间关闭成功！');
        } else {
            console.log('房间关闭erro:' + rsp.status);
        }

    },

    
    //别人关闭房间回调
    joinOverNotify(notifyInfo) {
        this.roomstu.string = '房间已经关闭';
        console.log('joinOverNotify：user' + notifyInfo.srcUserID + 'closeID,playerID is: ' + notifyInfo.roomID);
    },

    /*
    //发送信息
    sendEvent() {
        var result = mvs.engine.sendEvent(msg);
        console.log('sendevent is' + msg);
    },*/

    startgames() { //开始游戏

        var event = {
            action: glb.GAME_START_EVENT,
            userIds: glb.playerUserIds
        }

        var result = mvs.engine.sendEvent(JSON.stringify(event));
        glb.events[result.sequence] = event;
        console.log('发送信息状态：' + result);



    },


    //发送消息回调
    sendEventResponse(info) {
        if (info.status == 200) {
            console.log('信息发送成功');
        } else {
            console.log('信息发送失败' + info.status);
        }

        var event = glb.events[info.sequence]
        if (event && event.action === glb.GAME_START_EVENT) {
            delete glb.events[info.sequence]
            cc.director.loadScene("InternetGame");
        }

    },

    //接收到其他用户消息通知
    sendEventNotify(info) {
        console.log('发送信息用户ID：' + info.srcUserID + '发送了：' + info.cpProto);
        if (info && info.cpProto && info.cpProto.indexOf(glb.GAME_START_EVENT) >= 0) {
            glb.playerUserIds = [glb.userInfo.id]
            // 通过游戏开始的玩家会把userIds传过来，这里找出所有除本玩家之外的用户ID，
            // 添加到全局变量playerUserIds中
            JSON.parse(info.cpProto).userIds.forEach(function (userId) {
                if (userId !== glb.userInfo.id) glb.playerUserIds.push(userId)
            });
            cc.director.loadScene("InternetGame");
        }
    },
    

    //错误信息回调
    errorResponse(errorCode, errorMsg) {
        console.log('errorMsg:' + errorMsg + 'errorCode:' + errorCode);
    },



});