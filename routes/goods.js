var express = require('express');
var router = express.Router();
const request = require('superagent');
const cheerio = require('cheerio');
var GoodsSchema = require('../db/GoodsSchema.js')
/* GET home page. */

var returnVal = {
	status:'0',
	data:{
	}
}


function superagentMain(brand,i,callback){
	return new Promise((resolve,reject)=>{
		request.post('https://las.secoo.com/api/search/keyword')
		  .type('form')
		  .send({ c_device_id: '21daca704e280a912fb1588127963114' })
		  .send({ c_platform_type: 0 })
		  .send({ c_app_ver:'7.5.1'})
		  .send({ deviceType: 'wap'})
		  .send({ queryType:1})
		  .send({ searchMode:1})
		  .send({ currPage:i})
		  .send({ pageSize:10})
		  .send({ keyword:brand})
		  .send({ c_appsource:60})
		  .then((res)=>{
			  callback(res,resolve)
		  })
	})
}


async function sendAxios(brand,res,pagenum){
	for(let index = 1; index <= pagenum; index++){
		await superagentMain(brand,index,(data,resolve)=>{
			
			data = JSON.parse(data.text).productList;
			var newVal = {};
			GoodsSchema.insertMany(data, function(err, docs){
				if(err){
					console.log('------过滤数据重复-------')
					resolve();
				}else{
					
					if(index == pagenum){
						newVal.data = {
							message:'数据爬取结束!'
						}
						res.send(newVal)
					}
					resolve();
				}
				console.log(index+'页爬取结束')
				
			});
			 
			
		})
	}
}

function getPageNum(brand,callback){
	request.post('https://las.secoo.com/api/search/keyword')
	  .type('form')
	  .send({ c_device_id: '21daca704e280a912fb1588127963114' })
	  .send({ c_platform_type: 0 })
	  .send({ c_app_ver:'7.5.1'})
	  .send({ deviceType: 'wap'})
	  .send({ queryType:1})
	  .send({ searchMode:1})
	  .send({ currPage:1})
	  .send({ pageSize:10})
	  .send({ keyword:brand})
	  .send({ c_appsource:60})
	  .then((res)=>{
		  let pagenum = JSON.parse(res.text).maxPage;
		  console.log(brand+"品牌总共页数",pagenum)
		  callback(pagenum);
	  })
}

router.get('/siku', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	//允许的header类型
	res.header("Access-Control-Allow-Headers", "content-type");
	//跨域允许的请求方式 
	res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
	if(req.query.brand){
		getPageNum(req.query.brand,(pagenum)=>{
			// 获取最大页数
			sendAxios(req.query.brand,res,pagenum);
		})
	}else{
		res.send({message:'参数不能为空'})
	}
	
	
})

module.exports = router;





// ***

// router.get('/add', function(req, res, next) {
// 	var accounts = req.query.accounts;
// 	var password = req.query.password;
// 	var describe = req.query.describe;
// 	console.log(accounts,password,describe)
// 	let newVal = JSON.parse(JSON.stringify(returnVal))
// 	if(accounts!='' && password!='' && describe!=''){
// 		Article.create({
// 			accounts,
// 			password,
// 			describe
// 		}, function(err, docs){
// 			newVal.data = {
// 				message:' 添加成功!',
// 				data:docs
// 			}
// 			res.send(newVal);
			
// 		});
// 	}else{
// 		let newVal = JSON.parse(JSON.stringify(returnVal))
// 		newVal.data = {
// 			message:'参数为空'
// 		}
// 		res.send(newVal)
// 	}
	
	
// });

// router.get('/select',function(req, res, next){
// 	res.header("Access-Control-Allow-Origin", "*");
// 	//允许的header类型
// 	res.header("Access-Control-Allow-Headers", "content-type");
// 	//跨域允许的请求方式 
// 	res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
// 	let accounts = req.query.accounts;
// 	let newVal = JSON.parse(JSON.stringify(returnVal))
// 	if(accounts!='' && accounts!=undefined){
// 		Article.find({accounts}, function(err, articles) {
			
// 			newVal.data = {
// 				message:' 查询'+accounts+'成功',
// 				data:articles
// 			}
// 			res.send(newVal)
		  
// 		});
// 	}else{
// 		Article.find({}, function(err, articles) {
			
// 			newVal.data = {
// 				message:' 查询全部成功',
// 				data:articles
// 			}
// 			res.send(newVal)
		  
// 		});
// 	}
	
// })
// router.get('/del',function(req, res, next){
// 	Article.deleteOne({password:'a2774206'}, function(err, articles) {
// 	  res.render('content', { data: articles});
// 	});
// })

