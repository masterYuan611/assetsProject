<template>
  <div>
    <div class="title">
      <code class="back" @click="$router.back(-1)"></code>
    </div>
    <div class="warp">
      <p class="sure">选择报告风格</p>
      <div class="chosse-img">
        <div class="image">
          <div class="hot" :style="{ border: radio == '1' ? '0.02rem solid #007bf6' : '' }">
            <img src="images/hot.png" alt="" />
          </div>
          <div class="well" :style="{ border: radio == '2' ? '0.02rem solid #007bf6' : '' }">
            <img src="images/well.png" alt="" />
          </div>
        </div>
        <div class="choseradio">
          <div class="word">
            <span :style="{ color: radio == '1' ? '#007bf6' : '#999999' }">温馨版</span
            ><span :style="{ color: radio == '2' ? '#007bf6' : '#999999' }">专业版</span>
          </div>

          <van-radio-group v-model="radio" direction="horizontal">
            <van-radio name="1"></van-radio>
            <van-radio name="2"></van-radio>
          </van-radio-group>
        </div>
      </div>
      <div class="footer"><div class="button">确定</div></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      radio: "1",
    };
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.warp {
  padding: 0 0.3rem;
}

.sure {
  margin-top: 1.92rem;
  height: 0.59rem;
  font-size: 0.42rem;
  font-weight: bold;
  text-align: center;
  color: #333333;
  line-height: 0.59rem;
}
.chosse-img {
  margin-top: 0.71rem;
  height: 6.38rem;
}
.image {
  height: 4.58rem;
}
.hot {
  width: 3.1rem;
  height: 4.38rem;
  opacity: 0.7;
  background: #ffffff;
  // border: 0.02rem solid;
  border-image: linear-gradient(44deg, #00b2fb 2%, #007bf6 99%) 2 2;
  border-radius: 0.1rem;
  float: left;
  padding: 0.1rem;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.well {
  width: 3.1rem;
  height: 4.38rem;
  // border: 0.02rem solid;
  border-image: linear-gradient(44deg, #00b2fb 2%, #007bf6 99%) 2 2;
  border-radius: 0.1rem;
  float: right;
  padding: 0.1rem;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.choseradio {
  margin-top: 0.58rem;
  height: 1.22rem;
}
.word {
  height: 0.45rem;
  line-height: 0.45rem;
  display: flex;
  justify-content: space-around;
  span {
    display: block;
    width: 0.96rem;
    height: 0.45rem;
    font-size: 0.32rem;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    text-align: center;
    // color: #007bf6;
  }
}

.radio-box {
  display: inline-block;
  position: relative;
  margin-top: 0.29rem;
  height: 0.48rem;
  width: 0.48rem;
  background: seagreen;
  line-height: 0.48rem;
}
.radio {
  display: inline-block;
  width: 0.48rem;
  height: 0.48rem;
  vertical-align: middle;
  cursor: pointer;
  background-image: url("/images/radio.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: 0 0;
}
.input-radio {
  display: inline-block;
  position: absolute;
  opacity: 0;
  width: 0.48rem;
  height: 0.48rem;
  cursor: pointer;
  left: 0px;
  outline: none;
  -webkit-appearance: none;
}
.on {
  background-position: -0.48rem 0;
}

/deep/ .van-radio-group {
  width: 100%;
  height: 0.48rem;
  margin-top: 0.29rem;
  justify-content: space-around;
  margin-left: 0.12rem;
  .van-radio {
    width: 0.48rem;
    height: 0.48rem;
    .van-radio__icon {
      width: 0.48rem;
      height: 0.48rem;
      // .van-radio__icon .van-icon {
      //   width: 100%;
      //   height: 100%;
      //   border: 2px solid #cccccc;
      //   border-radius: 50%;
      // }
    }
    .van-radio__icon--round .van-icon {
      height: 0.48 rem;
      border-radius: 100%;
      width: 0.48 rem;
    }
  }
}

.footer {
  line-height: 1.1rem;
  height: 0.8rem;
  background: #ffffff;
  box-shadow: 0px -0.01rem 0px 0px #e6e6e6;
  margin-top: 4.18rem;
  padding: 0.15rem 0.4rem;
}
.button {
  width: 6.7rem;
  height: 0.8rem;
  background: linear-gradient(90deg, #00aff6, #007bf6);
  border-radius: 0.46rem;
  text-align: center;
  color: #ffffff;
  line-height: 0.8rem;
  font-size: 0.34rem;
}
</style>
