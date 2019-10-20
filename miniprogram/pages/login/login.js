/* eslint-disable no-undef */
import {
	DBUser
} from "../../db/DBUser.js";

const app = getApp();
const dbuser = new DBUser();
let timer;

Page({

	data: {
		logged: false,
		hasUserInfo: false,
		loading: false,
		canIUse: wx.canIUse("button.open-type.getUserInfo"),
	},

	onLoad: function () {
		timer = setTimeout(() => {
			if (app.globalData.logged) {
				this.setData({
					logged: true,
					hasUserInfo: true
				});
			}
		}, 1000);
	},

	getUserInfo: function (e) {
		this.setData({
			loading: true
		});
		app.globalData.username = e.detail.userInfo.nickName;
		app.globalData.avatar = e.detail.userInfo.avatarUrl;
		dbuser.addUser().then(() => {
			app.globalData.logged = true;
			this.setData({
				logged: true,
				hasUserInfo: true,
				loading: false
			});
		});
	},

	onHide:function(){
		clearTimeout(timer);
	}
});