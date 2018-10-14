var express=require('express');
var router=express.Router();
var User=require('../models/Users');
var Category=require('../models/Category');
var Art=require('../models/Art');

router.get('/register',function(req,res,next){
	res.render('admin/register');
});
router.get('/login',function(req,res,next){
	res.render('admin/login');
});

// 如果没有登录，一律跳转到登录页面
router.use(function(req,res,next){
	if(!req.cookies.get('userInfo')){
		res.render('admin/login');
	}else{
		next();
	}
})

// 后台主界面
router.get('/home',function(req,res,next){
	// console.log(req.cookies.get('userInfo'));
	res.render('admin/home',{
		userInfo:req.userInfo
	});

});


// 后台管理员管理界面
router.get('/adminM',function(req,res,next){
	// 从数据库读取所有管理员数据

	// 分页的实现：limit(number):限制获取的数据条数，可以理解为每页取几条
	// skip(2) :忽略数据的条数,从第几条开始取数据
	// 知道每页显示2条
	var page=Number(req.query.page || 1);
	var limit=10;//每页给2条数据
	var pages=0;
	var nums=0;
	// 读取管理员数据的总条数
	User.estimatedDocumentCount().then(function(nums){

		nums=nums;
		// 计算总页数
		pages=Math.ceil(nums / limit);
		// 设置取值范围，不能超过总页数pages
		page=Math.min(page,pages);

		// 取值不能小于1
		page=Math.max(page,1);

		// 每页从第几条数据开始显示
		var skip=(page-1)*limit;

		User.find().limit(limit).skip(skip).then(function(users){
			res.render('admin/adminM',{
				userInfo:req.userInfo,
				users:users,
				page:page,
				pages:pages,
				nums:nums,
				limit:limit
			});
		})
	})
});



// 修改管理员帐号或密码的界面
router.get('/editAdmin',function(req,res,next){
	res.render('admin/editAdmin',{
		userInfo:req.userInfo
	});
})


// 修改管理员帐号或密码的界面
router.post('/editAdmin',function(req,res,next){
	var id=req.body.id || '';
	var username=req.body.username || '';
	User.findOne({
		_id:id
	}).then(function(dat){
		// console.log(dat);
		var password=req.body.password ? req.body.password : dat.password;
		if(username==""){
			res.render('admin/err',{
				message:'用户名不能为空'
			})
			return Promise.reject();
		}
		return User.updateOne({
			_id:id
		},{
			$set:{username:username,password:password}
		});
	}).catch(function(){
		return;
	}).then(function(ddd){
		if(ddd){
			req.cookies.set('userInfo',JSON.stringify({
				_id:id,
				username:username
			}));
			res.redirect('/admin/adminM');
		}
	})
})


// 显示所有分类，以及进行分类和排序
router.get('/category',function(req,res,next){
	// 从数据库读取所有管理员数据

	// 分页的实现：limit(number):限制获取的数据条数，可以理解为每页取几条
	// skip(2) :忽略数据的条数,从第几条开始取数据
	// 知道每页显示2条
	var page=Number(req.query.page || 1);
	var limit=5;//每页给2条数据
	var pages=0;
	var nums=0;
	// 读取管理员数据的总条数
	Category.estimatedDocumentCount().then(function(nums){

		nums=nums;
		// 计算总页数
		pages=Math.ceil(nums / limit);
		// 设置取值范围，不能超过总页数pages
		page=Math.min(page,pages);

		// 取值不能小于1
		page=Math.max(page,1);

		// 每页从第几条数据开始显示
		var skip=(page-1)*limit;

		Category.find().sort({sorts: -1}).limit(limit).skip(skip).then(function(users){
			res.render('admin/category',{
				userInfo:req.userInfo,
				users:users,
				page:page,
				pages:pages,
				nums:nums,
				limit:limit
			});

		})
	})

})

// 添加分类页面
router.get('/addcategory',function(req,res,next){
	res.render("admin/addcategory",{
		userInfo:req.userInfo
	});
});

