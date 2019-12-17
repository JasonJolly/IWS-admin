<template>
  <div ref="myChart" id="myChart" style="width:100%;height:600px;margin-top:30px" v-loading="echart"></div>
</template>

<script>
export default {
  name: 'Echart1',
  mounted () {
    var that = this
    that.GetPdmBiReport()
  },
  data () {
    return {
      msg: 'Welcome to 凌云木 Vue.js App',
      echart: true,
      tableData: [],
      dateList: [], // 时间
      requireList: [], // 需求数量
      qlList: [], // 辅助齐料
      comfirmList: [] // 完成数量
    }
  },
  methods: {
    GetPdmBiReport () {
      this.$axios.get('/PDM/BI/GetPdmBiReport', { // 这里将axios.get 改为this.$axios.get
        params: {}
      }).then(resp => {
        // console.log("121212:" + JSON.stringify(resp))
        this.tableData = resp.data
        this.SetEchart()
        this.echart = false
      }).catch(err => {
        console.log(err)
      })
    },
    SetEchart () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      for (let i in this.tableData) {
        this.dateList[i] = this.tableData[i].Time
        this.requireList[i] = this.tableData[i].RequireNum
        this.qlList[i] = this.tableData[i].MatchingNum
        this.comfirmList[i] = this.tableData[i].CompleteNum
        if (this.tableData[i].SEQ == 0) {
          this.dateList[i] = '今天'
        }
      }
      var option = {
        title: {
          text: '完成情况表',
          subtext: '数据来自数据库'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['需求数量', '面辅料齐备', '实际完成']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.dateList

        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        series: [{
          name: '需求数量',
          type: 'bar',
          itemStyle: {
            normal: {
              color: '#000099',
              label: {
                show: true
              }
            }
          },
          data: this.requireList
        },
        {
          name: '面辅料齐备',
          type: 'bar',
          itemStyle: {
            normal: {
              color: '#FF9933',
              label: {
                show: true
              }
            }
          },
          data: this.qlList
        },
        {
          name: '实际完成',
          type: 'bar',
          itemStyle: {
            normal: {
              color: '#669933',
              label: {
                show: true
              }
            }
          },
          data: this.comfirmList
        }
        ]
      }
      myChart.setOption(option)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
