cc.Class({
    extends: cc.Component,

    //�����
    properties: {

        audio: { //��Ч���
            default: null,
            type: cc.AudioClip,
        },

    },

    onLoad: function () {
        this.current = cc.audioEngine.play(this.audio, true, 1);  //ѭ��������Ч������Ϊ1
    },

    //��������
    AistartGame: function () {

        //�л�������Game����
        cc.director.loadScene("Game");
    },

    PlayerstartGame: function () {

        //�л�������Player����
        cc.director.loadScene("Player");
    }
});