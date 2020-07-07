var mvs = require("Mvs");
var glb = require("Glb");

cc.Class({
    extends: cc.Component,

    properties: {

        overSprite: { //����Ļ��
            default: null,
            type: cc.Sprite,
        },

        overLabel: { //������
            default: null,
            type: cc.Label,
        },

        chessPrefab: {//���ӵ�Ԥ����Դ
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

        chessList: {//���ӽڵ�ļ��ϣ���һά�����ʾ��άλ��
            default: [],
            type: [cc.node],
        },

        whiteSpriteFrame: {//�����ͼƬ
            default: null,
            type: cc.SpriteFrame,
        },

        blackSpriteFrame: {//�����ͼƬ
            default: null,
            type: cc.SpriteFrame,
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

        gameState: 'black',  //��һ�������µ�����

        fiveGroup: [],//��Ԫ��

        fiveGroupScore: []//��Ԫ�����

    },

    onLoad: function () {

        //�ý�������λ����Ļ��
        this.overSprite.node.x = 10000;

        mvs.response.sendEventResponse = this.sendEventResponse.bind(this);
        mvs.response.sendEventNotify = this.sendEventNotify.bind(this);
        mvs.response.logoutResponse = this.logoutResponse.bind(this);
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

        this.setListener();//���Ӽ���
        this.gameagin.node.on('click', this.gagin, this); //����һ��
        this.gomenu.node.on('click', this.gmenu, this); //�ص��˵�
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

    setListener: function () {

        //var Record = 0; //��¼�µ�ǰλ��
        //var RecordAi = 0;
        this.node.on(cc.Node.EventType.TOUCH_START, function (eventTouch) {

            var pos = new cc.Vec2(eventTouch.getLocationX(), eventTouch.getLocationY());  // ���ݵ��������λ�ã�ת���������е�λ��
            pos = this.node.convertToNodeSpaceAR(pos);  //ת��ΪUI����ϵ
            if (pos.x < 0 || pos.x >= 600 || pos.y < 0 || pos.y >= 600) {   //������λ��λ�ڵ�ͼ֮������Ч

                return false;
            }
            var x = Math.floor(pos.x / 40) + 1;  //����С�ڵ���x���������
            var y = Math.floor(pos.y / 40) + 1;
            var k = x + y * 15 - 16;
            //Record = k;
            glb.position = k;  //����ǰ����λ�ü�¼����
            var event = {
                action: glb.GAME_MOVE_EVENT,
                position: glb.position
            }

            var result = mvs.engine.sendEvent(JSON.stringify(event));
            //���͵��¼�Ҫ�����������յ��첽�ص�ʱ�����ж����Ǹ��¼����ͳɹ�
            glb.events[result.sequence] = event;



        }, this)
    },

    //�����¼��ص�
    sendEventResponse(info) {
        //����У��
        var event = glb.events[info.sequence];
        if (event && event.action === glb.GAME_MOVE_EVENT) {
            delete glb.events[info.sequence]

            if (this.gameState == 'white' && this.chessList[event.position].getComponent(cc.Sprite).spriteFrame == null) {
                this.chessList[event.position].getComponent(cc.Sprite).spriteFrame = this.whiteSpriteFrame;//���Ӻ��������ͼƬʹ������ʾ
                this.current = cc.audioEngine.play(this.audio[0], false, 1);
                this.touchChess = this.chessList[event.position];

                this.judgeOver(event.position);

            }
            if (this.gameState == 'black' && this.chessList[event.position].getComponent(cc.Sprite).spriteFrame == null) {
                this.chessList[event.position].getComponent(cc.Sprite).spriteFrame = this.blackSpriteFrame;//���Ӻ��������ͼƬʹ������ʾ
                this.current = cc.audioEngine.play(this.audio[0], false, 1);
                this.touchChess = this.chessList[event.position];

                this.judgeOver(event.position);

            }
                

        }

    },

    //�����˷����¼��ص�
    sendEventNotify(info) {
        if (info && info.cpProto && info.cpProto.indexOf(glb.GAME_MOVE_EVENT) >= 0) {
            var msg = JSON.parse(info.cpProto);

            if (this.gameState == 'white' && this.chessList[msg.position].getComponent(cc.Sprite).spriteFrame == null) {
                this.chessList[msg.position].getComponent(cc.Sprite).spriteFrame = this.whiteSpriteFrame;//���Ӻ��������ͼƬʹ������ʾ
                this.current = cc.audioEngine.play(this.audio[0], false, 1);
                this.touchChess = this.chessList[msg.position];

                this.judgeOver(msg.position);

            }
            if (this.gameState == 'black' && this.chessList[msg.position].getComponent(cc.Sprite).spriteFrame == null) {
                this.chessList[msg.position].getComponent(cc.Sprite).spriteFrame = this.blackSpriteFrame;//���Ӻ��������ͼƬʹ������ʾ
                this.current = cc.audioEngine.play(this.audio[0], false, 1);
                this.touchChess = this.chessList[msg.position];

                this.judgeOver(msg.position);

            }
        }


    },

    judgeOver: function (achpos) {  //��Ӯ�ж�
        var ache = achpos;
        var x0 = ache % 15;  //��ȡ����  ����������ͬ��X
        var y0 = parseInt(ache / 15); //����һ���ַ�����������һ����������ȡ����������������ͬ��Y
        //�жϺ���
        var fiveCount = 0;
        for (var x = 0; x < 15; x++) {
            if ((this.chessList[y0 * 15 + x].getComponent(cc.Sprite)).spriteFrame === this.touchChess.getComponent(cc.Sprite).spriteFrame) {
                fiveCount++;
                if (fiveCount == 5) {
                    
                        this.overLabel.string = '��Ϸ����';
                        this.scheduleOnce(function () { this.overSprite.node.x = 0;  }, 0.5);//�ӳ�һ��

                    
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
                    
                    this.overLabel.string = '��Ϸ����';
                        this.scheduleOnce(function () { this.overSprite.node.x = 0;  }, 0.5);//�ӳ�һ��
                    
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
                    
                    this.overLabel.string = '��Ϸ����';
                        this.scheduleOnce(function () { this.overSprite.node.x = 0; }, 0.5);//�ӳ�һ��
                    
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
                    
                    this.overLabel.string = '��Ϸ����';
                        this.scheduleOnce(function () { this.overSprite.node.x = 0;}, 0.5);//�ӳ�һ��
                    
                    this.gameState = 'over';
                    return;
                }
            } else {
                fiveCount = 0;
            }
        }

        if (this.gameState == 'black') { //��������˳��
            this.gameState = 'white'
        } else if (this.gameState == 'white') {
            this.gameState = 'black'
        } 

                
    },

    gain: function () {

        cc.director.loadScene("Player");
        var results = mvs.engine.logout(""); //�˳���¼
        var result = mvs.engine.uninit();
        if (result == 0) {
            console.log('����ʼ���ɹ���');
        } else {
            console.log('����ʼ��ʧ�ܣ�');
        }
    },

    gmenu: function () {

        cc.director.loadScene("Menu");
        var results = mvs.engine.logout(""); //�˳���¼
        var result = mvs.engine.uninit();
        if (result == 0) {
            console.log('����ʼ���ɹ���');
        } else {
            console.log('����ʼ��ʧ�ܣ�');
        }
    },

    //�˳���¼
    logoutResponse(status) {
        if (status == 200) {
            console.log('logoutResponse��ע���ɹ�');
        } else if (status == 500) {
            console.log('logoutResponse��ע��ʧ�ܣ�����������');
        }

    },

    
})