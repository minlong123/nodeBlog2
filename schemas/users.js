var mongoose=require('mongoose');

// 用户表结构，传入表的字段配置
module.exports=new mongoose.Schema({
	username:String,
	password:String
})