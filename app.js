const express=require('express');
const bodyparser=require('body-parser');
const userRouter=require('./routers/user.js');
const productRouter=require('./routers/product.js');
let app=express();
app.listen(8080);
//托管静态资源到public
app.use(express.static('public'));
// app.use(express.static(__dirname + "/public"));
//使用body-parser中间件
app.use(bodyparser.urlencoded({
    extended:false   //使用querystring
}));
//路由挂载到服务器下
app.use('/user',userRouter);
app.use('/product',productRouter);
