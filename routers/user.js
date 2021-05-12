const express=require('express');
const pool=require('../pool.js');
let router=express.Router();
//注册接口
router.post('/register',(req,res)=>{
    let obj=req.body;
    console.log(obj);
    if(!obj.uname){
        res.send({code:401,msg:'uname required'})
        return
    }
    if(!obj.upwd){
        res.send({code:402,msg:'upwd required'})
        return
    }
    if(!obj.email){
        res.send({code:403,msg:'email required'})
        return
    }
    if(!obj.phone){
        res.send({code:404,msg:'phone required'})
        return
    }
    pool.query('INSERT INTO xz_user SET ?',[obj],(err,result)=>{
        if(err) throw err;
        console.log(result);
        if(result.affectedRows>0){
            res.send({code:200,msg:'register suc'});
        }

    })
    // res.send('注册成功');
});
//登录接口
router.post('/login',(req,res)=>{
    let obj=req.body;
    console.log(obj);
    if(!obj.uname){
        res.send({code:401,msg:'uname required'});
        return
    }
    if(!obj.upwd){
        res.send({code:402,msg:'upwd required'});
        return
    }
    pool.query('SELECT * FROM xz_user WHERE uname=? AND upwd=?',[obj.uname,obj.upwd],(err,result)=>{
        if(err)throw err;
        console.log(result);
        if(result.length>0){
            res.send({code:200,msg:'login success'});
        }else{
            res.send({code:301,msg:'login  error'});
        }
    })
});
//检索用户
router.get('/detail',(req,res)=>{
    let obj=req.query;
    if(!obj.uid){
        res.send({code:401,msg:'uid required'});
        return;
    }
    pool.query('SELECT * FROM xz_user WHERE uid=?',[obj.uid],(err,result)=>{
        if(err) throw err;
        // console.log(result);
        if(result.length>0){
            res.send({
            code:200,
            msg:'ok',
            data:result[0]
        });
        }else{
            res.send({code:301,msg:'none exists'});
        }
    })
});
//修改用户
router.post('/update',(req,res)=>{
    let obj=req.body;
    // console.log(obj);
    let i=400
    for(let key in obj){
        i++
        // console.log(key);
        if(!obj[key]){
            res.send({code:i,msg:key+' required'});
            return;
        }
    }
    pool.query('UPDATE xz_user SET ? WHERE uid=?',[obj,obj.uid],(err,result)=>{
            if(err)throw err;
            console.log(result);
            if(result.affectedRows>0){
                res.send({code:200,msg:'update suc'});
            }else{
                res.send({code:301,msg:'update err'});
            }
        })
    
});
//用户列表
router.get('/list',(req,res)=>{
    let obj=req.query;
    if(!obj.pno){
        obj.pno=1;
    }
    if(!obj.count){
        obj.count=2;
    }
    obj.count=parseInt(obj.count);
    let start=(obj.pno-1)*obj.count;
    pool.query('SELECT * FROM xz_user LIMIT ?,?',[start,obj.count],(err,result)=>{
        if(err)throw err;
        // console.log(result);
        res.send({
            code:200,
            msg:'ok',
            data:result
        })
    })
    
});
//删除用户
router.get('/delete',(req,res)=>{
    let obj=req.query;
    // console.log(obj);
    if(!obj.uid){
        res.send({code:401,msg:'uid required'});
        return;
    }
    pool.query('DELETE FROM xz_user WHERE uid=?',[obj.uid],(err,result)=>{
        if(err)throw err;
        // console.log(result);
        if(result.affectedRows>0){
            res.send({code:200,msg:'delete suc'})
        }else{
            res.send({code:301,msg:'delete error'});
        }
    })
});
module.exports=router;