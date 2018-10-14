

# nodeBlog2

**用node搭建的第二个后台，简单的用户登录、注册、分类管理、文章管理**
1. 数据库使用的是moogodb

2. node的框架使用的是express
 
3. 使用node模块：mongoose设计维护和操作mongodb数据库和数据，实现了对数据的结   构化存储和CURD（增、删、改、查）操作；

4. 使用swig实现前后端分离

5. 其他各种 express 中间件技术：
  a）static中间件实现静态资源托管；
  b）cookies中间件实现cookie的操作，完成用户登录状态、权限信息验证功能；

6. 自定义中间件实现统一数据验证和处理；

7. 功能模块分层开发；

8. ajax的api接口设计开发和应用；


>前台页面没有去弄，重点在于后台web搭建的逻辑。因为是分模块化开发。
后台和前台是一样的逻辑，后续的维护上重点在于使用node进行各种后台功能的开发。


# 安装
**首先全局下载node.js(版本：v8.11.4)，需要用到的node的模块不需要重新去安装，直接download或clone所有文件到本地为blog的文件夹内，在E盘或者D盘新建一个。将nodeBlog2里的代码全部放在blog的下一级目录下。express框架是用的是4.16.4的版本。将下载的代码存放至该文件夹下**

1. 因为使用的moogodb数据库，所有数据均在db文件夹内，需要下载moogodb数据库和该数据库的可视化工具Robo。


***下载地址：https://www.mongodb.com/download-center/v2/community***  

下载的版本：
mongodb-win32-x86_64-2008plus-ssl-3.4.17.zip  





2. 下载后之后打开命令行cmd，切换到moogodb的安装目录内。到达bin目录下。
- 通过mongod --dbpath=E:\blog\db --port=27018  命令设置数据库的数据保存和读取路径。
- E:\blog\db是你下载到本地的这个博客里的文件夹db的路径
- 建议将项目文件和moogodb都下载到一个盘内。便于操作
- 命令行最后一行出现：
waiting for connections on port 27018即设置成功





3. 下载mogodb的一个可视化工具  
 

***下载地址：https://robomongo.org/download***  

下载的版本：
robo3t-1.2.1-windows-x86_64-3e50a65
下载之后，设置该工具的监听端口：localhost:27018 name填blog并进行连接


4. 上述操作完后，命令行切换到blog的目录下编译项目：node app.js
然后在浏览器打开 ：  
前台地址：localhost:8081   
后台地址：localhost:8081/admin/login  
登帐账户密码：ming 123也可以在Robo数据库管理工具当中看到帐号和密码

<pre>
// 监听http请求
mongoose.connect('mongodb://localhost:27018/blog',{useNewUrlParser:true},function(err){
	if(err){
		console.log("数据库连接失败");
	}else{
		console.log("数据库连接成功");
		app.listen(8081);
	}
});
</pre>

命令行出现数据库连接成功，视为项目搭建成功

# 关于维护
**仅作为一个后台项目来进行不断的维护，前台的渲染和后台如出一辙，不做安排，不断添加各种模块在该项目当中，验证其可靠性，并不断的优化已有代码。使其能够胜任后续更多web项目**

