<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 + 添加 -->
    <el-row class="seartBox">
      <el-col>
        <!-- 搜索框 -->
        <el-input
        @click="getAllUsers()"
        clearable
         class="searchInput" placeholder="请输入内容" v-model="query">
          <el-button slot="append" icon="el-icon-search"
          @click="searchUsers()"
          ></el-button>
        </el-input>
        <!-- 添加按钮 -->
        <el-button type="success">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table 
    height="350px"
    :data="list" style="width: 100%">
      <el-table-column prop="id" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="140"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="140"></el-table-column>

      <!-- 下面这个单元格不是prop的值creat_time的值日期
            1. 给单元格内层外侧加template
            2.给template设置slot-scope
            3.slot-scope的值会自动绑定外层数据结构,这里是el-table的data的值list 
            4.在内容位置写list。row 自动取出list每个对象，其中row是固定写法 
      -->
      <el-table-column label="创建日期" width="140">
        <template slot-scope="list">{{list.row.create_time | fmtdate}}</template>
      </el-table-column>

      <el-table-column label="用户状态" width="140">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
          <el-button type="success" icon="el-icon-check" circle size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
    class="page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      pagenum: 1,
      pagesize: 2,
      total:-1
      // 表格数据

    //   list:[]
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
      //搜索-清空时所有用户
      getAllUsers(){
          this.getTableData();
      },
      //搜索用户
      searchUsers(){
          this.pagenum=1;
          //按照query 关键字
          //query="admin"
          this.getTableData();
      },
      //分页相关方法
      handleSizeChange(val) {
      console.log(`每页 ${val} 条`);

      // 按照新pagesize发送请求
      this.pagenum = 1;

      this.pagesize = val;
      this.getTableData();
    },
    // 当前2页 -> 点击3 ->触发下面的方法 ->val = 3
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      // 按照新页码发送请求
      this.pagenum = val;
      // this.pagemnum = 1 this.pagesize=2 发送请求
      // this.pagenum=3 this.pagesize=2 发送请求
      this.getTableData();
    },
    //获取表格数据
    async getTableData() {
      // 除了登录请求.其他所有请求都需要授权->
      // 在发送请求之前,先设置请求头{Authorization:token值}
      // 设置请求头headers -> 发送请求用的是axios->找axiosAPI有没有可以设置请求头->看文档
      // {
      //   ContentType:text/html,
      //   Authorization:?
      // }

      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;

      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      //   console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
          this.total = data.total;
        this.list = data.users;
        console.log(this.list);
      }
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.seartBox {
  margin-top: 20px;
}
.searchInput {
  width: 350px;
}
.page{
    margin-top: 20px;
}
</style>
