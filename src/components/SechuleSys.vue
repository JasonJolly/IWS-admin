<template slot-scope='scope'>
  <div>
    <div class="top-box">
      <el-input class="top-search" prefix-icon="el-icon-search" v-model="search" size="mini" placeholder="输入编号或名称搜索" />
      <el-button type="danger" size="mini" @click="addRoleInfo">新增</el-button>
    </div>
    <el-table :data="tableData.filter(data => !search || data.Code.toLowerCase().includes(search.toLowerCase()) || data.styleCode.toLowerCase().includes(search.toLowerCase())).slice((currentPage-1)*PageSize,currentPage*PageSize)"
      style="width: 100%" stripe align="center">
      <el-table-column label="序号" type="index" align="center"></el-table-column>
      <el-table-column label="样衣图片" prop="Code" align="center" min-width="50px"></el-table-column>
      <el-table-column label="通知单号" prop="Code" align="center" min-width="50px"></el-table-column>
      <el-table-column label="款式号" prop="styleCode" align="center"></el-table-column>
      <el-table-column label="客户" prop="customer" min-width="50px" width="150px" align="center"></el-table-column>
      业务员 建单时间 需求时间 延迟时间
      <el-table-column label="数量" prop="pdmNum" min-width="50px" width="100px" align="center"></el-table-column>
      <el-table-column label="样品类型" prop="SampleStyle" min-width="50px" width="100px" align="center"></el-table-column>
      <el-table-column label="样衣类型" prop="colthType" min-width="50px" width="100px" align="center"></el-table-column>
      <el-table-column label="阶段" prop="phaseType" min-width="50px" width="100px" align="center"></el-table-column>
      <el-table-column label="申请部门" prop="applyDepart" min-width="50px" width="100px" align="center"></el-table-column>
      <el-table-column label="申请人" prop="applyPerson" min-width="50px" width="100px" align="center"></el-table-column>
      <el-table-column label="申请时间" prop="applyTimer" min-width="50px" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="需求时间" prop="requireDate" min-width="50px" align="center"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="tabListPage">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
        :page-sizes="pageSizes" :page-size="PageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>
    <el-dialog title="角色管理" :visible.sync="dialogFormVisible" width="32%" :before-close="handleClose">
      <el-form :model="roleForm" status-icon :rules="rules" ref="roleForm" label-width="7vw" class="demo-roleForm">
        <el-form-item label="角色编号" prop="RoleID">
          <el-input v-model="roleForm.RoleID" ref="RoleID" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="RoleIName">
          <el-input v-model="roleForm.RoleIName" ref="RoleIName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="进度查询权限" prop="PlanRole">
          <el-select v-model="roleForm.PlanRole" placeholder="进度查询权限">
            <el-option label="全部" value="1"></el-option>
            <el-option label="部门" value="2"></el-option>
            <el-option label="个人" value="3"></el-option>
          </el-select>
        </el-form-item>
        <div class="role-box">
          <el-form-item label="排产权限" prop="SechuleRole">
            <el-switch v-model="roleForm.SechuleRole" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-form-item>
          <el-form-item label="面料权限" prop="MlRole">
            <el-switch v-model="roleForm.MlRole" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-form-item>
          <el-form-item label="辅料全线" prop="FlRole">
            <el-switch v-model="roleForm.FlRole" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-form-item>
          <el-form-item label="开板权限" prop="KbRole">
            <el-switch v-model="roleForm.KbRole" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-form-item>
          <el-form-item label="裁剪权限" prop="CjRole">
            <el-switch v-model="roleForm.CjRole" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-form-item>
          <el-form-item label="缝制权限" prop="FzRole">
            <el-switch v-model="roleForm.FzRole" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-form-item>
          <el-form-item label="评审" prop="PsRole">
            <el-switch v-model="roleForm.PsRole" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button> -->
        <el-button @click="resetForm('roleForm')">重置</el-button>
        <el-button type="primary" :style="{ display: editFormShow }" @click="submitFormEdit('roleForm')">修改</el-button>
        <el-button type="primary" :style="{ display: addFormShow }" @click="submitFormAdd('roleForm')">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'SechuleSys',
  data () {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('名称不能为空'))
      } else {
        callback()
      }
    }
    return {
      // 总数据
      tableData: [],
      // 默认显示第几页
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 1,
      // 个数选择器（可修改）
      pageSizes: [10, 20, 30, 50, 100],
      // 默认每页显示的条数（可修改）
      PageSize: 10,
      search: '', // 搜索内容
      dialogFormVisible: false, // 弹窗表单是否显示
      roleForm: { // 编辑表单的数据
        'ID': '',
        'RoleID': '',
        'RoleIName': '',
        'PlanRole': '',
        'ScanSechuleRole': '',
        'SechuleRole': true,
        'MlRole': true,
        'FlRole': true,
        'KbRole': true,
        'CjRole': true,
        'FzRole': true,
        'PsRole': true
      },
      formLabelWidth: '120px',
      rules: { // 检验字段
        name: [{
          validator: checkName,
          trigger: 'blur'
        }]
      },
      addFormShow: 'none',
      editFormShow: 'none'
    }
  },
  created: function () {
    this.getRoleInfo()
  },
  methods: {
    // 获取进度列表
    getRoleInfo: function () {
      // console.log('重新加载了')
      var that = this
      that.$axios.get('http://47.244.50.46:13147/PDM/BLL/GetProductNotonline', { // 这里将axios.get 改为this.$axios.get
        params: {}
      }).then(resp => {
        console.log(JSON.stringify(resp))
        that.tableData = resp.data
        // 将数据的长度赋值给totalCount
        this.totalCount = resp.data.length
      }).catch(err => {
        console.log(err)
      })
    },

    handleSizeChange (val) {
      // 改变每页显示的条数
      this.PageSize = val
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.currentPage = 1
    },
    // 显示第几页
    handleCurrentChange (val) {
      // 改变默认的页数
      this.currentPage = val
    },

    // 打开新增角色表单
    addRoleInfo () {
      this.dialogFormVisible = true
      this.addFormShow = ''
      this.editFormShow = 'none'
      this.reset()
    },

    // 打开编辑角色表单
    handleEdit (index, row) {
      // console.log('第' + index + '条' + JSON.stringify(row))
      this.dialogFormVisible = true
      this.addFormShow = 'none'
      this.editFormShow = ''
      this.roleForm.ID = row.ID
      this.roleForm.RoleIName = row.RoleIName
      this.roleForm.RoleID = row.RoleID
      this.roleForm.PlanRole = JSON.stringify(row.PlanRole)
      this.roleForm.MlRole = row.MlRole
      this.roleForm.FlRole = row.FlRole
      this.roleForm.KbRole = row.KbRole
      this.roleForm.CjRole = row.CjRole
      this.roleForm.FzRole = row.FzRole
      this.roleForm.PsRole = row.PsRole
      this.roleForm.SechuleRole = row.SechuleRole
    },

    // 关闭表单时
    handleClose (done) {
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     this.reset()
      //     done()
      //   })
      //   .catch(_ => {})
    },

    // 添加角色
    submitFormAdd (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log('submit!!')
          // console.log('新的数据：' + JSON.stringify(this.roleForm))
          this.$axios.post('http://47.244.50.46:13147/PDM/app/AddRoleInfo', this.roleForm).then(resp => {
            console.log(resp)
            this.getRoleInfo()
            this.$message({
              type: 'success',
              message: '添加成功!'
            })
          }).catch(err => {
            console.log(err)
          })
          this.dialogFormVisible = false
        } else {
          console.log('添加失败!!')
          return false
        }
      })
    },

    // 修改角色信息
    submitFormEdit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log('新的数据：' + JSON.stringify(this.roleForm))
          this.$axios.put('http://47.244.50.46:13147/PDM/app/EditRoleInfo?id=' + this.roleForm.ID, this.roleForm)
            .then(resp => {
              console.log(resp)
              this.getRoleInfo()
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
            }).catch(err => {
              console.log(err)
            })
          this.dialogFormVisible = false
        } else {
          console.log('修改失败!!')
          return false
        }
      })
    },

    // 删除角色
    handleDelete (index, row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('http://47.244.50.46:13147/PDM/app/DeleteRoleInfo?id=' + row.ID, {
          params: {
            id: row.ID
          }
        }).then(resp => {
          this.getRoleInfo()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    msgAlert (msg) {
      this.$notify({
        title: '成功',
        message: msg,
        type: 'success'
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 清空表单
    reset () {
      this.roleForm.RoleIName = ''
      this.roleForm.RoleID = ''
      this.roleForm.PlanRole = ''
    }
  }
  // open () {
  //   this.$alert('<strong>这是 <i>HTML</i> 片段</strong>', 'HTML 片段', {
  //     dangerouslyUseHTMLString: true
  //   })
  // }
}
</script>

<style scoped>
  .top-box {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 20px;
    margin-bottom: 10px;
  }

  .role-box {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .top-search {
    width: 200px;
    display: ;
  }

  .demo-roleForm .el-input,
  .demo-roleForm .el-select {
    width: 20vw;
  }

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 10vw;
  }

  .tabListPage{
    margin: 20px 0;
    text-align: center;
  }
</style>
