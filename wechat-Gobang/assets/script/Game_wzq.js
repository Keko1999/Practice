cc.Class({
    extends: cc.Component,

    properties: {

        overSprite: { //����Ļ��
            default: null,
            type: cc.Sprite,
        },

        changeSprite: { //��ʼĻ��
            default: null,
            type: cc.Sprite,
        },

        overLabel: { //������
            default: null,
            type: cc.Label
        },

        timeLabel: { //������
            default: null,
            type: cc.Label
        },

        chessPrefab: {//���ӵ�Ԥ����Դ
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

        Regret: {  //���尴ť
            default: null,
            type: cc.Button
        },

        chessList: {//���ӽڵ�ļ��ϣ���һά�����ʾ��άλ��
            default: [],
            type: [cc.node]
        },


        whiteSpriteFrame: {//�����ͼƬ
            default: null,
            type: cc.SpriteFrame
        },

        blackSpriteFrame: {//�����ͼƬ
            default: null,
            type: cc.SpriteFrame
        },

        touchChess: {//ÿһ�غ����µ�����
            default: null,
            type: cc.Node,
            visible: false//���Դ��ڲ���ʾ
        },

        audio: { //��Ч���
            default: [],
            type: [cc.AudioClip],
        },

        gameState: 'start',  //��һ�������µ�����

        fiveGroup: [],//��Ԫ��

        fiveGroupScore: []//��Ԫ�����

    },

    


    

    onLoad: function () {

        
        //�ý�������λ����Ļ��
        this.overSprite.node.x = 10000;

        //var self = this.node;   //��ȡChessBoard�ڵ�

        //��ʼ��������225�����ӽڵ㣬��Ϊÿ���ڵ�����¼�
        for (var y = 0; y < 15; y++) {
            for (var x = 0; x < 15; x++) {

                //����Ԥ�ƽڵ�
                var newNode = cc.instantiate(this.chessPrefab);

                //���½ڵ���ӵ�ChessBoard�ڵ�����Ϊ���ӽڵ�
                newNode.parent = this.node;


                
                    
                newNode.setPosition(cc.v2(x * 40 + 20, y * 40 + 20));//�������̺����Ӵ�С����ʹÿ�����ӽڵ�λ��ָ��λ��

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

            }, 0.5);//�ӳ�һ���������

            this.gameState = 'black';
            this.changeSprite.node.x = 15000;
            this.timer();

        }, this)

       

        //���ְ��壨���ԣ�������������һ��
        //this.chessList[112].getComponent(cc.Sprite).spriteFrame = this.whiteSpriteFrame;
        //this.gameState = 'black';

        
       this.setListener();

        
        

        
       
        
        

   
        /*this.chessList[111].on(cc.Node.EventType.TOUCH_START, function (eventTouch) {

            if (this.gameState == 'black' && this.chessList[111].getComponent(cc.Sprite).spriteFrame == null) {
                this.chessList[111].getComponent(cc.Sprite).spriteFrame = this.blackSpriteFrame;//���Ӻ��������ͼƬʹ������ʾ

            }
        }, this);*/

       

        

        //�����Ԫ����
        //����
        for (var y = 0; y < 15; y++) {
            for (var x = 0; x < 11; x++) {
                this.fiveGroup.push([y * 15 + x, y * 15 + x + 1, y * 15 + x + 2, y * 15 + x + 3, y * 15 + x + 4]);
            }
        }
        //����
        for (var x = 0; x < 15; x++) {
            for (var y = 0; y < 11; y++) {
                this.fiveGroup.push([y * 15 + x, (y + 1) * 15 + x, (y + 2) * 15 + x, (y + 3) * 15 + x, (y + 4) * 15 + x]);
            }
        }
        //����б��
        for (var b = -10; b <= 10; b++) {
            for (var x = 0; x < 11; x++) {
                if (b + x < 0 || b + x > 10) {
                    continue;
                } else {
                    this.fiveGroup.push([(b + x) * 15 + x, (b + x + 1) * 15 + x + 1, (b + x + 2) * 15 + x + 2, (b + x + 3) * 15 + x + 3, (b + x + 4) * 15 + x + 4]);
                }
            }
        }
        //����б��
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

        //��ʱ��
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

                this.unscheduleAllCallbacks();  //��Ϸ������ɾ����ʱ��

            }
            countDownNode.string = timeStr;


        }, 1, time - 1, 0);

    },

   
    setListener: function () {

        var Record = 0; //��¼�µ�ǰλ��
        var RecordAi = 0;
        this.node.on(cc.Node.EventType.TOUCH_START, function (eventTouch) {

            var pos = new cc.Vec2(eventTouch.getLocationX(), eventTouch.getLocationY());  // ���ݵ��������λ�ã�ת���������е�λ��
            pos = this.node.convertToNodeSpaceAR(pos);  //ת��ΪUI����ϵ
            if (pos.x < 0 || pos.x >= 600 || pos.y < 0 || pos.y >= 600) {   //������λ��λ�ڵ�ͼ֮������Ч
              
                return false;
            }
            var x = Math.floor(pos.x / 40) + 1;  //����С�ڵ���x���������
            var y = Math.floor(pos.y / 40) + 1;
            var k = x + y * 15 - 16;
            Record = k;
            if (this.gameState == 'black' && this.chessList[k].getComponent(cc.Sprite).spriteFrame == null) {

               
                this.chessList[k].getComponent(cc.Sprite).spriteFrame = this.blackSpriteFrame;//���Ӻ��������ͼƬʹ������ʾ
                this.current = cc.audioEngine.play(this.audio[0], false, 1);
                this.touchChess = this.chessList[k];

                this.judgeOver(k);

                

                

            }
            if (this.gameState == 'white') {

                this.scheduleOnce(function () { RecordAi = this.ai() }, 1);//�ӳ�һ���������

            }

            this.Regret.node.once('click', function () {  //���尴ť

                this.chessList[Record].getComponent(cc.Sprite).spriteFrame = null;  //ʹ���һ�εĺ���ͼƬ�ÿ�
                this.chessList[RecordAi].getComponent(cc.Sprite).spriteFrame = null;  //ʹ���һ�εİ���ͼƬ�ÿ�
                this.overSprite.node.x = 10000;
                this.gameState = 'black'



            }, this)
           

        }, this)

        

        

    },

        
       




    //���������߼�
    ai: function () {
        //����
        for (var i = 0; i < this.fiveGroup.length; i++) {
            var b = 0;//��Ԫ�������ĸ���
            var w = 0;//��Ԫ�������ĸ���
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
        //����߷ֵ���Ԫ��
        var hScore = 0;
        var mPosition = 0;
        for (var i = 0; i < this.fiveGroupScore.length; i++) {
            if (this.fiveGroupScore[i] > hScore) {
                hScore = this.fiveGroupScore[i];
                mPosition = (function (x) {//js�հ�
                    return x;
                })(i);
            }
        }
        //����߷ֵ���Ԫ�����ҵ���������λ��
        var flag1 = false;//����
        var flag2 = false;//����
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
        //��������λ������
        this.chessList[this.fiveGroup[mPosition][nPosition]].getComponent(cc.Sprite).spriteFrame = this.whiteSpriteFrame;
        this.touchChess = this.chessList[this.fiveGroup[mPosition][nPosition]];
        //console.log(this.fiveGroup[mPosition][nPosition]);
        this.current = cc.audioEngine.play(this.audio[0], false, 1);
        this.judgeOver(this.fiveGroup[mPosition][nPosition]);//��AI���ӵ�λ�ô��뺯��
        return this.fiveGroup[mPosition][nPosition]; //���ص�ǰ����λ��
    },

    judgeOver: function (achpos) {
        var ache = achpos;
        var x0 = ache % 15;  //��ȡ����  ����������ͬ��X
        var y0 = parseInt(ache / 15); //����һ���ַ�����������һ����������ȡ����������������ͬ��Y
        //�жϺ���
        var fiveCount = 0;
        for (var x = 0; x < 15; x++) {
            if ((this.chessList[y0 * 15 + x].getComponent(cc.Sprite)).spriteFrame === this.touchChess.getComponent(cc.Sprite).spriteFrame) {
                fiveCount++;
                if (fiveCount == 5) {
                    if (this.gameState === 'black') {
                        this.overLabel.string = 'YOU WIN';
                        this.scheduleOnce(function () { this.overSprite.node.x = 0; this.current = cc.audioEngine.play(this.audio[1], false, 2); }, 0.5);//�ӳ�һ��
                        
                    } else {
                        this.overLabel.string = 'YOU LOST';
                        this.scheduleOnce(function () { this.overSprite.node.x = 0; this.current = cc.audioEngine.play(this.audio[2], false, 1); }, 0.5);//�ӳ�һ��
                    }
                    this.gameState = 'over';
                    return;
                }
            } else {
                fiveCount = 0;
            }
        }
        //�ж�����
        fiveCount = 0;
        for (var y = 0; y < 15; y++) {
            if ((this.chessList[y * 15 + x0].getComponent(cc.Sprite)).spriteFrame === this.touchChess.getComponent(cc.Sprite).spriteFrame) {
                fiveCount++;
                if (fiveCount == 5) {
                    if (this.gameState === 'black') {
                        this.overLabel.string = 'YOU WIN';
                        this.scheduleOnce(function () { this.overSprite.node.x = 0; this.current = cc.audioEngine.play(this.audio[1], false, 2); }, 0.5);//�ӳ�һ��
                    } else {
                        this.overLabel.string = 'YOU LOST';
                        this.scheduleOnce(function () { this.overSprite.node.x = 0; this.current = cc.audioEngine.play(this.audio[2], false, 1); }, 0.5);//�ӳ�һ��
                    }
                    this.gameState = 'over';
                    return;
                }
            } else {
                fiveCount = 0;
            }
        }
        //�ж�����б��
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
                        this.scheduleOnce(function () { this.overSprite.node.x = 0; this.current = cc.audioEngine.play(this.audio[1], false, 2); }, 0.5);//�ӳ�һ��
                    } else {
                        this.overLabel.string = 'YOU LOST';
                        this.scheduleOnce(function () { this.overSprite.node.x = 0; this.current = cc.audioEngine.play(this.audio[2], false, 1); }, 0.5);//�ӳ�һ��
                    }
                    this.gameState = 'over';
                    return;
                }
            } else {
                fiveCount = 0;
            }
        }
        //�ж�����б��
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
                        this.scheduleOnce(function () { this.overSprite.node.x = 0; this.current = cc.audioEngine.play(this.audio[1], false, 2); }, 0.5);//�ӳ�һ��
                    } else {
                        this.overLabel.string = 'YOU LOST';
                        this.scheduleOnce(function () { this.overSprite.node.x = 0; this.current = cc.audioEngine.play(this.audio[2], false, 1);}, 0.5);//�ӳ�һ��
                    }
                    this.gameState = 'over';
                    return;
                }
            } else {
                fiveCount = 0;
            }
        }
        //û����Ӯ��������˳��
        if (this.gameState === 'black') {
            this.gameState = 'white';
        } else if(this.gameState === 'white'){
            this.gameState = 'black';
        }
    }

});
