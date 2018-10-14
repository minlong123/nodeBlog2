var mongoose=require('mongoose');
var usersSchema=require('../schemas/users');

// 创建一个模型，将表名、表的字段配置传进模块的model方法内。
module.exports=mongoose.model('Users',usersSchema);