var express=require('express');
var router=express.Router();
var User=require('../models/Users');

// 统一返回格式
var responseData;
router.use(function(req,res,next){
	responseData={
		code:0,
		message:''
	}
	next();
});

// 用户注册逻辑
// 一、用户名不能为空
// 二、密码不能为空
// 三、两次输入密码必须一致

// 涉及到数据库
// 四、该用户名是否已注册

router.post('/user/register',function(req,res,next){
	var username=req.body.user;
	var pwd=req.body.pwd;
	var repwd=req.body.repwd;

	if(username==''){
		responseData.code=1;
		responseData.message="用户名不能为空";
		res.json(responseData);
		return;
	}
	if(pwd==''){
		responseData.code=2;
		responseData.message="密码不能为空";
		res.json(responseData);
		return;
	}
	if(pwd!=repwd){
		responseData.code=3;
		responseData.message="两次输入的密码必须一致";
		res.json(responseData);
		return;
	}


	// 用户名是否已经注册了，如果数据库已经存在该用户名，表示该用户名已经注册了。
	User.findOne({
		username:username
	}).then(function(userInfo){
		if(userInfo){
			// 显示数据库有该记录
			responseData.code=4;
			responseData.message="该用户名已经被注册了";
			res.json(responseData);
			return;
		}
		// 保存用户注册的信息到数据库中
		var user=new User({
			username:username,
			password:pwd,
		});
		return user.save();
		// 保存成功后会继续走下一步
		// console.log(userInfo);如果不存在为null
	}).then(function(newUserInfo){
		console.log(newUserInfo);
		responseData.code=5;
		responseData.message="注册成功";
		res.json(responseData);
	});
})
router.post('/user/login',function(req,res,next){
	var username=req.body.user;
	var password=req.body.pwd;
	if(username=="" || password==""){
		responseData.code=1;
		responseData.message="用户名或密码不能为空";
		res.json(responseData);
		return;
	}
	// 查询数据库中相同用户名和密码的记录是否存在，如果存在，则登录。如果不存在则返回错误信息
	User.findOne({
		username:username,
		password:password
	}).then(function(userInfo){
		if(!userInfo){
			responseData.code=2;
			responseData.message="用户名和密码错误";
			res.json(responseData);
			return;
		}
		req.cookies.set('userInfo',JSON.stringify({
			_id:userInfo._id,
			username:userInfo.username
		}));
		responseData.code=3;
		responseData.message="登录成功";
		res.json(responseData);
		return;
	})

})


router.get('/user/logout',function(req,res,next){
	req.cookies.set('userInfo',null);
	res.render('admin/login');
});


module.exports=router;