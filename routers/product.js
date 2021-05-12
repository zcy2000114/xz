const express=require('express')
const pool=require('../pool.js')
let router=express.Router();

router.get("/list",(req,res)=>{
	// 如果前端携带页码数和每页数据量，就使用前端传过来的值
	var pno = Number(req.query.pno);
	var count = Number(req.query.count);
	// 分页查询需要提供页码数和每页的数据量,前端未提供时，后端使用默认值
	if(!pno) pno = 1;
	if(!count) count = 10;
	// 分页查询limit m,n 从m+1条数据开始显示其后的n条数据
	var m = (pno-1) * count;
	pool.query("select * from xz_laptop limit ?,?",[m,count],(err,result)=>{
		if(err){
			res.send({
				code:500,
				msg:"服务器正忙"
			})
		}else{
			var total;
			// query方法是异步操作，注意代码的书写位置，如果需要使用回调函数中的结果，请把代码写在回调函数中
			pool.query("select * from xz_laptop",(err,dataArr)=>{
				total = dataArr.length;
				console.log(total);
				res.send({
					recordCount: total, 
				    pageSize: Math.ceil(total/count), 
				    pageCount: count, 
				    pno: pno,
				    data: result
				});
			});
			
		}
	})
});
router.get("/detail",(req,res)=>{
	if(!req.query.lid){
		res.send({
			code:401,
			msg:"lid不能为空"
		});
	}else{
		pool.query("select * from xz_laptop where lid=?",req.query.lid,(err,result)=>{
			if(err){
				res.send({
					code:500,
					msg:"服务器故障"
				})
			}else{
				// result : [{}]
				if(result.length){
					// xz_laptop.family_id 对应 xz_laptop_family.fid
					// 根据结果中的family_id获取家族信息
					var familyId = result[0].family_id;
					var fname;
					var laptopList;
					var picList;
					pool.query("select fname from  xz_laptop_family where fid = ?",familyId,(err,familyData)=>{
						if(familyData.length){
							fname=familyData[0].fname;
							pool.query("select * from xz_laptop where family_id = ? ",familyId,(err,laptopData)=>{
								if(laptopData.length) laptopList = laptopData
								pool.query("select * from xz_laptop_pic where laptop_id = ?",req.query.lid,(err,picData)=>{
									if(picData.length) picList = picData;
									res.send({
										details:result[0],
										picList:picList,
										family:{
											fid:familyId,
											fname:fname,
											laptopList:laptopList
										}
									})
								})	
							});

						}
					})
					
				}else{
					res.send({
						code:401,
						msg:"商品不存在"
					})
				}
			}
		})
	}
})

module.exports=router;