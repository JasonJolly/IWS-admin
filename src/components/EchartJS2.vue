<template>
  <div class="container-box">
    <div ref="myChart" id="myChart" style="width:100%;height:400px;" v-loading="echart"></div>
    <div class="table-box">
      <div ref="myChart1" id="myChart1" style="width:60%;height:600px;margin-top:10px" v-loading="echart1"></div>
      <div ref="myChart2" id="myChart2" style="width:40%;height:600px;margin-top:10px" v-loading="echart2"></div>
    </div>
    <div>
      <button></button>
    </div>
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
        echart2: true,
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
        let myChart2 = this.$echarts.init(document.getElementById('myChart2'))
        var option = {
          title: {
            text: '样品类型统计表',
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
          xAxis: {
            type: 'category',
            name: '样品类型',
            axisLabel: {
              show: true,
              textStyle: {
                fontSize: 18 // 更改坐标轴文字大小
              }
            },
            data: ['开发样', '产前样', '照相样', '耗料', '颜色样', '尺码样', '初样', '修改样', '报价样']
          },
          yAxis: {
            type: 'value',
            name: '人均工时',
            // min: 0,
            // max: 25,
            interval: 50,
            axisLabel: {
              formatter: '{value} 件',
              textStyle: {
                fontSize: 18 // 更改坐标轴文字大小
              }
            }
          },
          series: [{
            data: [120, 200, 150, 80, 70, 110, 130, 150, 150],
            type: 'bar',
            barMaxWidth: 80,
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = [
                    '#C1232B', '#CD5C5C', '#FCCE10', '#E87C25', '#27727B',
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
                position: 'inside',
                textStyle: {
                  fontSize: 18
                }
              }
            }
          }]
        }

        var option1 = {
          title: {
            text: '年度产能统计表',
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
          xAxis: {
            type: 'category',
            name: '月份',
            axisLabel: {
              show: true,
              textStyle: {
                fontSize: 18 // 更改坐标轴文字大小
              }
            },
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          },
          yAxis: {
            type: 'value',
            name: '数量',
            // min: 0,
            // max: 25,
            interval: 1000,
            axisLabel: {
              formatter: '{value} 件',
              textStyle: {
                fontSize: 18 // 更改坐标轴文字大小
              }
            }
          },
          series: [{
            data: [2000, 1000, 1200, 3000, 1270, 3110, 4130, 1150, 3150, 4130, 1150, 3150],
            type: 'line',
            smooth: true,
            areaStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'red'
                  },
                  {
                    offset: 0.5,
                    color: '#CD5C5C'
                  },
                  {
                    offset: 1,
                    color: '#FA8072'
                  }
                ])
              }
            }, // 填充区域样式
            label: {
              normal: {
                show: true,
                position: 'inside',
                textStyle: {
                  fontSize: 18,
                  color: '#fff'
                }
              }
            }
          }]
        }

        var option2 = {
          title: {
            text: '订单分布',
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
            y: 540,
            data: ['H&M', 'C&A', 'M&S', 'other']
          },
          series: [{
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: [{
                value: 335,
                name: 'H&M'
              },
              {
                value: 310,
                name: 'C&A'
              },
              {
                value: 234,
                name: 'M&S'
              },
              {
                value: 135,
                name: 'other'
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
  .container-box{
    padding: 20px;
    box-sizing: border-box;
  }
  .table-box {
    display: flex;
    flex-direction: row;
  }
</style>
