/*
 * @Author: 张育豪 
 * @Date: 2019-09-04 17:22:06 
 * @Last Modified by:   张育豪 
 * @Last Modified time: 2019-09-04 17:22:06 
 */
module.exports={
    devServer:{
        proxy:{
            "/api":{
                target:"http://localhost:3000"
            }
        }
    }
}