<template >
  <div class="owner-previews">
    <div
      class="echart-wrap"
      :class="[item == 3 ? 'echart-total' : '']"
      v-for="(item, index) in [1, 2, 3]"
      :key="index"
    >
      <div
        :id="`myChart${item}`"
        :style="{ width: '100%', height: '100%' }"
      ></div>
    </div>
  </div>
</template>

<script>
import httpHelper from "../../utils/httpHelper";
export default {
  data() {
    return {
      myChart1: null,
      myChart2: null,
      myChart3: null,
      optionDay: null,
      optionWeek: null,
      optionMonth: null,
    };
  },
  mounted() {
    this.onRefresh();
  },
  methods: {
    async onRefresh() {
      const res = await httpHelper.postRequestAuth("api/preview");
      if (res.success) {
        this.optionDay = {
          title: {
            text: res.content.viewDay.text,
            subtext: res.content.viewDay.subtext,
            left: "center",
          },
          tooltip: {
            trigger: "item",
          },
          legend: {
            orient: "vertical",
            left: "left",
          },
          series: [
            {
              name: "Access From",
              type: "pie",
              radius: "50%",
              data: res.content.viewDay.data,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            },
          ],
        };

        this.optionWeek = {
          title: {
            text: res.content.viewWeek.text,
            subtext: res.content.viewWeek.subtext,
            left: "center",
          },
          tooltip: {
            trigger: "item",
          },
          legend: {
            orient: "vertical",
            left: "left",
          },
          series: [
            {
              name: "Access From",
              type: "pie",
              radius: "50%",
              data: res.content.viewWeek.data,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            },
          ],
        };

        this.optionMonth = {
          title: {
            text: res.content.viewMonth.text,
            subtext: res.content.viewMonth.subtext,
            left: "center",
          },
          tooltip: {
            trigger: "item",
          },
          legend: {
            orient: "vertical",
            left: "left",
          },
          xAxis: {
            type: "category",
            data: res.content.viewMonth.dataTime,
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              name: "接单数量",
              type: "line",
              data: res.content.viewMonth.dataValues,
            },
          ],
        };
        this.creatEchart();
      }
    },
    creatEchart() {
      if (this.myChart1) {
        this.myChart1.setOption(this.optionDay);
      } else {
        this.myChart1 = this.$echarts.init(document.getElementById("myChart1"));
        this.myChart1.setOption(this.optionDay);
      }

      if (this.myChart2) {
        this.myChart2.setOption(this.optionWeek);
      } else {
        this.myChart2 = this.$echarts.init(document.getElementById("myChart2"));
        this.myChart2.setOption(this.optionWeek);
      }

      if (this.myChart3) {
        this.myChart3.setOption(this.optionMonth);
      } else {
        this.myChart3 = this.$echarts.init(document.getElementById("myChart3"));
        this.myChart3.setOption(this.optionMonth);
      }
    },
  },
};
</script>


<style lang="less" scoped>
.owner-previews {
  width: 100%;
  height: 100%;
  background-color: #d5d5d5;
  display: grid;
  grid-template-columns: 1fr 1fr; //有几列
  grid-template-rows: 1fr 1fr; //有几行
  align-content: space-around;

  // grid-gap: 20px;

  .echart-wrap {
    flex: 1;
    padding: 30px;
  }

  .echart-total {
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 2;
    grid-column-end: 4;
    // grid-column: 1 / 2;
    // grid-row: 1 / 3;
    // background: blueviolet;
  }
}
</style>