// 添加分类页面提交
router.post('/addcategory',function(req,res,next){
	var name=req.body.name || '';
	var sorts=Number(req.body.sorts) || '';
	var urls=req.body.urls || '';
	if(name==''){
		res.render('admin/err',{
			message:"分类名不能为空，请重新填入分类名"
		});
		return;
	}
	if(urls==''){
		res.render('admin/err',{
			message:"url不能为空，请重新填入url"
		});
		return;
	}
	if(sorts==''){
		res.render('admin/err',{
			message:"排序不能为空，请重新填入排序"
		});
		return;
	}
	if(typeof sorts!='number'){
		res.render('admin/err',{
			message:'排序必须是一个整数'
		})
		return;
	}

	// 上述验证通过后，接着就是验证添加的该类名在数据库表当中是否存在相同的分类名，
	// 如果存在，则返回错误信息，不存在，则保存该添加的分类信息
	Category.findOne({
		name:name
	}).then(function(rs){
		if(rs){
			res.render('admin/err',{
				message:"该分类已存在，请重新选择新的分类"
			});
			return Promise.reject();
		}else{
			return new Category({
				name:name,
				sorts:sorts,
				urls:urls
			}).save();
		}
		// 保存成功后执行的回调
	}).then(function(){
		res.redirect('/admin/category');
	})
})


// 分类修改页面
router.get('/editcategory',function(req,res,next){
	var id=req.query.id || '';
	Category.findOne({
		_id:id
	}).then(function(category){
		if(!category){
			res.render('admin/err',{
				message:'分类信息不存在'
			});
			return;
		}else{
			res.render('admin/editcategory',{
				userInfo:req.userInfo,
				category:category
			})
		}
	})
});


// 修改后提交页面
router.post('/editcategory',function(req,res,next){

	var id=req.query.id || '';

	// console.log(req.body);
	var name=req.body.name || '';
	var sorts=Number(req.body.sorts) || '';
	var urls=req.body.urls || '';
	if(name==''){
		res.render('admin/err',{
			message:"分类名不能为空，请重新填入分类名"
		});
		return;
	}
	if(urls==''){
		res.render('admin/err',{
			message:"url不能为空，请重新填入url"
		});
		return;
	}
	if(sorts==''){
		res.render('admin/err',{
			message:"排序不能为空，请重新填入排序"
		});
		return;
	}
	if(typeof sorts!='number'){
		res.render('admin/err',{
			message:'排序必须是一个整数'
		})
		return;
	}


	Category.findOne({
		_id:id
	}).then(function(categ){
		if(!categ){
			res.render('admin/err',{
				message:'分类信息不存在'
			})
			return Promise.reject();
		}else{
			// console.log(categ);
			// 当用户对内容没有进行任何修改之后
			if(name==categ.name && urls==categ.urls && sorts==categ.sorts){
				res.render('admin/err',{
					message:'请修改至少一项再提交',
				});
				return Promise.reject();
			}else{
				// 要修改的分类名称是否已经在数据库存在,排除当前修改的id
				return Category.findOne({
					_id: {$ne: id},
					name: name
				});
			}

		}
		// 用于输出处理抛出的异常
	}).catch(function(da){
		return;
	}).then(function(da){
		if(da){
			res.render('admin/err',{
				message:'已存在同名的分类，请重新修改'
			})
			return Promise.reject();
		}else{
			return Category.updateOne({
				_id:id
			},{$set:{
				name:name,
				sorts:sorts,
				urls:urls}
			});
		}
	}).catch(function(da){
		return;
	}).then(function(da){
		if(da){
			if(Number(da.nModified)>0){
				res.redirect('/admin/category');
			}else{
				return;
			}
		}else{
			return;
		}
	})
})
// 删除分类
router.get('/deletecategory',function(req,res,next){
	var id=req.query.id || '';
	Category.deleteOne({_id:id}).then(function(da){
		// 如果有删除失败的可能，需要对da做判断处理，有返回的数据
		res.redirect('/admin/category');
	});
})















// 文章管理主界面
router.get('/art',function(req,res,next){
	// 从数据库读取所有管理员数据

	// 分页的实现：limit(number):限制获取的数据条数，可以理解为每页取几条
	// skip(2) :忽略数据的条数,从第几条开始取数据
	// 知道每页显示2条
	var page=Number(req.query.page || 1);
	var limit=5;//每页给2条数据
	var pages=0;
	var nums=0;
	// 读取管理员数据的总条数
	Art.estimatedDocumentCount().then(function(nums){
		nums=nums;
		// 计算总页数
		pages=Math.ceil(nums / limit);
		// 设置取值范围，不能超过总页数pages
		page=Math.min(page,pages);

		// 取值不能小于1
		page=Math.max(page,1);

		// 每页从第几条数据开始显示
		var skip=(page-1)*limit;

		Art.find().sort({_id: -1}).limit(limit).skip(skip).populate(['name','userr']).then(function(users){
			// console.log(users);
			res.render('admin/art',{
				userInfo:req.userInfo,
				users:users,
				page:page,
				pages:pages,
				nums:nums,
				limit:limit,
			});

		})
	})
});


