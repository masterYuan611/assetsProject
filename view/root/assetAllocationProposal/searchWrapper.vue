<template>
  <div class="search-wrapper">
    <form action="/">
      <van-search
        :value="value"
        show-action
        placeholder="产品名称/代码"
        @search="handleSearch"
        @cancel="handleCancel"
        @input="handleInput"
      >
        <template #left-icon>
          <van-image src="images/search-icon.png" width="0.28rem" height="0.28rem" />
        </template>
      </van-search>
    </form>
    <div class="search-history" v-if="searchHistory.length > 0 && !this.value">
      <div class="history-title">
        <span>搜索历史</span>
        <img src="images/icon-delete.png" @click="handleHistoryClear" />
      </div>
      <div class="history-list">
        <span
          v-for="(item, index) in searchHistory"
          :key="index"
          class="history-item"
          @click="handleHistoryItemClick(item)"
        >
          {{ item.length > 20 ? `${item.slice(0, 20)}...` : item }}
        </span>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  props: {
    // 输入值
    value: {
      type: String,
      default: "",
    },
  },
  computed: {
    ...mapGetters(["searchHistory"]),
    // 输入值去掉空格和特殊字符
    trimValue() {
      let value = this.clearKeywords(this.value);
      return value.replace(/\s+/g, "");
    },
  },
  methods: {
    ...mapMutations("proposal", ["setSearchHistory"]),
    // 搜索
    handleSearch() {
      if (!this.trimValue) return;
      this.setSearchHistory({ value: this.trimValue });
      this.$emit("search");
    },
    // 取消
    handleCancel() {
      this.$emit("cancel");
    },
    // 输入值更新
    handleInput(value) {
      this.$emit("input", value);
    },
    // 清空搜索历史
    handleHistoryClear() {
      this.setSearchHistory({ type: "clear" });
    },
    // 选中搜索历史
    handleHistoryItemClick(item) {
      this.$emit("input", item);
      this.$emit("search");
      this.setSearchHistory({ value: item });
    },
    // 去掉搜索中的特殊字符
    clearKeywords(s) {
      const pattern = new RegExp(
        "[`~!@#$%^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】《》‘；：”“'。，、？]",
      );
      let rs = "";
      for (let i = 0; i < s.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern, "");
      }
      return rs;
    },
  },
};
</script>

<style lang="less" scoped>
.search-wrapper {
  font-family: PingFangSC-Regular, PingFang SC;
  /deep/ .van-search {
    height: 0.88rem;
    padding: 0.14rem 0.3rem;
    .van-search__content {
      padding-left: 0.3rem;
      border-radius: 0.12rem;
    }
    .van-cell {
      line-height: 0.4rem;
      padding: 0.1rem 0;
    }
    .van-field__left-icon {
      display: flex;
      align-items: center;
      margin-right: 0.2rem;
    }
    .van-search__action {
      padding-left: 0.32rem;
      padding-right: 0;
      font-size: 0.28rem;
      font-weight: 400;
      color: #666666;
    }
    .van-field__clear {
      font-size: 0.34rem;
      margin-right: 0.3rem;
      padding: 0;
      color: rgba(217, 218, 219, 1);
    }
  }
  form {
    display: block;
  }
  .search-history {
    padding: 0.26rem 0.3rem;
    .history-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.24rem;
      font-size: 0.32rem;
      font-weight: 500;
      color: #333333;
      line-height: 0.45rem;
      img {
        width: 0.28rem;
        height: 0.28rem;
      }
    }
    .history-list {
      display: flex;
      flex-wrap: wrap;
      font-size: 0.28rem;
      font-weight: 400;
      color: #333333;
      .history-item {
        height: 0.5rem;
        padding: 0 0.15rem;
        margin-right: 0.2rem;
        margin-top: 0.2rem;
        line-height: 0.5rem;
        background: #f2f3f5;
        border-radius: 0.04rem;
      }
    }
  }
}
</style>
