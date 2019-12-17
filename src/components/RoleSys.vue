<template slot-scope='scope'>
  <div>
    <div class="top-box">
      <el-input class="top-search" prefix-icon="el-icon-search" v-model="search" size="mini" clearable placeholder="输入编号或名称搜索" />
      <div>
        <el-button type="warning" size="mini" icon="el-icon-plus" @click="addRoleInfo">新增</el-button>
        <el-button size="mini" icon="el-icon-refresh-left" @click="formReload">刷新</el-button>
      </div>
    </div>
    <el-table :data="tables" style="width: 100%" stripe align="center" v-loading="loading">
      <el-table-column label="序号" prop="RoleID" align="center" type="index" :index="indexMethod" width="100px"></el-table-column>
      <el-table-column label="角色编号" prop="RoleID" align="center" width="150px"></el-table-column>
      <el-table-column label="角色名称" prop="RoleIName" align="center" width="150px"></el-table-column>
      <!-- <el-table-column label="角色类型" prop="type" align="center"></el-table-column> -->
      <el-table-column label="进度查询权限" prop="PlanRole" align="center" width="150px">
        <template slot-scope="{row: {PlanRole}}">
          <span v-if="+PlanRole === 1">全部</span>
          <span v-else-if="+PlanRole === 2">部门</span>
          <span v-else>个人</span>
        </template>
      </el-table-column>
      <el-table-column label="排产权限" prop="SechuleRole" align="center" width="120px">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.SechuleRole" :active-value="true" :inactive-value="false" active-color="#13ce66"
            inactive-color="#ff4949" disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="面料权限" prop="MlRole" align="center" width="120px">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.MlRole" :active-value="true" :inactive-value="false" active-color="#13ce66"
            inactive-color="#ff4949" disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="辅料权限" prop="FlRole" align="center" width="120px">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.FlRole" :active-value="true" :inactive-value="false" active-color="#13ce66"
            inactive-color="#ff4949" disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="开板权限" prop="KbRole" align="center" width="120px">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.KbRole" :active-value="true" :inactive-value="false" active-color="#13ce66"
            inactive-color="#ff4949" disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="裁剪权限" prop="CjRole" align="center" width="120px">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.CjRole" :active-value="true" :inactive-value="false" active-color="#13ce66"
            inactive-color="#ff4949" disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="缝制权限" prop="FzRole" align="center" width="120px">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.FzRole" :active-value="true" :inactive-value="false" active-color="#13ce66"
            inactive-color="#ff4949" disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="评审权限" prop="PsRole" align="center" width="120px">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.PsRole" :active-value="true" :inactive-value="false" active-color="#13ce66"
            inactive-color="#ff4949" disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit-outline" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-remove-outline" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

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
  name: 'RoleSys',
  data () {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('名称不能为空'))
      } else {
        callback()
      }
    }
    return {
      tableData: [], // 表数据
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
      editFormShow: 'none',
      loading: true
    }
  },
  mounted: function () {
    this.getRoleInfo()
  },
  computed: {
    // 模糊搜索
    tables () {
      const search = this.search
      if (search) {
        // filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
        // 注意： filter() 不会对空数组进行检测。
        // 注意： filter() 不会改变原始数组。
        return this.tableData.filter(data => {
          // some() 方法用于检测数组中的元素是否满足指定条件;
          // some() 方法会依次执行数组的每个元素：
          // 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测;
          // 如果没有满足条件的元素，则返回false。
          // 注意： some() 不会对空数组进行检测。
          // 注意： some() 不会改变原始数组。
          return Object.keys(data).some(key => {
            // indexOf() 返回某个指定的字符在某个字符串中首次出现的位置，如果没有找到就返回-1；
            // 该方法对大小写敏感！所以之前需要toLowerCase()方法将所有查询到内容变为小写。
            // return String(data[key]).toLowerCase().indexOf(search) > -1
            return String(data[key]).toLowerCase().indexOf(search.toLowerCase()) > -1
          })
        })
      }
      return this.tableData
    }
  },
  methods: {
    // 刷新表格
    formReload: function () {
      var that = this
      that.loading = true
      setTimeout(function () {
        that.getRoleInfo()
      }, 1000)
    },
    // 获取角色列表
    getRoleInfo: function () {
      console.log('重新加载了')
      this.$axios.get('/PDM/app/GetRoleInfo', { // 这里将axios.get 改为this.$axios.get
        params: {}
      }).then(resp => {
        // console.log(resp)
        this.tableData = resp.data
        this.loading = false
      }).catch(err => {
        console.log(err)
      })
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
      this.$confirm('确认关闭？')
        .then(_ => {
          this.reset()
          done()
        })
        .catch(_ => {})
    },

    // 添加角色
    submitFormAdd (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log('submit!!')
          console.log('新的数据：' + JSON.stringify(this.roleForm))
          this.$axios.post('/PDM/app/AddRoleInfo', this.roleForm).then(resp => {
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
          this.$axios.post('/PDM/app/EditRoleInfo', this.roleForm)
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
        this.$axios.post('/PDM/app/DeleteRoleInfo?id=' + row.ID, {
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
    },
    indexMethod (index) {
      return index + 1
    }
    // open () {
    //   this.$alert('<strong>这是 <i>HTML</i> 片段</strong>', 'HTML 片段', {
    //     dangerouslyUseHTMLString: true
    //   })
    // }
  }
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
</style>
