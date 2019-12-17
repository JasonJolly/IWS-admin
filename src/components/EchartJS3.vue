<template>
  <div class="container-box">
    <div ref="myChart" id="myChart" style="width:100%;height:500px;" v-loading="echart"></div>
    <div class="table-box">
      <div ref="myChart1" id="myChart1" style="width:60%;height:500px;margin-top:10px" v-loading="echart1"></div>
      <div ref="myChart2" id="myChart2" style="width:40%;height:500px;margin-top:10px" v-loading="echart2"></div>
    </div>
  </div>

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
      echart: true,
      echart1: true,
      echart2: true
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
      let myChart1 = this.$echarts.init(document.getElementById('myChart1'))
      let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
      var option = {
        title: {
          text: '样衣工排名',
          subtext: '数据来自数据库',
          left: 'center',
          textStyle: { // 设置主标题风格
            fontStyle: 'normal', // 主标题文字风格
            fontWeight: 'bold',
            fontSize: 24
          },
          subtextStyle: {
            fontSize: 14,
            color: '#f1f1f1'
          }
        },
        xAxis: {
          type: 'category',
          name: '姓名',
          axisLabel: {
            show: true,
            textStyle: {
              fontSize: 18 // 更改坐标轴文字大小
            }
          },
          data: ['张三', '李四', '王五', '毛六', '九七', '钱八', '赵七', '孙十']
        },
        yAxis: {
          type: 'value',
          name: '数量',
          interval: 50,
          axisLabel: {
            formatter: '{value} 件',
            textStyle: {
              fontSize: 18 // 更改坐标轴文字大小
            }
          },
          // 设置网格线颜色
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#fff'],
              width: 1,
              type: 'solid'
            }
          }
        },
        series: [{
          data: [200, 180, 170, 160, 150, 130, 120, 110, 80, 70],
          type: 'bar',
          barMaxWidth: 80,
          itemStyle: {
            normal: {
              color: function (params) {
                var colorList = [
                  '#C1232B', '#CD5C5C', '#B9770E', '#E87C25', '#27727B',
                  '#873600', '#2874A6', '#6C3483', '#9C640C', '#60C0DD',
                  '#D7504B', '#C6E579', '#2874A6', '#F0805A', '#26C0C0'
                ]
                return colorList[params.dataIndex]
              }
            }
          },
          label: {
            normal: {
              show: true,
              position: 'top',
              textStyle: {
                fontSize: 18
              }
            }
          }
        }]
      }

      var option1 = {
        title: {
          text: '版师排名',
          subtext: '数据来自数据库',
          left: 'center',
          textStyle: { // 设置主标题风格
            fontStyle: 'normal', // 主标题文字风格
            fontWeight: 'bold',
            fontSize: 24
          },
          subtextStyle: {
            fontSize: 14,
            color: '#f1f1f1'
          }
        },
        xAxis: {
          type: 'value',
          name: '数量',
          // min: 0,
          // max: 25,
          interval: 50,
          axisLabel: {
            formatter: '{value} 件',
            textStyle: {
              fontSize: 18 // 更改坐标轴文字大小
            }
          },
          splitLine: { // 网格线
            show: false
          }
        },
        yAxis: {
          type: 'category',
          name: '姓名',
          axisLabel: {
            show: true,
            textStyle: {
              fontSize: 18 // 更改坐标轴文字大小
            }
          },
          data: ['张三', '李四', '王五', '毛六', '九七', '钱八', '赵七', '孙十']
        },
        series: [{
          data: [200, 180, 170, 160, 150, 130, 120, 110, 80, 70],
          type: 'bar',
          barMaxWidth: 80,
          itemStyle: {
            normal: {
              color: function (params) {
                var colorList = [
                  '#C1232B', '#CD5C5C', '#B9770E', '#E87C25', '#27727B',
                  '#873600', '#2874A6', '#6C3483', '#9C640C', '#60C0DD',
                  '#D7504B', '#C6E579', '#2874A6', '#F0805A', '#26C0C0'
                ]
                return colorList[params.dataIndex]
              }
            }
          },
          label: {
            normal: {
              show: true,
              position: 'right',
              textStyle: {
                fontSize: 18
              }
            }
          }
        }]
      }

      var option2 = {
        title: {
          text: '版师完工占比',
          subtext: '数据来自数据库',
          left: 'center',
          textStyle: { // 设置主标题风格
            fontStyle: 'normal', // 主标题文字风格
            fontWeight: 'bold',
            fontSize: 24
          },
          subtextStyle: {
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          x: 'center',
          y: 'bottom',
          data: ['张三', '李四', '王五', '钱六']
        },
        series: [{
          name: '访问来源',
          type: 'pie',
          radius: [30, 110],
          roseType: 'radius',
          center: ['50%', '50%'],
          data: [{
            value: 335,
            name: '张三'
          },
          {
            value: 310,
            name: '李四'
          },
          {
            value: 234,
            name: '王五'
          },
          {
            value: 135,
            name: '钱六'
          }
          ],
          itemStyle: {
            normal: {
              label: {
                show: true,
                formatter: '{b} : {c} ({d}%)',
                textStyle: {
                  fontSize: 16
                }
              },
              labelLine: {
                show: true
              }
            },
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }

          // itemStyle: {
          //   emphasis: {
          //     shadowBlur: 10,
          //     shadowOffsetX: 0,
          //     shadowColor: 'rgba(0, 0, 0, 0.5)'
          //   }
          // }
        }]
      }

      myChart.setOption(option)
      myChart1.setOption(option1)
      myChart2.setOption(option2)
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

  .table-box {
    display: flex;
    flex-direction: row;
  }
</style>
