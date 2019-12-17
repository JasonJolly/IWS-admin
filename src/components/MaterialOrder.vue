<template slot-scope='scope'>
  <div>
    <div class="top-box">
      <el-input class="top-search" prefix-icon="el-icon-search" v-model="search" size="mini" clearable placeholder="输入关键字搜索"
        @focus="changePagesize" />
      <!-- <el-button type="danger" size="mini" @click="addRoleInfo">新增</el-button> -->
      <div>
        <el-button size="mini" type="primary" icon="el-icon-edit-outline" @click="handleEdit()">待送明细</el-button>
        <el-button size="mini" icon="el-icon-upload2" type="primary" @click="exportExcel ">导出表格</el-button>
        <el-button size="mini" icon="el-icon-refresh-left" @click="formReload">刷新</el-button>
      </div>
    </div>
    <el-table :data="tables.slice((currentPage-1)*PageSize,currentPage*PageSize)" style="width: 100%" stripe align="center"
      v-loading="loading" ref="multipleTable" tooltip-effect="dark" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="100" align="center"></el-table-column>
      <el-table-column label="订单号" prop="Code" align="center"></el-table-column>
      <el-table-column label="合同号" prop="styleName" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="供应商" prop="styleCode" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="物料名称" prop="customer" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="合同数量" prop="pdmNum" align="center"></el-table-column>
      <el-table-column label="单位" prop="SampleStyle" align="center"></el-table-column>
      <el-table-column label="交期" prop="colthType" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="已交" prop="phaseType" align="center"></el-table-column>
      <el-table-column label="待送" prop="applyDepart" align="center"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" icon="el-icon-remove-outline" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <!-- <el-button size="mini" type="danger" @click="handleImg(scope.$index, scope.row)">图片</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <div class="tabListPage">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
        :page-sizes="pageSizes" :page-size="PageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </div>

    <el-dialog title="待送物料信息" :visible.sync="dialogFormVisible" width="55%" :before-close="handleEditClose">
      <el-form :model="form" ref="form" status-icon :rules="rules" label-width="130px">
        <div class="rowLine">
          <el-col :span="11">
            <el-form-item label="本次送货数量(米)" prop="shsl">
              <div class="rowLine">
                <el-input v-model.number="form.shsl" placeholder="请输入" clearable></el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="送货单元数">
              <div class="rowLine">
                <el-input v-model="form.shdys" placeholder="请输入"></el-input>
                <el-select v-model="form.shdy" placeholder="单位" style="width:210px">
                  <el-option label="箱" value="箱"></el-option>
                  <el-option label="件" value="件"></el-option>
                </el-select>
              </div>
            </el-form-item>
          </el-col>
        </div>
        <div class="rowLine">
          <el-col :span="11">
            <el-form-item label="预估体积(m³)">
              <div class="rowLine">
                <el-input v-model="form.ygtj" placeholder="请输入"></el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="预估重量(KG)">
              <div class="rowLine">
                <el-input v-model="form.ygzl" placeholder="请输入"></el-input>
              </div>
            </el-form-item>
          </el-col>
        </div>
        <div class="rowLine">
          <el-col :span="11">
            <el-form-item label="送货日期">
              <el-date-picker type="date" placeholder="选择送货日期" v-model="form.shrq" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="时段">
              <el-select v-model="form.sd" placeholder="请选择时段" style="width: 100%;">
                <el-option label="上午(9-12)" value="上午"></el-option>
                <el-option label="下午(1-6)" value="下午"></el-option>
                <el-option label="晚上(7-9)" value="晚上"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </div>
        <div class="rowLine">
          <el-col :span="11">
            <el-form-item label="仓库">
              <el-select v-model="form.ck" placeholder="请选择仓库" style="width: 100%;">
                <el-option label="1" value="1"></el-option>
                <el-option label="2" value="2"></el-option>
                <el-option label="3" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item>
              <el-button type="primary" @click="onSubmit('form')">立即预约</el-button>
              <el-button @click="handleEditClose()">取消</el-button>
            </el-form-item>
          </el-col>
        </div>

        <el-table :data="contractDatas" style="width: 100%" stripe align="center" v-loading="loading">
          <!-- <el-table-column label="订单号" prop="Code" align="center"></el-table-column> -->
          <el-table-column label="合同号" prop="contractNum" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="本次送货数量(米)" prop="shsl" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="送货数" prop="shdys" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="预估体积(m³)" prop="ygtj" align="center"></el-table-column>
          <el-table-column label="预估重量(KG)" prop="ygzl" align="center"></el-table-column>
          <el-table-column label="送货日期" prop="shrq" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="送货时段" prop="sd" align="center"></el-table-column>
          <el-table-column label="仓库" prop="ck" align="center"></el-table-column>
        </el-table>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  name: 'MaterialOrder',
  data () {
    var checkShsl = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('年龄不能为空'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value < 18) {
            callback(new Error('必须年满18岁'))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    return {
      form: {
        shsl: '', // 送货数量
        shdys: '', // 送货单元数
        shdy: '', // 送货单元
        ygtj: '', // 预估体积
        ygzl: '', // 预估重量
        shrq: '', // 送货日期
        sd: '', // 时段
        ck: '' // 仓库
      },
      rules: { // 检验字段
        shsl: [{
          validator: checkShsl,
          trigger: 'blur'
        }]
      },
      multipleSelection: [],
      contractDatas: [],
      // contractCount: -1,
      formCount: -1,
      // 总数据
      tableData: [],
      tableDataOut: [],
      gridTable: [],
      // 默认显示第几页
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 1,
      // 个数选择器（可修改）
      pageSizes: [12, 20, 30, 50, 100],
      // 默认每页显示的条数（可修改）
      PageSize: 12,
      search: '', // 搜索内容
      dialogFormVisible: false, // 弹窗表单是否显示
      addFormShow: 'none',
      editFormShow: 'none',
      loading: true,
      imgLoading: true,
      tableLoading: true,
      openFullScreen: false,
      drawer: false,
      styleImage: '',
      editPdmInfo: {
        'ID': '',
        'NoticeDocID': '',
        'seq': '',
        'name': '',
        'PersonPlan': '',
        'Person': '',
        'PlanTimer': '',
        'Timer': '',
        'nowRisk': '',
        'remark': '',
        'oldRisk': '',
        'Flag': ''
      }
    }
  },
  created: function () {
    this.getPdmInfo()
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
    // 多选
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    // 打开编辑进度
    handleEdit () {
      if (this.multipleSelection.length > 0) {
        var newSelection = this.multipleSelection
        this.dialogFormVisible = true
        for (var i = 0; i < newSelection.length; i++) {
          var newData = {
            contractNum: newSelection[i].Code,
            shsl: '', // 送货数量
            shdys: '', // 送货单元数
            shdy: '', // 送货单元
            ygtj: '', // 预估体积
            ygzl: '', // 预估重量
            shrq: '', // 送货日期
            sd: '', // 时段
            ck: '' // 仓库
          }
          this.contractDatas.push(newData)
        }
        console.log('xxx:' + JSON.stringify(this.contractDatas))
      } else {
        this.$message.error('还未勾选合同单！')
      }
    },
    onSubmit (form) {
      this.$refs[form].validate((valid) => {
        console.log('valid:' + valid)
        if (valid === true) {
          alert('submit!')
          var num = this.formCount + 1
          console.log('cccc:' + num)
          if (num === this.contractDatas.length) {
            this.$message({
              message: '合同单已经齐备！',
              type: 'warning'
            })
          } else {
            this.formCount++
            this.contractDatas[this.formCount].shsl = this.form.shsl
            this.contractDatas[this.formCount].shdys = this.form.shdys
            this.contractDatas[this.formCount].shdy = this.form.shdy
            this.contractDatas[this.formCount].ygtj = this.form.ygtj
            this.contractDatas[this.formCount].ygzl = this.form.ygzl
            this.contractDatas[this.formCount].shrq = this.form.shrq
            this.contractDatas[this.formCount].sd = this.form.sd
            this.contractDatas[this.formCount].ck = this.form.ck
          }
          this.form = {
            shsl: '',
            shdys: '',
            shdy: '',
            ygtj: '',
            ygzl: '',
            shrq: '',
            sd: '',
            ck: ''
          }
          console.log('submit!:' + JSON.stringify(this.contractDatas))
        } else {
          console.log('error submit!!')
          return false
        }
      })
      // console.log('dad:' + JSON.stringify(this.form))
      // console.log('dasdasd:' + this.contractDatas.length)
    },

    handleEditClose () {
      this.formCount = -1
      this.contractDatas = []
      this.dialogFormVisible = false
    },

    // 刷新表格
    formReload: function () {
      var that = this
      that.loading = true
      setTimeout(function () {
        that.getPdmInfo()
      }, 1000)
    },

    // 导出表格
    exportExcel () {
      const loading = this.$loading({
        lock: true,
        text: '生成文件中！',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.4)'
      })
      setTimeout(() => {
        loading.close()
      }, 2500)
      this.getPdmInfoOut()
    },
    // 获取进度列表
    getPdmInfo: function () {
      // console.log('重新加载了')
      var that = this
      that.$axios.get('/PDM/BLL/GetPdmProgress', { // 这里将axios.get 改为this.$axios.get
        params: {}
      }).then(resp => {
        // console.log(JSON.stringify(resp))
        that.tableData = resp.data
        // 将数据的长度赋值给totalCount
        this.totalCount = resp.data.length
        for (let i in that.tableData) {
          if (JSON.stringify(that.tableData[i].schedule).indexOf('面料') != -1) {
            that.tableData[i].MlRole = true
          }
          if (JSON.stringify(that.tableData[i].schedule).indexOf('辅料') != -1) {
            that.tableData[i].FlRole = true
          }
          if (JSON.stringify(that.tableData[i].schedule).indexOf('排产') != -1) {
            that.tableData[i].SechuleRole = true
          }
          if (JSON.stringify(that.tableData[i].schedule).indexOf('开板') != -1) {
            that.tableData[i].KbRole = true
          }
          if (JSON.stringify(that.tableData[i].schedule).indexOf('裁剪') != -1) {
            that.tableData[i].CjRole = true
          }
          if (JSON.stringify(that.tableData[i].schedule).indexOf('缝制') != -1) {
            that.tableData[i].FzRole = true
          }
          if (JSON.stringify(that.tableData[i].schedule).indexOf('评审') != -1) {
            that.tableData[i].PsRole = true
          }
        }
        this.loading = false
      }).catch(err => {
        console.log(err)
      })
    },

    getPdmInfoOut: function () {
      var that = this
      that.$axios.get('/PDM/BLL/GetPdmProgress', { // 这里将axios.get 改为this.$axios.get
        params: {}
      }).then(resp => {
        that.tableDataOut = resp.data
        // 将数据的长度赋值给totalCount
        for (let i in that.tableDataOut) {
          if (JSON.stringify(that.tableDataOut[i].schedule).indexOf('面料') != -1) {
            that.tableDataOut[i].MlRole = true
          }
          if (JSON.stringify(that.tableDataOut[i].schedule).indexOf('辅料') != -1) {
            that.tableDataOut[i].FlRole = true
          }
          if (JSON.stringify(that.tableDataOut[i].schedule).indexOf('排产') != -1) {
            that.tableDataOut[i].SechuleRole = true
          }
          if (JSON.stringify(that.tableDataOut[i].schedule).indexOf('开板') != -1) {
            that.tableDataOut[i].KbRole = true
          }
          if (JSON.stringify(that.tableDataOut[i].schedule).indexOf('裁剪') != -1) {
            that.tableDataOut[i].CjRole = true
          }
          if (JSON.stringify(that.tableDataOut[i].schedule).indexOf('缝制') != -1) {
            that.tableDataOut[i].FzRole = true
          }
          if (JSON.stringify(that.tableDataOut[i].schedule).indexOf('评审') != -1) {
            that.tableDataOut[i].PsRole = true
          }
        }
        that.fullscreenLoading = true
        setTimeout(function () {
          that.fullscreenLoading = false
          /* generate workbook object from table */
          let wb = XLSX.utils.table_to_book(document.querySelector('#PdmTable'))
          /* get binary string as output */
          let wbout = XLSX.write(wb, {
            bookType: 'xlsx',
            bookSST: true,
            type: 'array'
          })
          try {
            FileSaver.saveAs(new Blob([wbout], {
              type: 'application/octet-stream'
            }), '进度统计表.xlsx')
          } catch (e) {
            if (typeof console !== 'undefined') {
              console.log(e, wbout)
            }
          }
          return wbout
        }, 2500)
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

    // 关闭表单时
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.reset()
          done()
        })
        .catch(_ => {})
    },

    // 删除角色
    handleDelete (index, row) {
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('/PDM/BLL/GetPdmDeleteByID?id=' + row.ID, {
          params: {
            id: row.ID
          }
        }).then(resp => {
          this.getPdmInfo()
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
  .el-table {
    font-size: 12px;
  }

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

  .tabListPage {
    margin: 40px 0;
    text-align: center;
  }

  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 200px;
  }

  .rowLine {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .rowLine span {
    margin-left: 10px;
  }

  .el-form .line {
    text-align: center;
  }
</style>
