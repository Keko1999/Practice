cc.Class({
    extends: cc.Component,

    //�������
    properties: {

        overSprite: {
            default: null,
            type:cc.Sprite,
        },

        overLabel: {
            default: null,
            type:cc.Label,
        },

    },


    //���¿�ʼ
    startGame() {
        //�л�������Game
        cc.director.loadScene("Game");
    },

    //���ز˵�
    toMenu() {
        //�л�������Menu
        cc.director.loadScene("Menu");
    },

})