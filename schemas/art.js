var mongoose=require('mongoose');

// 用户表结构
module.exports=new mongoose.Schema({

	//关联字段-文章分类的id
	// 设置的是在art表中的字段
	name:{
		// 对象类型
		type:mongoose.Schema.Types.ObjectId,
		// 这里填引用的模型的文件名
		ref:'Category'
	},
	// 设置的是在art表中的字段，发表文章的用户是谁
	userr:{
		// 对象类型
		type:mongoose.Schema.Types.ObjectId,
		// 这里填引用的模型的文件名
		ref:'Users'
	},

	// 发表时间,这个时间需要加8个小时
	addTime:{
		type:Date,
		default:new Date()
	},

	// 阅读量
	// 关于这个阅读量，通过前台用户访问这篇文章的次数++,然后保存到数据库
	views:{
		type:Number,
		default:0
	},
	title:String,
	desc:{
		type:String,
		default: ''
	},
	cont:{
		type:String,
		default: ''
	}
})