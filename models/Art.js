var mongoose=require('mongoose');
var artSchema=require('../schemas/art');

// 创建一个模型
module.exports=mongoose.model('Art',artSchema);