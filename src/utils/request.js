/*
 * @Author: 张育豪 
 * @Date: 2019-09-04 17:23:52 
 * @Last Modified by: 张育豪
 * @Last Modified time: 2019-09-04 20:15:36
 */

 import axios from "axios";
 import router from "@/router/index";

 var instance=axios.create();//创建axios的实例
// 全局拦截

//添加请求拦截器
 instance.interceptors.request.use(function(config){
     //是不是登录和注册接口 /api/login 返回值为Boolean
    let notToKeUrl=['/api/login','/api/registry'];
    //在发送请求之前做些什么
    return notToKeUrl.includes(config.url)?config:{
        ...config,
        headers:{
            ...config.headers,
            token:window.localStorage.getItem("token")//登录成功 token 存储的到locaStorage
        }
    };
 },function(error){
     //对请求错误做些什么
     return Promise.reject(error);
 })

 //添加响应拦截器
 instance.interceptors.response.use(function(response){
     return response
 },function(error){
     let {status} = error.response;

     if(status<500){
         switch(status){
             case 422:
                 alert("参数有误");
                 break;
             case 401:
                 alert("没有权限");
                 router.push("/login")
                 break;
             default:break;
         }
     }else{
         alert("服务器端错误")
     }
    //对响应错误做些什么
    return Promise.reject(error);
 });

 export default{
     post(url,data){
         return instance.post(url,data)
     },
     get(url,data){
         return instance.get(url,{params:data})
     }
 }
 