// 添加文章
router.get('/addart',function(req,res,next){

	// 数据库查文章分类作为文章的分类进行选择
	Category.find().then(function(data){
		res.render('admin/addart',{
			userInfo:req.userInfo,
			categoryies:data
		});
	})
});


// 添加文章
router.post('/addart',function(req,res,next){
	var name=req.body.name || '';
	var title=req.body.title || '';
	var desc=req.body.desc || '';
	var cont=req.body.cont || '';
	var userr=req.userInfo._id.toString();
	if(title==''){
		res.render('admin/err',{
			message:"文章标题不能为空，请重新填入标题"
		});
		return;
	}
	if(desc==''){
		res.render('admin/err',{
			message:"文章描述不能为空，请重新填入描述"
		});
		return;
	}
	if(cont==''){
		res.render('admin/err',{
			message:"内容不能为空，请重新填入内容"
		});
		return;
	}
	new Art({
		name:name,
		title:title,
		desc:desc,
		cont:cont,
		userr:userr
	}).save().then(function(rs){
		res.redirect('/admin/art');
	})
})




// 修改文章
router.get('/editart',function(req,res,next){
	var id=req.query.id || '';

	// 数据库查文章分类作为文章的分类进行选择
	Category.find().then(function(data){
		var data=data;
		Art.findOne({
			_id:id
		}).then(function(datas){
			res.render('admin/editart',{
				userInfo:req.userInfo,
				categoryies:data,
				arts:datas
			});
		})
	});

})


// 修改文章
router.post('/editart',function(req,res,next){

	var id=req.query.id || '';

	// console.log(req.body);
	var name=req.body.name || '';
	var title=req.body.title || '';
	var desc=req.body.desc || '';
	var cont=req.body.cont || '';
	if(title==''){
		res.render('admin/err',{
			message:"文章标题不能为空，请重新填入标题"
		});
		return;
	}
	if(desc==''){
		res.render('admin/err',{
			message:"文章描述不能为空，请重新填入描述"
		});
		return;
	}
	if(cont==''){
		res.render('admin/err',{
			message:"内容不能为空，请重新填入内容"
		});
		return;
	}


	Art.findOne({
		_id:id
	}).then(function(categ){
		if(!categ){
			res.render('admin/err',{
				message:'要修改的文章不存在'
			})
			return Promise.reject();
		}else{
			// console.log(categ);
			// 当用户对内容没有进行任何修改之后
			if(title==categ.title && desc==categ.desc && cont==categ.cont && name==categ.name.toString()){
				res.render('admin/err',{
					message:'请修改至少一项再提交',
				});
				return Promise.reject();
			}else{
				// 要修改的标题是否已经在数据库存在,排除当前修改的id
				return Art.findOne({
					_id: {$ne: id},
					title: title,
				});
			}

		}
		// 用于输出处理抛出的异常
	}).catch(function(da){
		return;
	}).then(function(da){
		if(da){
			res.render('admin/err',{
				message:'已存在同标题的文章，请重新修改一下文章的标题'
			})
			return Promise.reject();
		}else{
			return Art.updateOne({
				_id:id
			},{$set:{
				name:name,
				title:title,
				desc:desc,
				cont:cont}
			});
		}
	}).catch(function(da){
		return;
	}).then(function(da){
		// console.log(da);
		if(da){
			if(Number(da.nModified)>0){
				res.redirect('/admin/art');
			}else{
				return;
			}
		}else{
			return;
		}
	})

});





// 删除文章
router.get('/deleteart',function(req,res,next){
	var id=req.query.id || '';
	Art.deleteOne({_id:id}).then(function(da){
		// 如果有删除失败的可能，需要对da做判断处理，有返回的数据
		res.redirect('/admin/art');
	});
});


module.exports=router;