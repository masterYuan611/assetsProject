<template>
  <div>
    <div class="title">
      <code class="back" @click="$router.back(-1)"></code>
      <span>创建报告</span>
    </div>
    <div class="warp">
      <div class="warp-main">
        <p class="sure">请确认报告内容</p>
        <p class="no-show">如无需展示，取消勾选即可</p>
      </div>

      <!-- 点击去选择封面 -->
      <div class="clickchose">
        <span class="zhuanye">专业版</span
        ><img src="images/icon-chosestyle.png" alt="" class="tochose" @click="gotochose" />
      </div>
      <div>
        <van-checkbox-group v-model="result" ref="checkboxGroup" @change="clickbox">
          <van-checkbox name="a" disabled> 封面</van-checkbox>
          <van-checkbox name="b" @click="clicksingle(1)"
            ><i :style="{ color: color1 }">账户概要</i></van-checkbox
          >
          <van-checkbox name="c" @click="clicksingle(2)">
            <i :style="{ color: color2 }">盈亏分析</i></van-checkbox
          >
          <van-checkbox name="d" @click="clicksingle(3)">
            <i :style="{ color: color3 }">资产分享</i></van-checkbox
          >
          <van-checkbox name="e" @click="clicksingle(4)">
            <i :style="{ color: color4 }">交易分析</i></van-checkbox
          >
          <van-checkbox name="f" @click="clicksingle(5)">
            <i :style="{ color: color5 }">账户诊断</i></van-checkbox
          >
          <van-checkbox name="g" disabled>封底</van-checkbox>
        </van-checkbox-group>
      </div>
    </div>
    <div class="footer">
      <div class="choseall">
        <span class="iconall" @click="checkAll"
          ><img src="images/checkedAll.png" alt="" v-show="iconfalse" /></span
        ><span class="allchosed">全选</span>
      </div>
      <div class="button">生产报告</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      iconfalse: false, //全选图片隐藏
      result: ["a", "b", "c", "d", "e", "f", "g"],
      checked: true,
      color1: "#333333",
      color2: "#333333",
      color3: "#333333",
      color4: "#333333",
      color5: "#333333",
      flag1: true,
      flag2: true,
      flag3: true,
      flag4: true,
      flag5: true,
    };
  },
  methods: {
    // 点击图标去到选择风格页面
    gotochose() {
      this.$light.navigate("root/createPDFreport/chooseStyle");
    },
    // 点击
    clickbox() {
      if (this.result.length < 7) {
        this.iconfalse = false;
      } else {
        this.iconfalse = true;
      }
    },
    //勾选全选按钮
    checkAll() {
      this.iconfalse = true;
      this.$refs.checkboxGroup.toggleAll(true);
    },

    // 点击单项选择按钮
    clicksingle(index) {
      switch (index) {
        case 1:
          if (!this.flag1) {
            this.color1 = "#333333";
          } else {
            this.color1 = "#999999";
          }
          this.flag1 = !this.flag1;

          break;
        case 2:
          if (!this.flag2) {
            this.color2 = "#333333";
          } else {
            this.color2 = "#999999";
          }
          this.flag2 = !this.flag2;

          break;
        case 3:
          if (!this.flag3) {
            this.color3 = "#333333";
          } else {
            this.color3 = "#999999";
          }
          this.flag3 = !this.flag3;

          break;
        case 4:
          if (!this.flag4) {
            this.color4 = "#333333";
          } else {
            this.color4 = "#999999";
          }
          this.flag4 = !this.flag4;

          break;
        case 5:
          if (!this.flag5) {
            this.color5 = "#333333";
          } else {
            this.color5 = "#999999";
          }
          this.flag5 = !this.flag5;
          break;
        default:
          break;
      }
    },
    toggleAll() {
      this.iconfalse = false;
      this.$refs.checkboxGroup.toggleAll();
    },
  },
};
</script>

