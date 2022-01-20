<template>
  <!-- 观点下架 -->
  <div class="cover">
    <div class="viewEdit">
      <div class="viewEdit-title">{{ title }}</div>
      <div class="viewEdit-content">{{ content }}</div>
      <div class="viewEdit-input">
        <form action="/" style="display: block">
          <van-field
            v-model="inputcontent"
            rows="2"
            autosize
            label=""
            type="textarea"
            maxlength="50"
            placeholder="请输入下架理由"
            show-word-limit
          />
        </form>
      </div>
      <div class="viewEdit-line"></div>
      <div class="viewEdit-footer">
        <div class="button-left"><van-button>取消</van-button></div>
        <div class="button-line"></div>
        <div class="button-right">
          <van-button
            :class="[active ? 'active' : '', 'van-button']"
            v-bind:disabled="send"
            @click="save"
            >保存</van-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputcontent: "",
      title: "驳回观点",
      content: "请输入驳回理由，被驳回的观点可以由创建者编辑后再次提交",
      send: false,
    };
  },
  computed: {
    active() {
      if (this.inputcontent) {
        return true;
      }
      return false;
    },
  },
  methods: {
    save() {
      //   if (!this.active) {
      //     return;
      //   }
    },
  },
};
</script>

<style lang="less" scoped>
.cover {
  width: 7.5rem;
  height: 16.24rem;
  background: #000000;
  //   opacity: 0.4;
  position: relative;
  .viewEdit {
    width: 5.8rem;
    height: 7.15rem;
    background: #ffffff;
    border-radius: 0.1rem;
    position: absolute;
    left: 0.85rem;
    top: 2.61rem;
    .viewEdit-title {
      margin-top: 0.4rem;
      height: 0.54rem;
      font-size: 0.36rem;
      font-weight: 500;
      color: #333333;
      line-height: 0.54rem;
      text-align: center;
    }
    .viewEdit-content {
      padding: 0 0.4rem;
      margin-top: 0.2rem;
      height: 0.84rem;
      font-size: 0.28rem;
      font-weight: 400;
      color: #666666;
      line-height: 0.42rem;
    }
    .viewEdit-input {
      margin-top: 0.3rem;
      height: 3.6rem;
      background: #ffffff;
      border-radius: 0.09rem;
      opacity: 1;
      padding: 0 0.3rem;
      form {
        width: 100%;
        height: 100%;
        /deep/ .van-cell {
          height: 100%;

          padding: 0.16rem 0.3rem;
          background: #f4f5f7;
          .van-field__value {
            position: relative !important;
            .van-field__body {
              height: 100% !important;
              .van-field__control {
                height: 100% !important;
                font-size: 0.3rem;
                font-weight: 400;
                color: #999999;
                line-height: 0.48rem;
              }
            }
            .van-field__word-limit {
              position: absolute !important;
              right: 0rem !important;
              bottom: 0.04rem !important;
              //   margin-top: -0.2rem !important;
            }
          }
        }
      }
    }
    .viewEdit-line {
      margin-top: 0.3rem;
      height: 0.01rem;
      background: #e9ebf0;
    }
    .viewEdit-footer {
      height: 0.97rem;
      font-size: 0.34rem;
      font-weight: 400;

      .button-left {
        width: 2.9rem;
        height: 0.97rem;
        line-height: 0.97rem;
        float: left;
        color: #333333;
        text-align: center;
        box-sizing: border-box;
        position: relative !important;
        /deep/ .van-button {
          height: 0.96rem;
          border: none;
          width: 100%;
          position: absolute !important;
          left: 0;
          top: 0;
          span {
            font-size: 0.34rem;
            font-weight: 400;
            color: #333333;
            line-height: 0.52rem;
          }
        }
      }
      .button-line {
        width: 0.01rem;
        float: left;
        background: rgba(0, 0, 0, 0.1);
        height: 0.97rem;
      }
      .button-right {
        width: 2.89rem;
        height: 0.97rem;
        line-height: 0.97rem;
        float: right;
        position: relative !important;
        text-align: center;
        /deep/ .van-button {
          height: 0.96rem;
          border: none;
          width: 100%;
          position: absolute !important;
          right: 0;
          top: 0;
          opacity: 0.4;
          span {
            font-size: 0.34rem;
            font-weight: 400;
            color: #007bf6;
            line-height: 0.52rem;
          }
        }
        .van-button.active {
          opacity: 1 !important;
        }
      }
    }
  }
}
</style>
