<template>
  <el-card class="box">
    <cus-bread level1="权限管理" level2="角色列表"></cus-bread>
    <el-button class="btn" type="primary">添加角色</el-button>

    <!-- 表格 -->
    <el-table height="350px" :data="roles" style="width: 100%">
      <el-table-column type="expand" width="80">
        <template slot-scope="scope">
          <!-- 行列布局 -->
          <el-row class="level1" v-for="(item1) in scope.row.children" :key="item1.id">
            <el-col :span="4">
              <el-tag
                @close="deleRights(scope.row,item1)"
                closable
                type="success"
              >{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row class="level2" v-for="(item2) in item1.children" :key="item2.id">
                <el-col :span="4">
                  <el-tag
                    @close="deleRights(scope.row,item2)"
                    closable
                    type="warning"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    @close="deleRights(scope.row,item3)"
                    closable
                    type="info"
                    v-for="(item3) in item2.children"
                    :key="item3.id"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <el-row v-if="scope.row.children.length===0">
            <el-col>
              <span>"未分配权限"</span>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="180"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="300"></el-table-column>

      <el-table-column prop="mobile" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>

          <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
          <el-button
            @click="showDiaSetRights(scope.row)"
            type="success"
            icon="el-icon-check"
            circle
            size="mini"
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 对话框 -->
    <el-dialog title="分配权限" :visible.sync="dialogFormVisible">
      <!--
        data数据源
        node-key每个节点唯一标识
        default-expanded-keys[] 默认展开
      default-checked-keys [] 默认选中
      props配置选项{label/children}
      -->
      <el-tree
        ref="treeDom"
        :data="treelist"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="arrCheck"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roles: [],
      dialogFormVisible: false,
      //树形结构相关数据
      treelist: [],
      arrCheck: [],
      // arrExpand: [],
      defaultProps: {
        label: "authName",
        children: "children"
      },
      currRoleId: -1
    };
  },
  created() {
    this.getRoles();
  },
  methods: {
    //分配权限 - 发送请求
    async setRights() {
      //获取全选节点的id
      const arr1 = this.$refs.treeDom.getCheckedKeys();
      // console.log(arr1);
      //获取半选节点的id
      const arr2 = this.$refs.treeDom.getHalfCheckedKeys();
      // console.log(arr2);
      //ES6 展开操作运算符
      const arr = [...arr1,...arr2];

      //roleID角色id
      const res = await this.$http.post(`roles/${this.currRoleId}/rights`,{
        //数组方法 分割数组
        rids:arr.join(",")

      });
      console.log(res);
       const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
         this.dialogFormVisible = false;
         this.getRoles();
      }
    },
    //分配权限 -打开对话框
    async showDiaSetRights(role) {
      this.currRoleId = role.id;
      // 获取数据
      const res = await this.$http.get(`rights/tree`);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.treelist = data;
        // console.log(this.treelist);

        // 获取当前角色的权限id<-角色
        // console.log(role);
        const temp2 = [];
        role.children.forEach(item1 => {
          // temp2.push(item1.id);// 最外层id->temp->arrCheck
          item1.children.forEach(item2 => {
            // temp2.push(item2.id);
            item2.children.forEach(item3 => {
              temp2.push(item3.id);
            });
          });
        });
        // console.log(temp2);
        this.arrCheck = temp2;
      }
      this.dialogFormVisible = true;
    },
    // 取消权限
    async deleRights(role, rights) {
      // console.log(role, rights);
      // roleId->角色id
      // rightId->权限id
      const res = await this.$http.delete(
        `roles/${role.id}/rights/${rights.id}`
      );
      // console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        // 提示
        this.$message.success(msg);
        // 更新
        // this.getRoles();
        // 会返回当前角色的剩余权限
        // 只更新当前的角色权限
        role.children = data;
      }
    },
    // 获取所有权限
    async getRoles() {
      const res = await this.$http.get(`roles`);
      // console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.roles = data;
      }
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.btn {
  margin-top: 20px;
}
.level1,
.level2 {
  margin-bottom: 10px;
}
</style>
