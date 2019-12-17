<template>
  <div ref="myChart" id="myChart" style="width:100%;height:600px;margin-top:30px" v-loading="echart"></div>
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
        var option = {
          title: {
            text: '人均工时报表',
            subtext: '数据来自数据库',
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
            axisPointer: {
              type: 'none'
            }
          },
          legend: {
            data: ['人数', '产能', '人均工时']
          },
          xAxis: [{
            type: 'category',
            data: ['12月1日', '12月2日', '12月3日', '12月4日', '12月5日', '12月6日', '12月7日', '12月8日', '12月9日', '12月10日',
              '12月11日', '12月12日'
            ],
            axisLabel: {
              textStyle: {
                fontSize: 18 // 更改坐标轴文字大小
              }
            },
            axisPointer: {
              type: 'shadow'
            }
          }],
          yAxis: [{
              type: 'value',
              name: '产能',
              // min: 0,
              // max: 250,
              interval: 50,
              axisLabel: {
                formatter: '{value} 件',
                textStyle: {
                  fontSize: 18 // 更改坐标轴文字大小
                }
              }
            },{
              type: 'value',
              name: '人均工时',
              // min: 0,
              // max: 25,
              interval: 5,
              axisLabel: {
                formatter: '{value} 分钟',
                textStyle: {
                  fontSize: 18 // 更改坐标轴文字大小
                }
              },
              splitLine: { //网格线
                show: false
              }
            }
          ],
          series: [{
              name: '人数',
              type: 'bar',
              data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
              label: {
                normal: {
                  show: true,
                  position: 'inside'
                }
              },
            },
            {
              name: '产能',
              type: 'bar',
              data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
              label: {
                normal: {
                  show: true,
                  position: 'inside'
                }
              },
            },
            {
              name: '人均工时',
              type: 'line',
              yAxisIndex: 1,
              data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
              label: {
                normal: {
                  show: true,
                  position: 'inside'
                }
              },
            }
          ]
        };

        myChart.setOption(option)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
