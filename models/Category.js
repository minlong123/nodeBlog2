var mongoose=require('mongoose');
var categorySchema=require('../schemas/category');

// 创建一个模型
module.exports=mongoose.model('Category',categorySchema);