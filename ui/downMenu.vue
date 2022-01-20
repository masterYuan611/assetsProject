<template>
  <div ref="downMenu" class="down-menu">
    <div class="menu-title" :class="[active && !show ? 'active' : '']">
      <span @click="handleMenuClick">{{ title }}</span>
      <img :src="icon" />
    </div>
    <div v-show="show" class="down-menu-popup" ref="downMenuPopup" :style="downMenuPopupStyle">
      <span ref="block" class="block" :style="blockStyle" v-show="showBlock"></span>
      <van-popup
        v-model="showPopup"
        ref="popup"
        position="top"
        :overlay-style="{
          position: 'absolute',
        }"
        :get-container="() => $refs.downMenuPopup"
        @closed="handlePopupClosed"
        @close="handlePopupClose"
        @open="handlePopupOpen"
      >
        <div class="down-menu-content">
          <!-- 下拉菜单选项 -->
          <div class="menu-content">
            <div
              class="item"
              :class="[oddEven, value.includes(item.value) ? 'active' : '']"
              v-for="(item, index) in options"
              :key="index"
              @click="handleItemClick(item)"
            >
              <span>{{ item.name }}</span>
              <img src="images/selected.png" v-show="value.includes(item.value)" />
            </div>
          </div>
          <!-- 自定义内容 -->
          <slot :selected="value" :active="active"></slot>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 没有选值时的默认占位文本
    placeholder: {
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
  },
  computed: {
    icon() {
      if (this.show) {
        return require("images/up.png");
      } else if (this.active) {
        return require("images/down_active.png");
      } else {
        return require("images/down.png");
      }
    },
    // 是否选值(不包括全部选项)
    active() {
      if (this.isSingle) {
        return this.value.length > 0 && !this.value.includes("");
      } else {
        return !this.value.includes("");
      }
    },
    // 标题
    title() {
      if (!this.active) {
        return this.placeholder;
      }
      if (this.isSingle) {
        return this.options.find((item) => item.value === this.value[0]).name;
      } else {
        return this.options
          .filter((item) => this.value.includes(item.value))
          .map((item) => item.name)
          .join(",");
      }
    },
    // 选项个数奇偶
    oddEven() {
      return this.options.length % 2 ? "odd" : "even";
    },
  },
  data() {
    return {
      show: false,
      showPopup: false,
      showBlock: false,
      downMenuPopupStyle: { top: "0px" },
      blockStyle: { top: 0, left: 0, width: 0 }, // 菜单指示块样式
    };
  },
  mounted() {
    document.addEventListener("click", this.clickOutsideHandler);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.clickOutsideHandler);
  },
  methods: {
    // 点击数据项
    handleItemClick(item) {
      if (this.isSingle) {
        this.$emit("input", [item.value]);
        this.$emit("change");
        this.$refs.popup.close(); // 单选点击关闭
      } else {
        // 不限
        if (item.value === "") {
          this.$emit("input", [""]);
          this.$emit("change");
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
        this.$emit("change");
      }
    },
    // 点击外部区域收起下拉菜单
    clickOutsideHandler(event) {
      if (!this.$el.contains(event.target)) {
        this.$refs.popup.close();
      }
    },
    handleMenuClick() {
      if (this.show) {
        this.$refs.popup.close();
      } else {
        this.show = true;
        this.showPopup = true;
        this.showBlock = true;
        let item = this.$refs.downMenu.getBoundingClientRect();
        this.blockStyle = {
          top: item.bottom + "px",
          left: item.left + "px",
          width: item.width + "px",
        };
        this.$nextTick(() => {
          let block = this.$refs.block.getBoundingClientRect();
          this.downMenuPopupStyle = {
            top: block.bottom + "px",
          };
        });
      }
    },
    handlePopupClosed() {
      this.show = false;
      this.showWrapper = false;
      this.showBlock = false;
    },
    // block在动画之前隐藏
    handlePopupClose() {
      this.showBlock = false;
      this.$emit("close");
    },
    handlePopupOpen() {
      this.$emit("open");
    },
    // 提供给父组件调用
    handleClose() {
      this.$refs.popup.close();
    },
  },
};
</script>

<style lang="less" scoped>
.down-menu {
  position: relative;
  background: #f2f3f5;
  font-size: 0.26rem;
  font-weight: 400;
  color: #333333;
  border-radius: 0.04rem;

  .menu-title {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
    }
    &.active {
      background: #f7fbfe;
      border: 1px solid rgba(0, 123, 246, 0.5);
      color: #007bf6;
      border-radius: 0.04rem;
    }
    img {
      width: 0.14rem;
      margin-left: 0.1rem;
    }
  }
  .down-menu-popup {
    position: fixed;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 10;
    overflow: hidden;
    .down-menu-content {
      padding: 0.4rem;
      background: #f2f3f5;
      .menu-content {
        display: flex;
        flex-wrap: wrap;
        .item {
          display: flex;
          align-items: center;
          width: 50%;
          margin-bottom: 0.5rem;
          &.active {
            color: #007bf6;
          }
          &.even:last-child {
            margin-bottom: 0;
          }
          &.even:nth-last-child(2) {
            margin-bottom: 0;
          }
          &.odd:last-child {
            margin-bottom: 0;
          }
          img {
            width: 0.18rem;
            margin-left: 0.1rem;
          }
        }
      }
    }
    .block {
      position: fixed;
      background: #f2f3f5;
      height: 0.2rem;
    }
    /deep/ .van-popup {
      position: absolute;
    }
    /deep/ .van-overlay {
      background-color: rgba(0, 0, 0, 0.4);
    }
  }
}
</style>
