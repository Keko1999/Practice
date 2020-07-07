cc.Class({
    extends: cc.Component,

    //创建组件
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


    //重新开始
    startGame() {
        //切换场景至Game
        cc.director.loadScene("Game");
    },

    //返回菜单
    toMenu() {
        //切换场景至Menu
        cc.director.loadScene("Menu");
    },

})