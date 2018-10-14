// 应用程序的启动入口
var express=require('express');



// 加载模版
var swig=require('swig');

// 加载数据库模块
var mongoose=require('mongoose');

// 加载body-parse模块，用于解析post过来的数据
var bodyParser=require('body-parser');

// 加载cookies
var Cookies=require('cookies');

// 创建app应用，等同于nodeJS的http.createServer();
var app=express();

// 设置cookies
app.use(function(req,res,next){
	req.cookies=new Cookies(req,res);
	req.userInfo={};
	if(req.cookies.get('userInfo')){
		try{
			req.userInfo=JSON.parse(req.cookies.get('userInfo'));
		}catch(e){
			next();
		}
	}
	next();
});

// 设置静态文件托管
// 当用户访问的url以/public开始，那么直接返回对应的__dirname+'/public'下的文件
app.use('/public',express.static(__dirname+'/public'));
// 配置应用模版
// 定义当前应用所使用的模版引擎
// 第一个参数：模版引擎的名称，同时也是模版文件的后缀，第二个参数表示用于解析处理模版内容的方法
app.engine('html',swig.renderFile);

// 设置模版文件存放的目录，第一个参数必须是views,第二个参数是目录
app.set('views','./views');

// 注册所使用的模版引擎，第一个参数必须是view engine,第二个参数和app.engine这个方法中定义的模版引擎的名称(第一个参数)是一致的
app.set('view engine','html');

// 在开发过程中，需要取消模版缓存，不然的话改变了html代码后，需要不断编译，然后才能在监听端口上看到修改后的模版信息
// 因为模版每次加载后，就被保存在内存中，被缓存，下次打开的时候实际上打开的是内存中缓存的页面。而不是修改后的页面，只能重新编译之后才能看到修改好的页面
// 为了解决这个开发当中的调试问题，需要设置下，上线之后，可以再取消它
swig.setDefaults({cache:false});

// bodyparser设置，会自动给req对象添加一个body的属性，用于存放解析后的数据
app.use(bodyParser.urlencoded({extended:true}) );

app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));



// 监听http请求
mongoose.connect('mongodb://localhost:27018/blog',{useNewUrlParser:true},function(err){
	if(err){
		console.log("数据库连接失败");
	}else{
		console.log("数据库连接成功");
		app.listen(8081);
	}
});

