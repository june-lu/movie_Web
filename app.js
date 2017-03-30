var express = require('express');
var bodyParser = require('body-parser');//bodyParser中间件用来解析http请求体
var serveStatic = require('serve-static');
var mongoose = require('mongoose');
var Movie = require('./models/movie');
var _ = require('underscore');//引入该模块主要是想使用其extend属性来实现对象的替换
var path = require('path');
var port = process.env.PORT ||  3000;
var app = express();/*启动一个web服务器*/

mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/movie_Web")

app.set('views', './views/pages');
app.set('view engine', 'jade');
app.locals.moment = require('moment');//app.locals中的属性可以在jade模板中调用
//app.use(bodyParser.json());//bodyParser.json是用来解析json数据格式的
app.use(bodyParser.urlencoded({extended:true}));//bodyParser.urlencoded()用来解析我们通常的form表单提交的数据;extended选项允许配置使用querystring(值为false)或qs(值为true)来解析数据，默认值是true
/*app.use(express.bodyParser());bodyParser 已经不再与Express捆绑，需要独立安装*/
/*app.use(express.static(path.join(__dirname,"bower_components")));//静态资源所在的文件夹, __dirname代表当前的目录*/
app.use(serveStatic('public'));
app.listen(port);

console.log('sever is start on ' + port);

//主页
app.get('/' , function(req, res){
    Movie.fetch(function(err, movies){
        if(err){
            consloe.log(err);
        }
        res.render( 'index', {
            title : 'welcome to 主页',
            movies : movies
        });
    });
});

//后台更新页
app.get('/admin/update/:id',function (req,res) {
    var id = req.params.id;
    if(id){
        Movie.findById(id,function (err, movie) {
            res.render('admin',{
                title : "后台更新页",
                movie : movie
            });
        })
    }
});


//后台录入页
app.post('/admin/movie/new',function (req,res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;
    if(id !== 'undefined'){
        Movie.findById(id,function (err, movie) {
            if(err){
                console.log(err);
            }
            _movie = _.extend(movie,movieObj);
            _movie.save(function (err, movie) {
                if(err){
                    console.log(err);
                }
                res.redirect("/movie/" + movie._id);
            })
        })
    }
    else{
        _movie = new Movie({
            title:movieObj.title,
            doctor:movieObj.doctor,
            language:movieObj.language,
            flash:movieObj.flash,
            poster:movieObj.poster,
            year:movieObj.year,
            summary:movieObj.summary,
            country:movieObj.country,
        });
        _movie.save(function (err, movie) {
            if(err){
                console.log(err);
            }
            res.redirect('/movie/'+ movie._id);
        })
    }
})

//详情页
app.get('/movie/:id' , function(req, res){//id前面的:作用是可以使用req.params.id来获取到id的值，进一步来查询
    var id = req.params.id;
    Movie.findById(id, function (err, movie) {
        if(err){
            console.log(err);
        }
        res.render('detail', {
            title: 'welcome to 详情页',
            movie: movie
        });
    });
});

//管理页
app.get('/admin/movie' , function(req, res){
    res.render( 'admin', {
        title : 'welcome to 后台录入页',
        movie:{
            title:"",
            doctor:"",
            country:"",
            poster:"",
            flash:"",
            language:"",
            year:"",
            summary:""
        }
    });
});

//列表页
app.get('/admin/list' , function(req, res){
    Movie.fetch(function(err, movies){
        if(err){
            consloe.log(err);
        }
        res.render( 'list', {
            title : 'welcome to 列表页',
            movies: movies
        });
    });

});

//删除列表
app.delete('/admin/list' , function(req, res){
    var id = req.query.id;
    if(id) {
        Movie.remove({_id: id},function (err,movie) {
            if(err){
                console.log(err);
            }
            res.json({success: 1});
        });
    }

});