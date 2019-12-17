<template slot-scope='scope'>
  <div>
    <div class="top-box">
      <el-input class="top-search" prefix-icon="el-icon-search" v-model="search" size="mini" clearable placeholder="输入关键字搜索"
        @focus="changePagesize" />
      <!-- <el-button type="warning" size="mini" icon="el-icon-circle-plus-outline" @click="addRoleInfo">新增</el-button> -->
      <el-button size="mini" icon="el-icon-refresh-left" @click="formReload">刷新</el-button>
    </div>
    <el-table :data="tables.slice((currentPage-1)*PageSize,currentPage*PageSize)" style="width: 100%" stripe align="center">
      <!-- <el-table :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase())).slice((currentPage-1)*PageSize,currentPage*PageSize)"
      style="width: 100%" stripe align="center" v-loading="loading"> -->
      <!-- <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope"> <span>{{scope.$index + 1}} </span> </template>
      </el-table-column> -->
      <el-table-column label="序号" prop="" align="center" type="index" width="100px"></el-table-column>
      <el-table-column label="姓名" prop="name" align="center"></el-table-column>
      <el-table-column label="工号" prop="jobnumber" align="center"></el-table-column>
      <el-table-column label="角色" prop="RoleIName" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="电话" prop="phone1" align="center"></el-table-column>
      <el-table-column label="公司" prop="company" align="center" width="200px"></el-table-column>
      <el-table-column label="允许登录" prop="enable" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.enable" :active-value="true" :inactive-value="false" active-color="#13ce66"
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

    <div class="tabListPage">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
        :page-sizes="pageSizes" :page-size="PageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>

    <el-dialog title="用户管理" :visible.sync="dialogFormVisible" width="35%" :before-close="handleClose">
      <el-form :model="userForm" status-icon ref="userForm" label-width="7vw" class="demo-userForm">
        <div class="role-box">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="userForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="工号" prop="jobnumber">
            <el-input v-model="userForm.jobnumber" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="RoleIName">
            <el-select v-model="RoleIName" placeholder="请选择" @change="changeOption">
              <el-option v-for="item in roleList" :key="item.value" :label="item.label" :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电话" prop="phone1">
            <el-input v-model="userForm.phone1" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="公司" prop="company">
            <el-select v-model="userForm.company" placeholder="所属公司">
              <el-option label="武汉凯晨国际贸易有限公司" value="武汉凯晨国际贸易有限公司"></el-option>
              <el-option label="武汉长锐服装有限公司" value="武汉长锐服装有限公司"></el-option>
              <el-option label="武汉凯骏集团" value="武汉凯骏集团"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否允许登录" prop="enable">
            <el-switch v-model="userForm.enable" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button> -->
        <!-- <el-button @click="resetForm('userForm')">重置</el-button> -->
        <el-button type="primary" :style="{ display: editFormShow }" @click="submitFormEdit('userForm')">修改</el-button>
        <el-button type="primary" :style="{ display: addFormShow }" @click="submitFormAdd('userForm')">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'UserSystem',
  data () {
    return {
      tableData: [], // 表数据
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
      userForm: { // 编辑表单的数据
        'ID': '',
        'jobnumber': '',
        'name': '',
        'wxid': '',
        'appid': '',
        'dingdingid': '',
        'phone1': '',
        'phone2': '',
        'company': '',
        'pdm_authority': '',
        'factory_authority': '',
        'purchase_authority': '',
        'mes_authority': '',
        'wms_authority': '',
        'enable': '',
        'des1': '',
        'des2': '',
        'des3': '',
        'des4': ''
      },
      formLabelWidth: '120px',
      addFormShow: 'none',
      editFormShow: 'none',
      optionValue: '',
      value1: '',
      value2: '',
      roleList: [],
      loading: true,
      RoleIName: ''
    }
  },
  created: function () {
    this.getUserInfo()
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
        that.getUserInfo()
      }, 1000)
    },
    // 获取角色列表
    getUserInfo: function () {
      // console.log('重新加载了')
      this.$axios.get('/PDM/app/GetAppUserInfo', { // 这里将axios.get 改为this.$axios.get
        params: {}
      }).then(resp => {
        // console.log(JSON.stringify(resp))
        this.tableData = resp.data
        // 将数据的长度赋值给totalCount
        this.totalCount = resp.data.length
        for (let i in this.tableData) {
          if (this.tableData[i].enable == 1) {
            this.tableData[i].enable = true
          } else {
            this.tableData[i].enable = false
          }
        }
        this.loading = false
        // console.log('sss:' + JSON.stringify(this.tableData))
      }).catch(err => {
        console.log(err)
      })
    },

    // 打开编辑角色表单
    handleEdit (index, row) {
      // console.log('第' + index + '条' + JSON.stringify(row))
      const loading = this.$loading({
        lock: true,
        text: '加载中。',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.4)'
      })
      setTimeout(() => {
        loading.close()
      }, 500)
      var that = this
      this.addFormShow = 'none'
      this.editFormShow = ''
      this.userForm.ID = row.ID
      this.userForm.wxid = row.wxid
      this.userForm.name = row.name
      this.userForm.jobnumber = row.jobnumber
      this.userForm.company = row.company
      this.userForm.phone1 = row.phone1
      this.userForm.enable = row.enable
      this.userForm.RoleIName = row.RoleIName
      this.RoleIName = row.RoleIName
      this.userForm.pdm_authority = row.pdm_authority
      this.$axios.get('/PDM/app/GetRoleInfo', { // 这里将axios.get 改为this.$axios.get
        params: {}
      }).then(resp => {
        // console.log(resp)
        var tableData = resp.data
        for (let i in resp.data) {
          this.roleList[i] = {
            label: tableData[i].RoleIName,
            value: tableData[i].ID
          }
        }
        // console.log('sss:' + JSON.stringify(this.roleList))
      }).catch(err => {
        console.log(err)
      })
      setTimeout(function () {
        that.dialogFormVisible = true
      }, 500)
    },

    // 修改角色下拉框的值
    changeOption (roleName) {
      let obj = {}
      // console.log('sssaaa:' + JSON.stringify(this.roleList))
      obj = this.roleList.find((item) => { // 这里的roleList就是上面遍历的数据源
        return item.label === roleName // 筛选出匹配数据
      })
      // console.log(obj)
      this.userForm.pdm_authority = obj.value
      this.RoleIName = roleName
      this.userForm.RoleIName = roleName
      // console.log('RoleIName:' + this.userForm.RoleIName)
      // console.log('this.userForm.pdm_authority:' + this.userForm.pdm_authority)
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

    changePagesize () {
      this.currentPage = 1
    },

    // 打开新增角色表单
    addRoleInfo () {
      this.dialogFormVisible = true
      this.addFormShow = ''
      this.editFormShow = 'none'
      this.reset()
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
          // console.log('新的数据：' + JSON.stringify(this.userForm))
          this.$axios.post('/PDM/app/AddRoleInfo', this.userForm).then(resp => {
            // console.log(resp)
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

    // 修改用户信息
    submitFormEdit (formName) {
      if (this.userForm.enable) {
        this.userForm.enable = '1'
      } else {
        this.userForm.enable = '0'
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log('新的数据：' + JSON.stringify(this.userForm))
          this.$axios.post('/PDM/app/EditAppUser', this.userForm)
            .then(resp => {
              // console.log(JSON.stringify(resp))
              this.getUserInfo()
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
        this.$axios.post('/PDM/app/DeleteAppUser?id=' + row.ID, {
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
    // resetForm (formName) {
    //   this.reset()
    // },
    // 清空表单
    reset () {
      this.userForm.name = ''
      this.userForm.jobnumber = ''
      this.userForm.company = ''
      this.userForm.phone1 = ''
      this.userForm.pdm_authority = ''
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

  .demo-userForm .el-input,
  .demo-userForm .el-select {
    width: 20vw;
  }

  .tabListPage {
    margin: 40px 0;
    text-align: center;
  }
</style>
