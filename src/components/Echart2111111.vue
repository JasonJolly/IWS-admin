<template>
  <!-- <div ref="myChart" id="myChart" style="width:100%;height:600px;margin-top:30px" v-loading="echart"></div> -->
  <div ref="myChart" id="myChart" style="width:100%;height:600px;margin-top:30px"></div>
</template>

<script>
export default {
  name: 'Echart1',
  mounted () {
    var that = this
    that.SetEchart()
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
    SetEchart () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'))
      var option = {
        title: {
          text: '时段工作量展示表',
          subtext: '数据来自数据库'
        },
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['完成量']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ['上午', '中午', '晚上'],
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value'
        }],
        series: [{
          name: '完成量',
          type: 'bar',
          barWidth: '30%',
          data: [10, 52, 200]
        }]
      }
      myChart.setOption(option)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
