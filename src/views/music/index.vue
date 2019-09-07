<template>
  <el-container class="m-wrap">
    <el-header class="m-tex">
      <div>
        欢迎<span class="m-span">{{username}}</span>登录 
        <el-button type="primary" @click="quit">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>
        <el-button @click="open(undefined)" class="m-btn">添加</el-button>
        <!-- 表单开始 -->
        <el-table
         :data="musicList"
          style="width: 100%">
          <el-table-column
            label="序号"
            type="index">
          </el-table-column>
          <el-table-column
            label="歌名"
            prop="music_name">
          </el-table-column>
          <el-table-column
            label="图片">
            <template slot-scope="test">
              <img :src="test.row.pic" alt="" class="m-img">
            </template>
          </el-table-column>
          <el-table-column
            label="歌手"
            prop="singer_name">
          </el-table-column>
          <el-table-column
            label="是否上架">
            <template slot-scope="scope">
              <span>{{scope.row.isup?"是":"否"}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="open(scope.row.id)">修改</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="deleter(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 表单结束 -->

        <!-- 分页开始 -->

        <el-pagination
          background
          :hide-on-single-page="value"
          layout="prev, pager, next"
          :page-size="limit"
          @current-change="currentchange"
          :total="total">
        </el-pagination>
        <!-- 分页结束 -->

        <!-- 弹窗开始 -->
        <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="close">
          <!-- 添加音乐表单开始 -->
          <el-form ref="form" :model="form" label-width="80px" :rules="rules">
              <el-form-item label="歌名" prop="music_name">
                <el-input v-model="form.music_name"></el-input>
              </el-form-item>
              <el-form-item label="歌手" prop="singer_name">
                <el-input v-model="form.singer_name"></el-input>
              </el-form-item>
              <el-form-item label="上传图片">
                <input type="file" @change="upload">
                <img :src="form.pic" alt="" class="m-img">
              </el-form-item>
              <el-form-item label="是否上架">
                <el-radio-group v-model="form.isup">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          <!-- 添加音乐表单结束 -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="change">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 弹窗结束 -->
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { get } from 'http';
export default {
  data () {
    return {
      username:"",
      pagenum:1,
      limit:2,
      musicList:[],
      total:0,
      dialogVisible:false,
      isId:"",
      form:{
        music_name:"",
        singer_name:"",
        pic:"",
        isup:1
      },
      rules: {
           music_name: [
            { required:true, trigger: 'blur',message:"请输入歌名" }
          ],
          singer_name: [
            { required:true, trigger: 'blur',message:"请输入歌手" }
          ],
          pic:[
            { required:true, trigger: 'blur',message:"请上传图片" }
          ],
        },
        value:false
    }
  },
  created(){
    let token=localStorage.getItem("token")
    this.$api.user.getInfo(token).then(res=>{
      if(res.data.code===2){
        this.tokenExpired();
      }
      if(res.data.code===1){
        this.username=res.data.data.username
      }
    })
    this.getMusic();
  },
  methods:{
    //退出登录
    quit(){
      this.$confirm("确认退出吗","提示",{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        localStorage.removeItem("token");
        this.$router.replace("/login")
      })
    },
    //获取音乐列表
    getMusic(){
      this.$api.music.querymusic({pagenum:this.pagenum,limit:this.limit}).then(res=>{
      if(res.data.code===1){
        this.musicList=res.data.data;
        this.total=res.data.total;
      }
    })
    },
    //显示添加弹框
    open(id) {
      if(id){
        this.isId=id;
        let music=this.musicList.find(item=> item.id===id)
        this.form.music_name=music.music_name;
        this.form.singer_name=music.singer_name;
        this.form.isup = music.isup;
        this.form.pic=music.pic;
      }
        this.dialogVisible=true;
      },
    //添加列表
     close(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            this.cancel()
            done();
          })
          .catch(_ => {});
      },
      //上传图片
      upload(e){
        let file=e.target.files[0];
        let formdata=new FormData();
        formdata.append("file",file)
        this.$api.music.upload(formdata).then(res=>{
          if(res.data.code===1){
            this.form.pic="http://localhost:3000"+res.data.url
          }
        })
      },
      //添加音乐取消按钮
      cancel(){
        this.dialogVisible = false
        this.form.music_name="",
        this.form.singer_name="",
        this.form.pic="",
        this.form.isup=1
      },
      //添加音乐
      addMusic(){
        this.$api.music.addmusic(this.form).then(res=>{
          if(res.data.code===1){
            this.cancel();
            this.getMusic();
          }
        })
      },
      //token过期弹出框
       tokenExpired() {
        this.$alert('登录已过期，请重新登录', '登录过期', {
          confirmButtonText: '确定',
          callback: action => {
            // this.$message({
            //   type: 'info',
            //   message: `action: ${ action }`
            // });
            localStorage.removeItem("token");
            this.$router.replace("/login")
          }
        });
      },
      //改变页数时触发
      currentchange(val){
        this.pagenum=val;
         this.getMusic()
      },
      //删除音乐列表
      deleter(id){
        console.log(id)
        this.$api.music.delete({id}).then(res=>{
          if(res.data.code===1){
            if(this.musicList.length<=1&&this.pagenum>1){
              --this.pagenum;
            }
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getMusic();
          }
        })
      },
      //确定按钮
      change(){
        if(this.isId){
          this.updata()
        }else{
          this.addMusic()
        }
      },
      //修改音乐列表
      updata(){
         this.$api.music.updata(Object.assign({},this.form,{id:this.isId})).then(res=>{
           if(res.data.code===1){
             this.getMusic();
             this.dialogVisible=false;
           }
         })
      }
  }
}
</script>

<style scoped>
.el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
  }

  .m-wrap{
    height: 100%;
    width: 100%;
  }

  .m-span{
    display: inline-block;
    min-width: 25px;
    margin: 0 5px;
    text-align: center;
    color: pink;
  }

  .m-tex{
    text-align: right;
  }

  .m-img{
    width: 80px;
    height: 80px;
  }

  .m-btn{
    float: right;
  }

  .m-inp{
    border: none;
    outline: none;
  }
</style>