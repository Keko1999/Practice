cc.Class({
    extends: cc.Component,

    //空组件
    properties: {

        audio: { //音效组件
            default: null,
            type: cc.AudioClip,
        },

    },

    onLoad: function () {
        this.current = cc.audioEngine.play(this.audio, true, 1);  //循环播放音效，音量为1
    },

    //方法声明
    AistartGame: function () {

        //切换场景至Game场景
        cc.director.loadScene("Game");
    },

    PlayerstartGame: function () {

        //切换场景至Player场景
        cc.director.loadScene("Player");
    }
});