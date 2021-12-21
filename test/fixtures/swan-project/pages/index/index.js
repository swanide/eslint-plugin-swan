/**
 * @file index.js
 * @author swan
 */
const app = getApp();
Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: swan.canIUse('button.open-type.getUserInfo')
    },
    onLoad() {
        // const a = './index.json';
        // require(a);
        // 监听页面加载的生命周期函数
    },
    onShow(c) {
        let a = 1;
        let b = 2;
        a = b;
        b = a;
        // throw new Error(a);
    },
    getUserInfo(e) {

        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        });
    }
})
