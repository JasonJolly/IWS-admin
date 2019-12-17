<template slot-scope='scope'>
  <div>
    <div class="top-box">
      <el-input class="top-search" prefix-icon="el-icon-search" v-model="search" size="mini" clearable placeholder="输入关键字搜索"
        @focus="changePagesize" />
      <!-- <el-button type="danger" size="mini" @click="addRoleInfo">新增</el-button> -->
      <div>
        <el-button size="mini" icon="el-icon-upload2" type="primary" @click="exportExcel ">导出表格</el-button>
        <el-button size="mini" icon="el-icon-refresh-left" @click="formReload">刷新</el-button>
      </div>
    </div>
    <el-table :data="tables.slice((currentPage-1)*PageSize,currentPage*PageSize)" style="width: 100%" stripe align="center"
      v-loading="loading" >
      <el-table-column label="图片" type="index" align="center" width="50px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleImg(scope.$index, scope.row)" icon="el-icon-picture"
            circle></el-button>
        </template>
      </el-table-column>
      <el-table-column label="通知单号" prop="Code" align="center" width="110px"></el-table-column>
      <el-table-column label="款名" prop="styleName" align="center" width="120px" show-overflow-tooltip></el-table-column>
      <el-table-column label="款式号" prop="styleCode" align="center" width="120px" show-overflow-tooltip></el-table-column>
      <el-table-column label="客户" prop="customer" width="50px" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="数量" prop="pdmNum" width="50px" align="center"></el-table-column>
      <el-table-column label="样品类型" prop="SampleStyle" width="100px" align="center"></el-table-column>
      <el-table-column label="样衣类型" prop="colthType" width="80px" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="阶段" prop="phaseType" width="60px" align="center"></el-table-column>
      <el-table-column label="申请部门" prop="applyDepart" width="70px" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="申请人" prop="applyPerson" width="60px" align="center"></el-table-column>
      <el-table-column label="申请时间" prop="applyTimer" align="center" width="130px" show-overflow-tooltip></el-table-column>
      <el-table-column label="需求时间" prop="requireDate" align="center" width="80px"></el-table-column>
      <el-table-column label="面料齐" prop="MlRole" align="center" width="60px">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.MlRole" :active-value="true" :inactive-value="false" active-color="#13ce66"
            inactive-color="#ff4949" disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="辅料齐" prop="FlRole" align="center" width="60px">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.FlRole" :active-value="true" :inactive-value="false" active-color="#13ce66"
            inactive-color="#ff4949" disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="排产" prop="SechuleRole" align="center" width="50px">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.SechuleRole" :active-value="true" :inactive-value="false" active-color="#13ce66"
            inactive-color="#ff4949" disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="开板" prop="KbRole" align="center" width="50px">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.KbRole" :active-value="true" :inactive-value="false" active-color="#13ce66"
            inactive-color="#ff4949" disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="裁剪" prop="CjRole" align="center" width="50px">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.CjRole" :active-value="true" :inactive-value="false" active-color="#13ce66"
            inactive-color="#ff4949" disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="缝制" prop="FzRole" align="center" width="50px">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.FzRole" :active-value="true" :inactive-value="false" active-color="#13ce66"
            inactive-color="#ff4949" disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="评审" prop="PsRole" align="center" width="50px">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.PsRole" :active-value="true" :inactive-value="false" active-color="#13ce66"
            inactive-color="#ff4949" disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit-outline" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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

    <el-drawer title="样衣图片" :visible.sync="drawer" align="center" direction="ltr">
      <el-image :src="styleImage" fit="fill" v-loading="imgLoading">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline" style="width: 80px;height: 80px;"></i>
        </div>
      </el-image>
    </el-drawer>

    <el-dialog title="修改样衣信息" :visible.sync="dialogFormVisible" width="70%" :before-close="handleEditClose">
      <el-table :data="gridTable" class="template-list" v-loading="tableLoading">
        <el-table-column property="name" label="项目" align="center" width="100px"></el-table-column>
        <el-table-column property="PlanTimer" label="计划完成日期" align="center" width="220px">
          <template slot-scope='scope'>
            <div v-if="!scope.row.editing">
              <span>{{ scope.row.PlanTimer }}</span>
            </div>
            <div v-else>
              <el-date-picker v-model="scope.row.PlanTimer" align="center" type="date" placeholder="选择日期" clearable
                value-format="yyyy-MM-dd"  format="yyyy-MM-dd" default-value=""></el-date-picker>
            </div>
          </template>
        </el-table-column>
        <el-table-column property="Timer" label="实际完成日期" align="center">
          <template slot-scope='scope'>
            <div v-if="!scope.row.editing">
              <span>{{ scope.row.Timer }}</span>
            </div>
            <div v-else>
              <el-date-picker v-model="scope.row.Timer" type="datetime" placeholder="选择日期时间" align="center" default-value=""
                default-time="" clearable value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </div>
          </template>
        </el-table-column>
        <el-table-column property="PersonPlan" label="计划人" align="center" width="130px">
          <template slot-scope='scope'>
            <div v-if="!scope.row.editing">
              <span>{{ scope.row.PersonPlan }}</span>
            </div>
            <div v-else>
              <el-input v-model="scope.row.PersonPlan" placeholder="计划人" @focus="InputEdit(scope.$index, scope.row)"
                clearable></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column property="Person" label="实际完成人" align="center" width="130px">
          <template slot-scope='scope'>
            <div v-if="!scope.row.editing">
              <span>{{scope.row.Person}}</span>
            </div>
            <div v-else>
              <el-input v-model="scope.row.Person" placeholder="完成人" clearable></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column property="oldRisk" label="备注" align="center" width="130px" show-overflow-tooltip>
          <template slot-scope='scope'>
            <div v-if="!scope.row.editing">
              <span>{{scope.row.oldRisk}}</span>
            </div>
            <div v-else>
              <el-input v-model="scope.row.nowRisk" placeholder="备注" clearable></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="operate-groups">
              <el-button type="primary" size="mini" v-if="!scope.row.editing" icon="el-icon-edit-outline" @click="handleEditInEdit(scope.$index, scope.row)">编辑
              </el-button>
              <el-button type="primary" size="mini" v-if="scope.row.editing" icon="el-icon-success" @click="handleSave(scope.$index, scope.row)">保存
              </el-button>
              <el-button size="mini" type="danger" v-show="false" v-if="!scope.row.editing" icon="el-icon-delete"
                @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
              <el-button size="mini" type="warning" v-if="scope.row.editing" icon="el-icon-warning" @click="handleCancel(scope.$index, scope.row)">取消
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-table :data="tableDataOut" id="PdmTable" v-show="false">
      <el-table-column label="通知单号" prop="Code" align="center"></el-table-column>
      <el-table-column label="款名" prop="styleName" align="center"></el-table-column>
      <el-table-column label="款式号" prop="styleCode" align="center"></el-table-column>
      <el-table-column label="客户" prop="customer" width="60px" align="center"></el-table-column>
      <el-table-column label="数量" prop="pdmNum" width="45px" align="center"></el-table-column>
      <el-table-column label="样品类型" prop="SampleStyle" align="center"></el-table-column>
      <el-table-column label="样衣类型" prop="colthType" align="center"></el-table-column>
      <el-table-column label="阶段" prop="phaseType" align="center"></el-table-column>
      <el-table-column label="申请部门" prop="applyDepart" align="center"></el-table-column>
      <el-table-column label="申请人" prop="applyPerson" align="center"></el-table-column>
      <el-table-column label="申请时间" prop="applyTimer" align="center"></el-table-column>
      <el-table-column label="需求时间" prop="requireDate" align="center"></el-table-column>
      <el-table-column label="面料齐" prop="MlRole" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.MlRole=== true">完成</span>
          <span v-else>未完成</span>
        </template>
      </el-table-column>
      <el-table-column label="辅料齐" prop="FlRole" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.FlRole=== true">完成</span>
          <span v-else>未完成</span>
        </template>
      </el-table-column>
      <el-table-column label="排产" prop="SechuleRole" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.SechuleRole=== true">完成</span>
          <span v-else>未完成</span>
        </template>
      </el-table-column>
      <el-table-column label="开板" prop="KbRole" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.KbRole=== true">完成</span>
          <span v-else>未完成</span>
        </template>
      </el-table-column>
      <el-table-column label="裁剪" prop="CjRole" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.CjRole=== true">完成</span>
          <span v-else>未完成</span>
        </template>
      </el-table-column>
      <el-table-column label="缝制" prop="FzRole" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.FzRole=== true">完成</span>
          <span v-else>未完成</span>
        </template>
      </el-table-column>
      <el-table-column label="评审" prop="PsRole" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.PsRole=== true">完成</span>
          <span v-else>未完成</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  name: 'PdmSys',
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
    // 刷新表格
    formReload: function () {
      var that = this
      that.loading = true
      setTimeout(function () {
        that.getPdmInfo()
      }, 1000)
    },

    // 设置完成未完成
    stateFormat (row, column) {
      // console.log('当前列：' + JSON.stringify(row))
      if (JSON.stringify(row.schedule).indexOf('面料') != -1) {
        return '完成'
      } else {
        return '未完成'
      }
      if (JSON.stringify(row.schedule).indexOf('辅料') != -1) {
        return '完成'
      } else {
        return '未完成'
      }
      if (JSON.stringify(row.schedule).indexOf('排产') != -1) {
        return '完成'
      } else {
        return '未完成'
      }
      if (JSON.stringify(row.schedule).indexOf('开板') != -1) {
        return '完成'
      } else {
        return '未完成'
      }
      if (JSON.stringify(row.schedule).indexOf('裁剪') != -1) {
        return '完成'
      } else {
        return '未完成'
      }
      if (JSON.stringify(row.schedule).indexOf('缝制') != -1) {
        return '完成'
      } else {
        return '未完成'
      }
      if (JSON.stringify(row.schedule).indexOf('评审') != -1) {
        return '完成'
      } else {
        return '未完成'
      }
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
        console.log(JSON.stringify(resp))
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

    // 打开编辑进度
    handleEdit (index, row) {
      var that = this
      that.tableLoading = true
      // console.log('第' + index + '条' + JSON.stringify(row))
      this.Code = row.Code
      that.dialogFormVisible = true
      that.addFormShow = 'none'
      that.editFormShow = ''
      that.$axios.get('/PDM/BLL/GetProductProgressByCode?code=' + row.Code + '&istest=false', { // 这里将axios.get 改为this.$axios.get
        params: {}
      }).then(resp => {
        // 将数据的长度赋值给totalCount

        var newdata = resp.data.pdmInfoDetails
        for (let i in newdata) {
          newdata[i].editing = false
        }
        that.gridTable = newdata
        that.tableLoading = false
      }).catch(err => {
        console.log(err)
      })
    },

    // 点击编辑进度表里面的编辑
    handleEditInEdit (index, row) {
      this.gridTable[index].editing = true
    },

    // 保存
    handleSave (index, row) {
      this.gridTable[index].editing = false
      this.editPdmInfo.ID = row.ID
      this.editPdmInfo.NoticeDocID = row.NoticeDocID
      this.editPdmInfo.seq = row.seq
      this.editPdmInfo.name = row.name
      this.editPdmInfo.Person = row.Person
      this.editPdmInfo.PersonPlan = row.PersonPlan
      this.editPdmInfo.PlanTimer = row.PlanTimer
      this.editPdmInfo.Timer = row.Timer
      this.editPdmInfo.nowRisk = row.nowRisk
      this.editPdmInfo.oldRisk = row.oldRisk
      if (row.Person != '' || row.Timer != '') {
        this.editPdmInfo.Flag = '1'
      }
      this.$axios.post('/PDM/BLL/UpdateProductProgressBymode?istest=false', this.editPdmInfo)
        .then(resp => {
          this.$axios.get('/PDM/BLL/GetProductProgressByCode?code=' + this.Code +
              '&istest=false', { // 这里将axios.get 改为this.$axios.get
            params: {}
          }).then(resp => {
            // console.log(JSON.stringify(resp))
            var newdata = resp.data.pdmInfoDetails
            for (let i in newdata) {
              newdata[i].editing = false
            }
            this.gridTable = newdata
            console.log('刷新')
          }).catch(err => {
            console.log(err)
          })
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
        }).catch(err => {
          console.log(err)
        })
    },

    // 取消
    handleCancel (index, row) {
      // console.log('1111:' + JSON.stringify(row))
      this.gridTable[index].editing = false
    },

    InputEdit (index, row) {
      // console.log('第' + index + '条' + JSON.stringify(row))
    },

    handleEditClose () {
      this.getPdmInfo()
      this.dialogFormVisible = false
    },

    // 点击获取图片
    handleImg (index, row) {
      // console.log('第' + index + '条' + JSON.stringify(row))
      var that = this
      that.imgLoading = true
      that.styleImage = ''
      that.drawer = true
      that.$axios.get('/PDM/BLL/GetProductProgressByCode?code=' + row.Code + '&istest=false', { // 这里将axios.get 改为this.$axios.get
        params: {}
      }).then(resp => {
        // console.log('image:' + JSON.stringify(resp.data.pdminfo.styleImage))
        // console.log('第' + index + '条' + JSON.stringify(resp))
        // 将数据的长度赋值给totalCount
        var images = resp.data.pdminfo.styleImage
        that.styleImage = 'data:image/png;base64,' + images
        that.imgLoading = false
      }).catch(err => {
        console.log(err)
      })
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
</style>
