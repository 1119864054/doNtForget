/* eslint-disable no-undef */
// miniprogram/pages/items/items.js
import {
	Cache
} from "../../db/Cache.js";
import {
	DBItem
} from "../../db/DBItem.js";

const dbitem = new DBItem();
const cache = new Cache();
var myData = [];
Page({

	data: {
		processing: [],
		completed: [],
		value: "",
		InputBottom: 0
	},
	onLoad: function (option) {
		let tag = option.tag;
		let notFin = cache.getCache("processing");
		let fin = cache.getCache("completed");
		this.setData({
			completed: fin,
			processing: notFin,
			tag: tag
		});
		this.refresh();
	},
	openFinDialog: function (e) {
		let id = e.currentTarget.dataset.itemId;
		console.log("fin", id);
		wx.showModal({
			title: "WARN",
			content: "确定完成了吗？",
			showCancel: true,
			cancelText: "取消",
			cancelColor: "#000000",
			confirmText: "确定",
			confirmColor: "#3CC51F",
			success: (result) => {
				if (result.confirm) {
					dbitem.updateItem(id, true).then(() => {
						wx.showToast({
							title: "你做到了！！！",
							icon: "none",
						});
						this.refresh();
					});
				}
			}
		});
	},
	openDelDialog: function (e) {
		let id = e.currentTarget.dataset.itemId;
		console.log("del", id);
		wx.showModal({
			title: "WARN",
			content: "确定要删除该项目？",
			showCancel: true,
			cancelText: "取消",
			cancelColor: "#000000",
			confirmText: "确定",
			confirmColor: "#3CC51F",
			success: (result) => {
				if (result.confirm) {
					dbitem.delItem(id).then(() => {
						this.refresh();
						wx.showToast({
							title: "删除成功",
							icon: "none",
						});
					});
				}
			}
		});
	},
	openCancelDialog: function (e) {
		let id = e.currentTarget.dataset.itemId;
		console.log("del", id);
		wx.showModal({
			title: "WARN",
			content: "确定撤销已完成的项目？",
			showCancel: true,
			cancelText: "取消",
			cancelColor: "#000000",
			confirmText: "确定",
			confirmColor: "#3CC51F",
			success: (result) => {
				if (result.confirm) {
					dbitem.updateItem(id, false).then(() => {
						this.refresh();
						wx.showToast({
							title: "撤销成功",
							icon: "none",
						});
					});
				}
			}
		});
	},
	getContent: function (e) {
		myData.content = e.detail.value;
		console.log("[item] [myData]", myData);
	},
	clear: function () {
		this.setData({
			value: ""
		});
	},
	submit() {
		let content = myData.content;
		if (!content) {
			wx.showToast({
				title: "还没有填东西哦",
				icon: "none",
			});
		} else {
			dbitem.addItem(myData.content).then(() => {
				this.refresh();
				this.clear();
				wx.showToast({
					title: "添加成功",
					icon: "none",
				});
			});
		}
	},
	refresh() {
		dbitem.getItem(false).then(notFin => {
			dbitem.getItem(true).then(fin => {
				this.setData({
					completed: fin,
					processing: notFin
				});
				cache.setCache("completed", fin);
				cache.setCache("processing", notFin);
				wx.stopPullDownRefresh();
			});
		});
	},
	InputFocus(e) {
		this.setData({
			InputBottom: e.detail.height
		});
	},
	InputBlur() {
		this.setData({
			InputBottom: 0
		});
	}
});