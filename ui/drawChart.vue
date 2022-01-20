<template>
  <div class="chartimg">
    <div
      class="drawRowLine1"
      :style="
        rowindex == 0
          ? 'border-bottom: 1px solid rgba(0,89,167,0.5);color:rgba(0,89,167,0.9);'
          : 'border-bottom: 1px dashed rgba(198,201,204,0.4);'
      "
    ></div>
    <div
      class="drawRowLine2"
      :style="
        rowindex == 1
          ? 'border-bottom: 1px solid rgba(0,89,167,0.5);color:rgba(0,89,167,0.9);'
          : 'border-bottom: 1px dashed rgba(198,201,204,0.4);'
      "
    ></div>
    <div
      class="drawRowLine3"
      :style="
        rowindex == 2
          ? 'border-bottom: 1px solid rgba(0,89,167,0.5);color:rgba(0,89,167,0.9);'
          : 'border-bottom: 1px dashed rgba(198,201,204,0.4);'
      "
    ></div>
    <div
      class="drawColLine1"
      :style="
        colindex == 0
          ? 'border-right: 1px solid rgba(0,89,167,0.5);color:rgba(0,89,167,0.9);'
          : 'border-right: 1px dashed rgba(198,201,204,0.4);'
      "
    ></div>
    <div
      class="drawColLine2"
      :style="
        colindex == 1
          ? 'border-right: 1px solid rgba(0,89,167,0.5);color:rgba(0,89,167,0.9);'
          : 'border-right: 1px dashed rgba(198,201,204,0.4);'
      "
    ></div>
    <div
      class="drawColLine3"
      :style="
        colindex == 2
          ? 'border-right: 1px solid rgba(0,89,167,0.5);color:rgba(0,89,167,0.9);'
          : 'border-right: 1px dashed rgba(198,201,204,0.4);'
      "
    ></div>
    <div
      :class="[isDot ? 'dispaly-none' : 'dot']"
      :style="
        'top:' + (0.14 + rowindex * 0.54) + 'rem;' + 'left:' + (0.28 + colindex * 0.95) + 'rem;'
      "
    ></div>
  </div>
</template>
<script>
export default {
  props: ["rowindex", "colindex", "isDot"],
  data() {
    return {};
  },
  mounted() {
    console.log(this.rowindex);
  },
};
</script>
<style lang="less" scoped>
.chartimg {
  position: relative;
  font-size: 0.2rem;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: right;
  color: rgba(138, 142, 153, 0.8);
  line-height: 0.33rem;
  float: right;
  .drawRowLine1,
  .drawRowLine2,
  .drawRowLine3 {
    width: 2.62rem;
    height: 0;
  }
  .drawRowLine1 {
    margin-top: 0.2rem;
    position: relative;
    &::before {
      content: "大盘";
      position: absolute;
      left: -0.58rem;
      top: -0.17rem;
    }
  }
  .drawRowLine2 {
    position: relative;
    &::before {
      content: "中盘";
      position: absolute;
      left: -0.58rem;
      top: -0.17rem;
    }
  }
  .drawRowLine3 {
    position: relative;
    &::before {
      content: "小盘";
      position: absolute;
      left: -0.58rem;
      top: -0.17rem;
    }
  }
  .drawRowLine2,
  .drawRowLine3 {
    margin-top: 0.54rem;
  }
  .drawColLine1,
  .drawColLine2,
  .drawColLine3 {
    position: absolute;
    top: 0;
    width: 0px;
    height: 1.3rem;
  }
  .drawColLine1 {
    left: 0.35rem;
    &::after {
      content: "价值型";
      width: 0.9rem;
      position: absolute;
      left: -0.45rem;
      bottom: -0.5rem;
    }
  }
  .drawColLine2 {
    left: 1.3rem;
    &::after {
      content: "平衡型";
      width: 0.9rem;
      position: absolute;
      left: -0.45rem;
      bottom: -0.5rem;
    }
  }
  .drawColLine3 {
    left: 2.25rem;
    &::after {
      content: "成长型";
      width: 0.9rem;
      position: absolute;
      left: -0.45rem;
      bottom: -0.5rem;
    }
  }
  .dot {
    position: absolute;
    width: 0.1rem;
    height: 0.1rem;
    background: #ffffff;
    border: 0.03rem solid #0059a7;
    border-radius: 50%;
  }
  .dispaly-none {
    display: none;
  }
}
</style>
