var mvs = require("Mvs");
var glb = require("Glb");

cc.Class({
    extends: cc.Component,

    properties: {

        overSprite: { //结束幕布
            default: null,
            type: cc.Sprite,
        },

        overLabel: { //结束字
            default: null,
            type: cc.Label,
        },

        chessPrefab: {//棋子的预制资源
            default: null,
            type: cc.Prefab,
        },

        gameagin: {
            default: null,
            type: cc.Button,
        },

        gomenu: {
            default: null,
            type: cc.Button,
        },

        chessList: {//棋子节点的集合，用一维数组表示二维位置
            default: [],
            type: [cc.node],
        },

        whiteSpriteFrame: {//白棋的图片
            default: null,
            type: cc.SpriteFrame,
        },

        blackSpriteFrame: {//黑棋的图片
            default: null,
            type: cc.SpriteFrame,
        },

        touchChess: {//每一回合落下的棋子
            default: null,
            type: cc.Node,
            visible: false//属性窗口不显示
        },

        audio: { //音效组件
            default: [],
            type: [cc.AudioClip],
        },

        gameState: 'black',  //下一步将落下的棋子

        fiveGroup: [],//五元组

        fiveGroupScore: []//五元组分数

    },

    onLoad: function () {

        //让结束画面位于屏幕外
        this.overSprite.node.x = 10000;

        mvs.response.sendEventResponse = this.sendEventResponse.bind(this);
        mvs.response.sendEventNotify = this.sendEventNotify.bind(this);
        mvs.response.logoutResponse = this.logoutResponse.bind(this);
        //初始化棋盘上225个棋子节点，并为每个节点添加事件
        for (var y = 0; y < 15; y++) {
            for (var x = 0; x < 15; x++) {

                //创建预制节点
                var newNode = cc.instantiate(this.chessPrefab);

                //将新节点添加到ChessBoard节点下作为其子节点
                newNode.parent = this.node;

                newNode.setPosition(cc.v2(x * 40 + 20, y * 40 + 20));//根据棋盘和棋子大小计算使每个棋子节点位于指定位置

                this.chessList.push(newNode);

            }
        }

        this.setListener();//落子监听
        this.gameagin.node.on('click', this.gagin, this); //再来一局
        this.gomenu.node.on('click', this.gmenu, this); //回到菜单
        //添加五元数组
        //横向
        for (var y = 0; y < 15; y++) {
            for (var x = 0; x < 11; x++) {
                this.fiveGroup.push([y * 15 + x, y * 15 + x + 1, y * 15 + x + 2, y * 15 + x + 3, y * 15 + x + 4]);
            }
        }
        //纵向
        for (var x = 0; x < 15; x++) {
            for (var y = 0; y < 11; y++) {
                this.fiveGroup.push([y * 15 + x, (y + 1) * 15 + x, (y + 2) * 15 + x, (y + 3) * 15 + x, (y + 4) * 15 + x]);
            }
        }
        //右上斜向
        for (var b = -10; b <= 10; b++) {
            for (var x = 0; x < 11; x++) {
                if (b + x < 0 || b + x > 10) {
                    continue;
                } else {
                    this.fiveGroup.push([(b + x) * 15 + x, (b + x + 1) * 15 + x + 1, (b + x + 2) * 15 + x + 2, (b + x + 3) * 15 + x + 3, (b + x + 4) * 15 + x + 4]);
                }
            }
        }
        //右下斜向
        for (var b = 4; b <= 24; b++) {
            for (var y = 0; y < 11; y++) {
                if (b - y < 4 || b - y > 14) {
                    continue;
                } else {
                    this.fiveGroup.push([y * 15 + b - y, (y + 1) * 15 + b - y - 1, (y + 2) * 15 + b - y - 2, (y + 3) * 15 + b - y - 3, (y + 4) * 15 + b - y - 4]);
                }
            }
        }

    },

    setListener: function () {

        //var Record = 0; //记录下当前位置
        //var RecordAi = 0;
        this.node.on(cc.Node.EventType.TOUCH_START, function (eventTouch) {

            var pos = new cc.Vec2(eventTouch.getLocationX(), eventTouch.getLocationY());  // 根据点击的像素位置，转换成网格中的位置
            pos = this.node.convertToNodeSpaceAR(pos);  //转换为UI坐标系
            if (pos.x < 0 || pos.x >= 600 || pos.y < 0 || pos.y >= 600) {   //如果鼠标位置位于地图之外则无效

                return false;
            }
            var x = Math.floor(pos.x / 40) + 1;  //返回小于等于x的最大整数
            var y = Math.floor(pos.y / 40) + 1;
            var k = x + y * 15 - 16;
            //Record = k;
            glb.position = k;  //将当前落子位置记录下来
            var event = {
                action: glb.GAME_MOVE_EVENT,
                position: glb.position
            }

            var result = mvs.engine.sendEvent(JSON.stringify(event));
            //发送的事件要缓存起来，收到异步回调时用于判断是那个事件发送成功
            glb.events[result.sequence] = event;



        }, this)
    },

    //发送事件回调
    sendEventResponse(info) {
        //输入校验
        var event = glb.events[info.sequence];
        if (event && event.action === glb.GAME_MOVE_EVENT) {
            delete glb.events[info.sequence]

            if (this.gameState == 'white' && this.chessList[event.position].getComponent(cc.Sprite).spriteFrame == null) {
                this.chessList[event.position].getComponent(cc.Sprite).spriteFrame = this.whiteSpriteFrame;//下子后添加棋子图片使棋子显示
                this.current = cc.audioEngine.play(this.audio[0], false, 1);
                this.touchChess = this.chessList[event.position];

                this.judgeOver(event.position);

            }
            if (this.gameState == 'black' && this.chessList[event.position].getComponent(cc.Sprite).spriteFrame == null) {
                this.chessList[event.position].getComponent(cc.Sprite).spriteFrame = this.blackSpriteFrame;//下子后添加棋子图片使棋子显示
                this.current = cc.audioEngine.play(this.audio[0], false, 1);
                this.touchChess = this.chessList[event.position];

                this.judgeOver(event.position);

            }
                

        }

    },

    //其他人发送事件回调
    sendEventNotify(info) {
        if (info && info.cpProto && info.cpProto.indexOf(glb.GAME_MOVE_EVENT) >= 0) {
            var msg = JSON.parse(info.cpProto);

            if (this.gameState == 'white' && this.chessList[msg.position].getComponent(cc.Sprite).spriteFrame == null) {
                this.chessList[msg.position].getComponent(cc.Sprite).spriteFrame = this.whiteSpriteFrame;//下子后添加棋子图片使棋子显示
                this.current = cc.audioEngine.play(this.audio[0], false, 1);
                this.touchChess = this.chessList[msg.position];

                this.judgeOver(msg.position);

            }
            if (this.gameState == 'black' && this.chessList[msg.position].getComponent(cc.Sprite).spriteFrame == null) {
                this.chessList[msg.position].getComponent(cc.Sprite).spriteFrame = this.blackSpriteFrame;//下子后添加棋子图片使棋子显示
                this.current = cc.audioEngine.play(this.audio[0], false, 1);
                this.touchChess = this.chessList[msg.position];

                this.judgeOver(msg.position);

            }
        }


    },

    judgeOver: function (achpos) {  //输赢判断
        var ache = achpos;
        var x0 = ache % 15;  //获取余数  与所下子相同的X
        var y0 = parseInt(ache / 15); //解析一个字符串，并返回一个整数（获取整除数）所下字相同的Y
        //判断横向
        var fiveCount = 0;
        for (var x = 0; x < 15; x++) {
            if ((this.chessList[y0 * 15 + x].getComponent(cc.Sprite)).spriteFrame === this.touchChess.getComponent(cc.Sprite).spriteFrame) {
                fiveCount++;
                if (fiveCount == 5) {
                    
                        this.overLabel.string = '游戏结束';
                        this.scheduleOnce(function () { this.overSprite.node.x = 0;  }, 0.5);//延迟一秒

                    
                    this.gameState = 'over';
                    return;
                }
            } else {
                fiveCount = 0;
            }
        }
        //判断纵向
        fiveCount = 0;
        for (var y = 0; y < 15; y++) {
            if ((this.chessList[y * 15 + x0].getComponent(cc.Sprite)).spriteFrame === this.touchChess.getComponent(cc.Sprite).spriteFrame) {
                fiveCount++;
                if (fiveCount == 5) {
                    
                    this.overLabel.string = '游戏结束';
                        this.scheduleOnce(function () { this.overSprite.node.x = 0;  }, 0.5);//延迟一秒
                    
                    this.gameState = 'over';
                    return;
                }
            } else {
                fiveCount = 0;
            }
        }
        //判断右上斜向
        var f = y0 - x0;
        fiveCount = 0;
        for (var x = 0; x < 15; x++) {
            if (f + x < 0 || f + x > 14) {
                continue;
            }
            if ((this.chessList[(f + x) * 15 + x].getComponent(cc.Sprite)).spriteFrame === this.touchChess.getComponent(cc.Sprite).spriteFrame) {
                fiveCount++;
                if (fiveCount == 5) {
                    
                    this.overLabel.string = '游戏结束';
                        this.scheduleOnce(function () { this.overSprite.node.x = 0; }, 0.5);//延迟一秒
                    
                    this.gameState = 'over';
                    return;
                }
            } else {
                fiveCount = 0;
            }
        }
        //判断右下斜向
        f = y0 + x0;
        fiveCount = 0;
        for (var x = 0; x < 15; x++) {
            if (f - x < 0 || f - x > 14) {
                continue;
            }
            if ((this.chessList[(f - x) * 15 + x].getComponent(cc.Sprite)).spriteFrame === this.touchChess.getComponent(cc.Sprite).spriteFrame) {
                fiveCount++;
                if (fiveCount == 5) {
                    
                    this.overLabel.string = '游戏结束';
                        this.scheduleOnce(function () { this.overSprite.node.x = 0;}, 0.5);//延迟一秒
                    
                    this.gameState = 'over';
                    return;
                }
            } else {
                fiveCount = 0;
            }
        }

        if (this.gameState == 'black') { //交换下子顺序
            this.gameState = 'white'
        } else if (this.gameState == 'white') {
            this.gameState = 'black'
        } 

                
    },

    gain: function () {

        cc.director.loadScene("Player");
        var results = mvs.engine.logout(""); //退出登录
        var result = mvs.engine.uninit();
        if (result == 0) {
            console.log('反初始化成功！');
        } else {
            console.log('反初始化失败！');
        }
    },

    gmenu: function () {

        cc.director.loadScene("Menu");
        var results = mvs.engine.logout(""); //退出登录
        var result = mvs.engine.uninit();
        if (result == 0) {
            console.log('反初始化成功！');
        } else {
            console.log('反初始化失败！');
        }
    },

    //退出登录
    logoutResponse(status) {
        if (status == 200) {
            console.log('logoutResponse：注销成功');
        } else if (status == 500) {
            console.log('logoutResponse：注销失败，服务器错误');
        }

    },

    
})