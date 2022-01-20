<template>
  <div class="block">
    <span class="block-title">{{ title }}</span>
    <div class="block-item">
      <span
        class="item"
        :class="[value.includes(item.value) ? 'active' : '']"
        :style="itemStyle"
        v-for="(item, index) in options"
        :key="index"
        @click="handleItemClick(item)"
        >{{ item.name }}</span
      >
      <span
        class="item hidden"
        :style="itemStyle"
        v-for="(item, index) in hiddenList"
        :key="`_${index}`"
      ></span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 块标题
    title: {
      type: String,
      default: "",
    },
    // 选项
    options: {
      type: Array,
      default: () => [],
    },
    // 单选or多选
    isSingle: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Array,
      default: () => [],
    },
    // 自定义每行显示的条件块个数及宽度
    styleOption: {
      type: Object,
      default: () => ({
        num: 3,
      }),
    },
  },
  computed: {
    itemStyle() {
      return {
        width: this.styleOption.width,
      };
    },
    // 占位列表
    hiddenList() {
      if (this.options.length % this.styleOption.num === 0) {
        return [];
      } else {
        return new Array(this.styleOption.num - (this.options.length % this.styleOption.num));
      }
    },
  },
  methods: {
    handleItemClick(item) {
      if (this.isSingle) {
        this.$emit("input", [item.value]);
      } else {
        // 不限
        if (item.value === "") {
          this.$emit("input", [""]);
          return;
        }
        let index = this.value.findIndex((i) => i === item.value);
        let copyValue = JSON.parse(JSON.stringify(this.value));
        if (index > -1) {
          // 反选
          copyValue.splice(index, 1);
          this.$emit("input", copyValue.length === 0 ? [""] : copyValue);
        } else {
          if (copyValue.length === 1 && copyValue[0] === "") {
            copyValue = [];
          }
          copyValue.push(item.value);
          this.$emit("input", copyValue);
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.block {
  display: flex;
  flex-direction: column;
}
.block-title {
  width: 100%;
  font-size: 0.32rem;
  font-weight: 500;
  text-align: left;
  color: #333333;
  line-height: 0.45rem;
}
.block-item {
  display: flex;
  justify-content: left;
  flex-wrap: wrap;
  margin-top: 0.3rem;
  font-size: 0.28rem;
  font-weight: 400;
  text-align: center;
  color: #333333;
  line-height: 0.4rem;
  .item {
    box-sizing: border-box;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    min-width: 2.16rem;
    padding: 0 0.4rem;
    height: 0.6rem;
    background: #f2f3f5;
    border-radius: 0.04rem;
    margin-right: 0.2rem;
    position: relative;
    &:nth-child(-n + 3) {
      margin-bottom: 0.2rem;
    }
    &.active {
      font-weight: 500;
      color: #0a80f6;
      background: rgba(0, 123, 246, 0.03);
      // border: 0.01rem solid #007bf6;
    }
    &.active::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 200%;
      height: 200%;
      transform: scale(0.5);
      transform-origin: left top;
      box-sizing: border-box;
      border: 1px solid rgba(0, 123, 246, 0.7);
      border-radius: 0.08rem;
    }
    &.hidden {
      visibility: hidden;
    }
  }
}
</style>
