/* eslint-disable no-undef */
import {
	Util
} from "../util/util.js";

const db = wx.cloud.database();
const app = getApp();

var util = new Util();

class DBItem {
	constructor() {

	}

	//添加项目
	addItem(content) {
		return new Promise((resolve, reject) => {
			db.collection("item").add({
				data: {
					content: content,
					date: util.formatTime(new Date()),
					finished: false,
					timeStamp: new Date().getTime(),
				}
			}).then(res => {
				console.log("[DBItem] [添加项目] 成功: ", res);
				resolve(res);
			}).catch(err => {
				console.error("[DBItem] [添加项目] 失败: ", err);
				reject();
			});
		});
	}

	//查询项目
	getItem(finished) {
		let openid = app.globalData.openid;
		return new Promise((resolve, reject) => {
			db.collection("item").where({
				_openid: openid,
				finished: finished
			}).orderBy("date", "desc").get()
				.then(res => {
					console.log("[DBItem] [查询项目] 成功: ", res.data);
					resolve(res.data);
				}).catch(err => {
					console.error("[DBItem] [查询项目] 失败: ", err);
					reject();
				});
		});
	}

	//更新项目
	updateItem(id, finished) {
		return new Promise((resolve, reject) => {
			db.collection("item").doc(id).update({
				data: {
					finished: finished
				}
			}).then(res => {
				console.log("[DBItem] [更新项目] 成功: ", res);
				resolve();
			}).catch(err => {
				console.error("[DBItem] [更新项目] 失败: ", err);
				reject();
			});
		});
	}

	//删除项目
	delItem(id) {
		return new Promise((resolve, reject) => {
			db.collection("item").doc(id).remove().then(res => {
				console.log("[DBItem] [删除项目] 成功: ", res);
				resolve();
			}).catch(err => {
				console.error("[DBItem] [删除项目] 失败: ", err);
				reject();
			});
		});
	}
}

export {
	DBItem
};