<style lang="less" scoped>
.warp {
  margin-top: 2.03rem;
  padding: 0 0.5rem 0.37rem;
  position: relative;
}
.warp-main {
  margin-top: 1.23rem;
}
.sure {
  height: 0.59rem;
  font-size: 0.42rem;
  font-weight: bold;
  text-align: center;
  color: #333333;
  line-height: 0.59rem;
}
.no-show {
  margin-top: 0.16rem;
  height: 0.4rem;
  font-size: 0.28rem;
  font-weight: 400;
  text-align: center;
  color: #999999;
  line-height: 0.4rem;
}
.clickchose {
  display: flex;
  position: absolute;
  right: 0.67rem;
  top: 2.16rem;
}
.zhuanye {
  display: block;
  // width: 0.84rem;
  height: 0.4rem;
  font-size: 0.28rem;
  font-weight: 400;
  text-align: right;
  color: #007bf6;
}
.tochose {
  display: block;
  width: 0.28rem;
  height: 0.28rem;
  margin-left: 0.1rem;
  margin-top: 0.06rem;
}
.van-checkbox-group {
  margin-top: 0.7rem;
  margin-bottom: 1.8rem;
}
/deep/ .van-checkbox {
  //全选样式
  // &:last-of-type {
  //   z-index: 1;
  //   width: auto;
  //   position: absolute;
  //   left: 0.5rem;
  //   bottom: 0.35rem;
  //   span {
  //     width: auto;
  //     height: auto;
  //     padding-left: 0.2rem;
  //     font-weight: 400;
  //     font-size: 0.28rem;
  //     text-align: center;
  //     color: #666666;
  //     line-height: 0.4rem;
  //     border: none;
  //     background: none;
  //   }
  // }
  &:first-of-type {
    margin-top: 0;
  }
  height: 1rem;
  margin-top: 0.2rem;
  font-size: 0.28rem;
  .van-checkbox__icon {
    width: 0.4rem;
    height: 0.4rem;
    .van-checkbox__icon--round .van-icon {
      width: 0.4rem;
      height: 0.4rem;
      border: 0.02rem solid #cccccc;
      border-radius: 50%;
    }
  }
  i {
    font-style: normal;
    // color: #333333;
  }
  span {
    width: 5.73rem;
    height: 1rem;
    line-height: 1rem;
    background: #fafbfc;
    border: 0.01rem solid #e6e6e6;
    border-radius: 0.04rem;
    padding-left: 0.5rem;
  }
}

/deep/ .van-checkbox__label {
  display: block;
  height: 1rem;
  width: 5.73rem;
  background: #fafbfc;
  border: 0.01rem solid #e6e6e6;
  border-radius: 0.04rem;
}
.footer {
  width: 7.5rem;
  height: 1.1rem;
  background: #ffffff;
  box-shadow: 0px -1px 0px 0px #e6e6e6;
  position: relative;
  .choseall {
    display: flex;
    position: absolute;
    left: 0.5rem;
    top: 0.35rem;
  }
  .allchosed {
    // width: 0.56rem;
    height: 0.4rem;
    font-size: 0.28rem;
    font-weight: 400;
    text-align: center;
    color: #666666;
    line-height: 0.4rem;
  }
  .iconall {
    display: block;
    width: 0.41rem;
    height: 0.41rem;
    border: 0.02rem solid #cccccc;
    border-radius: 50%;
    margin-right: 0.2rem;
  }
  img {
    display: block;
    width: 0.4rem;
    height: 0.4rem;
  }
}
.button {
  width: 4.5rem;
  height: 0.8rem;
  line-height: 0.8rem;
  background: linear-gradient(90deg, #00aff6, #007bf6);
  border-radius: 0.46rem;
  position: absolute;
  right: 0.4rem;
  bottom: 0.15rem;
  font-size: 0.36rem;
  font-weight: 500;
  text-align: center;
  color: #ffffff;
}
</style>
