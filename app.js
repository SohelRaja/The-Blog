//FRAMEWORK and MODULES INCLUDING
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");
//INITIALIZATIONS
var app = express();
//CONNECT TO APP AND D.B.
mongoose.connect("mongodb://localhost/restful_blog_app");
//SOME  IMPORTENT SET UP....(APP CONFIG)
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer()); //Only we need to include express-sanitizer after the body-parser. 
app.use(express.static("public"));
app.use(methodOverride("_method"));
//MONGOOSE SCHEMA SET UP....(MONGOOSE/MODEL CONFIG)
var blogSchema = mongoose.Schema({
	title: String,
	image: String,    //we can use for image as ...."{type: String, default: defaultimage.jpg}".
	body: String,
	created: {type: Date, default: Date.now,},
});
var Blog = mongoose.model("Blog",blogSchema);    //Compliling into model.
//RESTful  ROOT ROUTES
app.get("/",(req,res)=>{
	res.redirect("/blogs");
});
//INDEX ROUTE
app.get("/blogs",(req,res)=>{
	Blog.find({},(err,blogs)=>{
		if(err){
			console.log(`ERROR!!!! ${err}`);
		}else{
			res.render("index",{blogs: blogs});
		}
	});
});
//NEW ROUTE
app.get("/blogs/new",(req,res)=>{
	res.render("new");
});
//CREATE ROUTE
app.post("/blogs",(req,res)=>{
	//To sanitizing the post centent field
	req.body.blog.body = req.sanitize(req.body.blog.body);
	//create blog 
	Blog.create(req.body.blog,(err,newBlog)=>{
		if(err){
			res.render("new");
		}else{
			//then, redirect to the index
			res.redirect("/blogs");
		}
	});
	
});
//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,(err,foundBlog)=>{
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("show",{blog: foundBlog});
		}
	});
});
//EDIT ROUTE
app.get("/blogs/:id/edit",(req,res)=>{
	Blog.findById(req.params.id,(err,foundBlog)=>{
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("edit",{blog: foundBlog});
		}
	});
});
//UPDATE ROUTE
app.put("/blogs/:id",(req,res)=>{
	//To sanitizing the post centent field
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,updatedBlog)=>{
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
});
//DELETE ROUTE
app.delete("/blogs/:id",(req,res)=>{
	//Destroy post
	Blog.findByIdAndRemove(req.params.id,(err,removeBlog)=>{
		if(err){
			res.redirect("/blogs");
		}else{
			//redirect home
			res.redirect("/blogs");
		}
	});
});
//TO START EXPRESS APP
app.listen(3000,()=>{
	console.log(`RESTful Blog App server is started in port 3000`);
});

/*//This may require for testing.
Blog.create({
	title: "Test Blog",
	image: "https://farm8.staticflickr.com/7368/9811937955_03d073d6ef.jpg",
	body: "HELLO THIS IS A BLOG POST."
});*/