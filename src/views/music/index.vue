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
        <el-button @click="open" class="m-btn">添加</el-button>
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
                @click="handleEdit(scope.$index, scope.row)">修改</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 表单结束 -->

        <!-- 弹窗开始 -->
        <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="add">
          <span>这是一段信息</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 弹窗结束 -->
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      username:"",
      pagenum:1,
      limit:2,
      musicList:[],
      total:0,
      dialogVisible:false
    }
  },
  created(){
    let token=localStorage.getItem("token")
    this.$api.user.getInfo(token).then(res=>{
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
    open() {
        this.dialogVisible=true;
      },
    //添加列表
     add(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
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
</style>