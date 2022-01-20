<template>
  <search-wrapper v-model="keyword" @cancel="handleCancel" @search="handleSearch">
    <div class="combination" v-show="combinations.length > 0">
      <div class="combination-title">投顾组合</div>
      <van-cell v-for="item in combinations" :key="item.id" @click="handleProductClick(item)">
        <span class="combination-name" v-html="getHighlightHtml(item.prodName)"></span>
      </van-cell>
    </div>
    <div class="spacing" v-if="combinations.length > 0 && raisedFunds.length > 0"></div>
    <van-list
      v-show="raisedFunds.length > 0"
      v-model="loading"
      :finished="finished"
      :immediate-check="false"
      offset="40"
      finished-text="没有更多了"
      @load="handleLoad"
      class="raised-funds"
    >
      <div class="combination-title">公募基金</div>
      <van-cell v-for="item in raisedFunds" :key="item.id" @click="handleProductClick(item)">
        <span class="id" v-html="getHighlightHtml(item.prodCode)"></span>
        <span class="name" v-html="getHighlightHtml(item.prodName)"></span>
      </van-cell>
    </van-list>
    <div v-show="loading && [...combinations, ...raisedFunds].length === 0" class="raised-funds">
      <van-skeleton title :row="4" />
      <van-skeleton title :row="4" />
      <van-skeleton title :row="4" />
      <van-skeleton title :row="4" />
      <van-skeleton title :row="4" />
    </div>
    <div
      class="empty"
      v-show="keyword && finished && [...combinations, ...raisedFunds].length === 0"
    >
      <img src="images/noneData.png" />
      <span>无匹配产品</span>
    </div>
  </search-wrapper>
</template>

<script>
import SearchWrapper from "./searchWrapper.vue";

export default {
  components: {
    SearchWrapper,
  },
  data() {
    return {
      keyword: "", // 输入值
      combinations: [], // 投顾组合
      raisedFunds: [], // 公募基金
      loading: false,
      finished: false,
      page: 1,
      pageSize: 10,
    };
  },
  props: {
    // 搜索类型(权益equity、固收fixed、现金cash)
    type: {
      type: String,
      default: "",
    },
  },
  methods: {
    // 搜索
    handleSearch() {
      this.reset();
      this.handleLoad();
    },
    // 关闭搜索页面
    handleCancel() {
      this.keyword = "";
      this.reset();
      this.$emit("cancel");
    },
    // 重置
    reset() {
      this.page = 1;
      this.pageSize = 10;
      this.finished = false;
      this.combinations = [];
      this.raisedFunds = [];
    },
    // 加载产品
    handleLoad() {
      this.loading = true;
      this.$apiFwgx
        .getProductList({
          keyword: this.clearKeywords(this.keyword),
          pageNum: this.page,
          pageSize: this.pageSize,
        })
        .then(({ data }) => {
          if (data.success) {
            const { stockProductInfoVOList, fundProductInfoVOList } = data.data;
            if (this.page === 1) {
              this.combinations = [...(stockProductInfoVOList || [])];
              this.raisedFunds = [...(fundProductInfoVOList || [])];
            } else {
              this.raisedFunds = [...this.raisedFunds, ...fundProductInfoVOList];
            }
            this.page += 1;
            if (!fundProductInfoVOList || fundProductInfoVOList.length < this.pageSize) {
              this.finished = true;
            }
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 高亮输入框对应内容
    getHighlightHtml(text) {
      return text.replace(
        new RegExp(this.keyword, "g"),
        `<span style="color: #007BF6">${this.keyword}</span>`,
      );
    },
    // 选中产品
    handleProductClick(item) {
      this.$emit("select", item, this.type);
      this.handleCancel();
    },
    // 去掉搜索中的特殊字符和空格
    clearKeywords(s) {
      const pattern = new RegExp(
        "[`~!@#$%^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】《》‘；：”“'。，、？]",
      );
      let rs = "";
      for (let i = 0; i < s.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern, "");
      }
      return rs.replace(/\s+/g, "");
    },
  },
};
</script>

<style lang="less" scoped>
.combination-title {
  position: relative;
  height: 0.8rem;
  padding-left: 0.3rem;
  line-height: 0.8rem;
  font-size: 0.28rem;
  font-weight: 400;
  color: #999999;
  &::after {
    position: absolute;
    box-sizing: border-box;
    content: " ";
    pointer-events: none;
    bottom: 0;
    left: 0;
    right: 0;
    border-bottom: 1px solid #ebebeb;
    transform: scaleY(0.5);
  }
}
.combination {
  .combination-name {
    font-size: 0.32rem;
    font-weight: 500;
    color: #333333;
  }
  /deep/ .van-cell {
    height: 1rem;
    line-height: 1rem;
    padding: 0 0 0 0.3rem;
  }
}
.spacing {
  height: 0.2rem;
  background: #f2f2f5;
}
.raised-funds {
  /deep/ .van-cell {
    height: 1rem;
    line-height: 1rem;
    padding: 0 0 0 0.3rem;
  }
  /deep/ .van-skeleton {
    margin-bottom: 0.2rem;
  }
  .id {
    margin-right: 0.3rem;
  }
  .id,
  .name {
    font-size: 0.32rem;
    font-weight: 500;
    color: #333333;
  }
}
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3.86rem;
  img {
    width: 4.4rem;
    height: 2.8rem;
  }
  span {
    font-size: 0.28rem;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: center;
    color: #999999;
    line-height: 0.4rem;
  }
}
</style>
