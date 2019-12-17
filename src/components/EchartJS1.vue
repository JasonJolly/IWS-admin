<template>
  <div class="container-box">
    <div ref="myChart" id="myChart"  v-loading="echart"></div>
    <div ref="myChart1" id="myChart1"  v-loading="echart1"></div>
  </div>
</template>

<script>
  export default {
    name: 'Echart1',
    mounted() {
      var that = this
      that.GetPdmBiReport()
    },
    data() {
      return {
        msg: 'Welcome to 凌云木 Vue.js App',
        echart: true,
        echart1: true,
        tableData: [],
        dateList: [], // 时间
        requireList: [], // 需求数量
        qlList: [], // 辅助齐料
        comfirmList: [] // 完成数量
      }
    },
    methods: {
      GetPdmBiReport() {
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
      SetEchart() {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        let myChart1 = this.$echarts.init(document.getElementById('myChart1'))

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
            // subtext: '数据来自数据库',
            textStyle: { // 设置主标题风格
              fontStyle: 'normal', // 主标题文字风格
              fontWeight: 'bold',
              fontSize: 24
            },
            subtextStyle: {
              fontSize: 14
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['需求数量', '面辅料齐备', '实际完成'],
            textStyle: {
              fontSize: 18
            }
          },
          grid: {
            left: '2%',
            right: '2%',
            bottom: '1%',
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
                  color: '#F39C12',
                  label: {
                    show: true,
                    fontSize: 18
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
                  color: '#2471A3',
                  label: {
                    show: true,
                    fontSize: 18
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
                    show: true,
                    fontSize: 18
                  }
                }
              },
              data: this.comfirmList
            }
          ]
        }

        var option1 = {
          title: {
            text: '人均工时报表',
            // subtext: '数据来自数据库',
            textStyle: { // 设置主标题风格
              fontStyle: 'normal', // 主标题文字风格
              fontWeight: 'bold',
              fontSize: 24
            },
            subtextStyle: {
              fontSize: 14
            }
          },
          tooltip: {
            axisPointer: {
              type: 'none'
            }
          },
          grid: {
            left: '2%',
            right: '2%',
            bottom: '1%',
            containLabel: true
          },
          legend: {
            data: ['人数', '产能', '人均工时'],
            textStyle: {
              fontSize: 18
            }
          },
          xAxis: [{
            type: 'category',
            data: ['12/1', '12/2', '12/3', '12/4', '12/5', '12/6', '12/7', '12/8', '12/9', '12/10',
              '12/11', '12/12'
            ],
            axisLabel: {
              interval: 0,
              textStyle: {
                fontSize: 16 // 更改坐标轴文字大小
              }
            },
            axisPointer: {
              type: 'shadow'
            }
          }],
          yAxis: [{
            type: 'value',
            name: '产能、出勤人数',
            // min: 0,
            // max: 250,
            interval: 10,
            axisLabel: {
              formatter: '{value} 件',
              textStyle: {
                fontSize: 18 // 更改坐标轴文字大小
              }
            }
          }, {
            type: 'value',
            name: '人均工时',
            // min: 0,
            // max: 25,
            interval: 50,
            axisLabel: {
              formatter: '{value} 分钟',
              textStyle: {
                fontSize: 18 // 更改坐标轴文字大小
              }
            },
            splitLine: { // 网格线
              show: false
            }
          }],
          series: [{
              name: '人数',
              type: 'bar',
              data: [15, 16, 17, 11, 18, 22, 14, 17, 16, 20.0, 21, 13],
              label: {
                normal: {
                  show: true,
                  position: 'inside',
                  fontSize: 18
                }
              }
            },
            {
              name: '产能',
              type: 'bar',
              data: [20, 25, 11, 12, 30, 18, 10, 6, 30, 23, 21, 20],
              label: {
                normal: {
                  show: true,
                  position: 'inside',
                  fontSize: 18
                }
              }
            },
            {
              name: '人均工时',
              type: 'line',
              yAxisIndex: 1,
              data: [150, 110, 120, 130, 80, 100, 130, 120, 110, 167, 143, 123],
              label: {
                normal: {
                  show: true,
                  position: 'inside',
                  fontSize: 18
                }
              }
            }
          ]
        }

        myChart.setOption(option)
        myChart1.setOption(option1)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container-box {
    padding: 20px;
    box-sizing: border-box;
  }

  .container-box div{
    width: 100%;
    height: 350px;

  }

  #myChart1{
     margin-top: 20px;
  }
</style>
