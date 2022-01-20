<template>
  <div class="product-combination">
    <div class="comination-header">
      <span class="name">{{ title }}</span>
      <div class="warning" v-if="!passed">
        <img src="images/warning.png" />
        <span>有产品的权重不能为0</span>
      </div>
      <div v-if="readonly" class="read-only">{{ value }}%</div>
      <!-- 权重 -->
      <van-field
        v-else
        :value="value"
        label=""
        type="digit"
        placeholder=""
        @input="handleInput"
        @blur="handleBlur"
      >
        <template #extra>
          <span class="extra">%</span>
        </template>
      </van-field>
    </div>
    <!-- 产品列表 -->
    <div class="product-list">
      <div class="product-item" v-for="item in products" :key="item.id">
        <img src="images/product-delete.png" @click="handleProductDelete(item)" v-if="!readonly" />
        <div class="item-top">
          <span class="name">{{ getProductName(item.prodName, "first") }}</span>
          <span class="name" v-if="getProductName(item.prodName, 'last')">
            {{ getProductName(item.prodName, "last") }}
          </span>
          <span v-if="!item.riskLevel || item.riskLevel === '默认型'" class="risk-empty">-</span>
          <div v-else class="risk">{{ item.riskLevel }}</div>
          <div class="status">{{ item.hold }}</div>
        </div>
        <div class="item-bottom">
          <div class="left">
            <span>{{ isOverYear(item) ? "近一年收益" : "成立至今收益" }}</span>
            <span>{{ item.yearProfitRate }}</span>
          </div>
          <div class="right">
            <span>最大回撤</span>
            <span>{{ item.maxDrawdown }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="add" @click="handleProductAdd" v-if="!readonly">
      <span>+</span>
      {{ title }}产品
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  props: {
    // 组合标题
    title: {
      type: String,
      default: "权益类",
    },
    // 组合类型
    type: {
      type: String,
      default: "",
    },
    // 权重
    value: {
      type: String,
      default: "0",
    },
    // 产品列表
    products: {
      type: Array,
      default: () => [],
    },
    // 是否只读
    readonly: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    // 权重值校验是否通过
    passed() {
      return !(this.value == 0 && this.products.length > 0);
    },
  },
  methods: {
    // 更新权重值
    handleInput(value) {
      // 各个类型产品权重最大100%
      if (parseFloat(value) > 100) {
        this.$emit("input", "0");
        this.$nextTick(() => {
          this.$emit("input", "100");
          this.$emit("change");
        });
      } else {
        this.$emit("input", value);
        this.$emit("change");
      }
    },
    // 权重默认为0
    handleBlur() {
      if (this.value === "") {
        this.$emit("input", "0");
        this.$emit("change");
      }
    },
    // 添加产品
    handleProductAdd() {
      this.$emit("add", this.type);
    },
    // 删除产品
    handleProductDelete(item) {
      let cloneProducts = JSON.parse(JSON.stringify(this.products));
      let index = cloneProducts.findIndex((i) => i.prodCode === item.prodCode);
      if (index > -1) {
        cloneProducts.splice(index, 1);
        this.$emit("update:products", cloneProducts);
        this.$emit("change");
      }
    },
    // 成立是否满一年
    isOverYear(item) {
      const now = moment();
      const publishDate = moment(item.publishDate);
      return now.diff(publishDate, "days") >= 365;
    },
    // 较长的产品名称截断处理
    getProductName(name, type) {
      if (name.length <= 17 && type === "last") return false;
      if (type === "first") {
        return name.slice(0, 17);
      } else {
        return name.slice(17);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.product-combination {
  margin-bottom: 0.8rem;
  .comination-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.2rem;
    .name {
      display: flex;
      align-items: center;
      font-size: 0.34rem;
      font-weight: 500;
      color: #333333;
      line-height: 0.48rem;
      margin-right: auto;
      &::before {
        display: block;
        content: "";
        width: 0.06rem;
        height: 0.28rem;
        margin-right: 0.15rem;
        background: #007bf6;
      }
    }
    .warning {
      display: flex;
      align-items: center;
      margin-right: 0.2rem;
      img {
        width: 0.28rem;
        height: 0.28rem;
        margin-right: 0.1rem;
      }
      span {
        font-size: 0.28rem;
        font-weight: 400;
        color: #e72b2b;
      }
    }
    .read-only {
      font-size: 0.34rem;
      font-weight: 500;
      color: #333333;
      line-height: 0.48rem;
    }
    /deep/ .van-cell {
      box-sizing: border-box;
      width: 1.5rem;
      padding: 0 0.2rem;
      height: 0.7rem;
      line-height: 0.7rem;
      border-radius: 0.04rem;
      border: 1px solid rgba(219, 219, 219, 0.5);
      .van-field__control {
        font-size: 0.32rem;
        font-weight: 500;
        color: #333333;
      }
      .extra {
        font-size: 0.28rem;
        font-weight: 500;
        color: #333333;
      }
    }
  }
  .product-list {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    .product-item {
      position: relative;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 6.08rem;
      height: 1.77rem;
      padding: 0.3rem 0 0.3rem 0.4rem;
      margin-bottom: 0.2rem;
      background: #f4f5f7;
      border-radius: 0.1rem;
      &:last-child {
        margin-bottom: 0;
      }
      > img {
        position: absolute;
        top: 0.54rem;
        left: -0.32rem;
        width: 0.6rem;
        height: 0.6rem;
      }
      .item-top {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        span:last-of-type {
          margin-right: 0.2rem;
        }
        .name {
          font-size: 0.32rem;
          font-weight: 500;
          color: #333333;
          line-height: 0.5rem;
        }
        .risk-empty {
          font-size: 0.16rem;
          padding: 0 0.1rem;
          margin-right: 0.1rem !important;
        }
        .risk {
          display: flex;
          align-items: center;
          justify-content: center;
          // width: 0.92rem;
          height: 0.34rem;
          padding: 0 0.1rem;
          // margin: 0 0.1rem 0 0.2rem;
          margin-right: 0.1rem;
          border-radius: 0.02rem;
          border: 1px solid rgba(202, 203, 204, 0.5);
          font-size: 0.24rem;
          font-weight: 400;
          color: #666666;
          // line-height: 0.34rem;
          text-align: center;
        }
        .status {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 0.68rem;
          height: 0.34rem;
          border-radius: 0.02rem;
          border: 1px solid rgba(243, 95, 37, 0.5);
          font-size: 0.24rem;
          font-weight: 400;
          color: rgba(243, 95, 37, 0.9);
          // line-height: 0.34rem;
          text-align: center;
        }
      }
      .item-bottom {
        display: flex;
        align-items: center;
        font-size: 0.24rem;
        font-weight: 400;
        color: #808080;
        line-height: 0.43rem;
        .left {
          display: flex;
          align-items: center;
          margin-right: 0.34rem;
          span:last-child {
            margin-left: 0.2rem;
            font-size: 0.28rem;
            font-weight: 500;
            color: #e72b2b;
            line-height: 0.4rem;
          }
        }
        .right {
          display: flex;
          align-items: center;
          span:last-child {
            margin-left: 0.2rem;
            font-size: 0.28rem;
            font-weight: 500;
            color: #333333;
            line-height: 0.4rem;
          }
        }
      }
    }
  }
  .add {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 0.8rem;
    border-radius: 0.4rem;
    margin-top: 0.3rem;
    border: 1px solid rgba(0, 123, 246, 0.3);
    font-size: 0.3rem;
    font-weight: 500;
    color: #007bf6;
    span {
      margin-right: 0.1rem;
    }
  }
}
</style>
