cc.Class({
    extends: cc.Component,

    properties: {

        overSprite: { //结束幕布
            default: null,
            type: cc.Sprite,
        },

        changeSprite: { //开始幕布
            default: null,
            type: cc.Sprite,
        },

        overLabel: { //结束字
            default: null,
            type: cc.Label
        },

        timeLabel: { //结束字
            default: null,
            type: cc.Label
        },

        chessPrefab: {//棋子的预制资源
            default: null,
            type: cc.Prefab
        },


        goAhead: {
            default: null,
            type: cc.Button
        },

        afterWalk: {
            default: null,
            type: cc.Button
        },

        Regret: {  //悔棋按钮
            default: null,
            type: cc.Button
        },

        chessList: {//棋子节点的集合，用一维数组表示二维位置
            default: [],
            type: [cc.node]
        },


        whiteSpriteFrame: {//白棋的图片
            default: null,
            type: cc.SpriteFrame
        },

        blackSpriteFrame: {//黑棋的图片
            default: null,
            type: cc.SpriteFrame
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

        gameState: 'start',  //下一步将落下的棋子

        fiveGroup: [],//五元组

        fiveGroupScore: []//五元组分数

    },

    


    

    onLoad: function () {

        
        //让结束画面位于屏幕外
        this.overSprite.node.x = 10000;

        //var self = this.node;   //获取ChessBoard节点

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

        this.goAhead.node.once('click', function () {

            this.gameState = 'black';
            this.changeSprite.node.x = 15000;
            this.timer();


        }, this)

        this.afterWalk.node.once('click', function () {

            this.gameState = 'white';
            this.scheduleOnce(function () {

                this.chessList[112].getComponent(cc.Sprite).spriteFrame = this.whiteSpriteFrame;
                this.current = cc.audioEngine.play(this.audio[0], false, 1);

            }, 0.5);//延迟一秒电脑下棋

            this.gameState = 'black';
            this.changeSprite.node.x = 15000;
            this.timer();

        }, this)

       

        //开局白棋（电脑）在棋盘中央下一子
        //this.chessList[112].getComponent(cc.Sprite).spriteFrame = this.whiteSpriteFrame;
        //this.gameState = 'black';

        
       this.setListener();

        
        

        
       
        
        

   
        /*this.chessList[111].on(cc.Node.EventType.TOUCH_START, function (eventTouch) {

            if (this.gameState == 'black' && this.chessList[111].getComponent(cc.Sprite).spriteFrame == null) {
                this.chessList[111].getComponent(cc.Sprite).spriteFrame = this.blackSpriteFrame;//下子后添加棋子图片使棋子显示

            }
        }, this);*/

       

        

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

    timer: function () {

        var self = this;

        //计时器
        let countDownNode = this.timeLabel;
        countDownNode.string = 'time start!';
        let time = 300;

        countDownNode.schedule(function () {
            time--;
            let second = parseInt(time % 300);


            let timeStr = "";
            timeStr = second;

            if (second == 0) {
                self.gameState = 'over';
                self.changeSprite.node.x = 15000;
                self.overLabel.string = 'YOU LOST';
                self.overSprite.node.x = 0;
                self.current = cc.audioEngine.play(self.audio[2], false, 1);


            };
            if (self.overSprite.node.x == 0) {

                this.unscheduleAllCallbacks();  //游戏结束后删除计时器

            }
            countDownNode.string = timeStr;


        }, 1, time - 1, 0);

    },

   
    setListener: function () {

        var Record = 0; //记录下当前位置
        var RecordAi = 0;
        this.node.on(cc.Node.EventType.TOUCH_START, function (eventTouch) {

            var pos = new cc.Vec2(eventTouch.getLocationX(), eventTouch.getLocationY());  // 根据点击的像素位置，转换成网格中的位置
            pos = this.node.convertToNodeSpaceAR(pos);  //转换为UI坐标系
            if (pos.x < 0 || pos.x >= 600 || pos.y < 0 || pos.y >= 600) {   //如果鼠标位置位于地图之外则无效
              
                return false;
            }
            var x = Math.floor(pos.x / 40) + 1;  //返回小于等于x的最大整数
            var y = Math.floor(pos.y / 40) + 1;
            var k = x + y * 15 - 16;
            Record = k;
            if (this.gameState == 'black' && this.chessList[k].getComponent(cc.Sprite).spriteFrame == null) {

               
                this.chessList[k].getComponent(cc.Sprite).spriteFrame = this.blackSpriteFrame;//下子后添加棋子图片使棋子显示
                this.current = cc.audioEngine.play(this.audio[0], false, 1);
                this.touchChess = this.chessList[k];

                this.judgeOver(k);

                

                

            }
            if (this.gameState == 'white') {

                this.scheduleOnce(function () { RecordAi = this.ai() }, 1);//延迟一秒电脑下棋

            }

            this.Regret.node.once('click', function () {  //悔棋按钮

                this.chessList[Record].getComponent(cc.Sprite).spriteFrame = null;  //使最近一次的黑子图片置空
                this.chessList[RecordAi].getComponent(cc.Sprite).spriteFrame = null;  //使最近一次的白子图片置空
                this.overSprite.node.x = 10000;
                this.gameState = 'black'



            }, this)
           

        }, this)

        

        

    },

        
       




    //电脑下棋逻辑
    ai: function () {
        //评分
        for (var i = 0; i < this.fiveGroup.length; i++) {
            var b = 0;//五元组里黑棋的个数
            var w = 0;//五元组里白棋的个数
            for (var j = 0; j < 5; j++) {
                this.getComponent(cc.Sprite).spriteFrame
                if (this.chessList[this.fiveGroup[i][j]].getComponent(cc.Sprite).spriteFrame == this.blackSpriteFrame) {
                    b++;
                } else if (this.chessList[this.fiveGroup[i][j]].getComponent(cc.Sprite).spriteFrame == this.whiteSpriteFrame) {
                    w++;
                }
            }
            if (b + w == 0) {
                this.fiveGroupScore[i] = 7;
            } else if (b > 0 && w > 0) {
                this.fiveGroupScore[i] = 0;
            } else if (b == 0 && w == 1) {
                this.fiveGroupScore[i] = 35;
            } else if (b == 0 && w == 2) {
                this.fiveGroupScore[i] = 800;
            } else if (b == 0 && w == 3) {
                this.fiveGroupScore[i] = 15000;
            } else if (b == 0 && w == 4) {
                this.fiveGroupScore[i] = 800000;
            } else if (w == 0 && b == 1) {
                this.fiveGroupScore[i] = 15;
            } else if (w == 0 && b == 2) {
                this.fiveGroupScore[i] = 400;
            } else if (w == 0 && b == 3) {
                this.fiveGroupScore[i] = 1800;
            } else if (w == 0 && b == 4) {
                this.fiveGroupScore[i] = 100000;
            }
        }
        //找最高分的五元组
        var hScore = 0;
        var mPosition = 0;
        for (var i = 0; i < this.fiveGroupScore.length; i++) {
            if (this.fiveGroupScore[i] > hScore) {
                hScore = this.fiveGroupScore[i];
                mPosition = (function (x) {//js闭包
                    return x;
                })(i);
            }
        }
        //在最高分的五元组里找到最优下子位置
        var flag1 = false;//无子
        var flag2 = false;//有子
        var nPosition = 0;
        for (var i = 0; i < 5; i++) {
            if (!flag1 && this.chessList[this.fiveGroup[mPosition][i]].getComponent(cc.Sprite).spriteFrame == null) {
                nPosition = (function (x) { return x })(i);
            }
            if (!flag2 && this.chessList[this.fiveGroup[mPosition][i]].getComponent(cc.Sprite).spriteFrame != null) {
                flag1 = true;
                flag2 = true;
            }
            if (flag2 && this.chessList[this.fiveGroup[mPosition][i]].getComponent(cc.Sprite).spriteFrame == null) {
                nPosition = (function (x) { return x })(i);
                break;
            }
        }
        //在最最优位置下子
        this.chessList[this.fiveGroup[mPosition][nPosition]].getComponent(cc.Sprite).spriteFrame = this.whiteSpriteFrame;
        this.touchChess = this.chessList[this.fiveGroup[mPosition][nPosition]];
        //console.log(this.fiveGroup[mPosition][nPosition]);
        this.current = cc.audioEngine.play(this.audio[0], false, 1);
        this.judgeOver(this.fiveGroup[mPosition][nPosition]);//将AI下子的位置传入函数
        return this.fiveGroup[mPosition][nPosition]; //返回当前落子位置
    },

    judgeOver: function (achpos) {
        var ache = achpos;
        var x0 = ache % 15;  //获取余数  与所下子相同的X
        var y0 = parseInt(ache / 15); //解析一个字符串，并返回一个整数（获取整除数）所下字相同的Y
        //判断横向
        var fiveCount = 0;
        for (var x = 0; x < 15; x++) {
            if ((this.chessList[y0 * 15 + x].getComponent(cc.Sprite)).spriteFrame === this.touchChess.getComponent(cc.Sprite).spriteFrame) {
                fiveCount++;
                if (fiveCount == 5) {
                    if (this.gameState === 'black') {
                        this.overLabel.string = 'YOU WIN';
                        this.scheduleOnce(function () { this.overSprite.node.x = 0; this.current = cc.audioEngine.play(this.audio[1], false, 2); }, 0.5);//延迟一秒
                        
                    } else {
                        this.overLabel.string = 'YOU LOST';
                        this.scheduleOnce(function () { this.overSprite.node.x = 0; this.current = cc.audioEngine.play(this.audio[2], false, 1); }, 0.5);//延迟一秒
                    }
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
                    if (this.gameState === 'black') {
                        this.overLabel.string = 'YOU WIN';
                        this.scheduleOnce(function () { this.overSprite.node.x = 0; this.current = cc.audioEngine.play(this.audio[1], false, 2); }, 0.5);//延迟一秒
                    } else {
                        this.overLabel.string = 'YOU LOST';
                        this.scheduleOnce(function () { this.overSprite.node.x = 0; this.current = cc.audioEngine.play(this.audio[2], false, 1); }, 0.5);//延迟一秒
                    }
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
                    if (this.gameState === 'black') {
                        this.overLabel.string = 'YOU WIN';
                        this.scheduleOnce(function () { this.overSprite.node.x = 0; this.current = cc.audioEngine.play(this.audio[1], false, 2); }, 0.5);//延迟一秒
                    } else {
                        this.overLabel.string = 'YOU LOST';
                        this.scheduleOnce(function () { this.overSprite.node.x = 0; this.current = cc.audioEngine.play(this.audio[2], false, 1); }, 0.5);//延迟一秒
                    }
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
                    if (this.gameState === 'black') {
                        this.overLabel.string = 'YOU WIN';
                        this.scheduleOnce(function () { this.overSprite.node.x = 0; this.current = cc.audioEngine.play(this.audio[1], false, 2); }, 0.5);//延迟一秒
                    } else {
                        this.overLabel.string = 'YOU LOST';
                        this.scheduleOnce(function () { this.overSprite.node.x = 0; this.current = cc.audioEngine.play(this.audio[2], false, 1);}, 0.5);//延迟一秒
                    }
                    this.gameState = 'over';
                    return;
                }
            } else {
                fiveCount = 0;
            }
        }
        //没有输赢交换下子顺序
        if (this.gameState === 'black') {
            this.gameState = 'white';
        } else if(this.gameState === 'white'){
            this.gameState = 'black';
        }
    }

});
