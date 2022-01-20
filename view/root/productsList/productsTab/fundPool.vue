<template>
  <div class="fund-pool" ref="fundPool">
    <div class="filter-condition">
      <!-- 基金类型 -->
      <van-popover
        ref="popover"
        v-model="showPopover"
        trigger="click"
        :get-container="() => $refs.fundPool"
        placement="bottom-start"
        @hook:mounted="handlePopover"
      >
        <div class="menu">
          <span
            class="menu-item"
            :class="[item.value === condition.type ? 'active' : '']"
            v-for="(item, index) in typeList"
            :key="index"
            @click.prevent="handleMenuItemClick(item)"
            >{{ item.text }}</span
          >
        </div>
        <template #reference>
          <div class="select">
            <span>{{ selectedPoolName }}</span
            ><img :src="selectIcon" />
          </div>
        </template>
      </van-popover>
      <div class="rise-fall" @click="handleSort">
        <span>近一年涨跌幅</span>
        <img :src="sortIcon" />
      </div>
    </div>
    <!-- 组合列表 -->
    <van-list
      v-model="loading"
      :finished="finished"
      :immediate-check="false"
      offset="20"
      finished-text="没有更多了"
      @load="handleDataLoad"
    >
      <van-cell v-for="(item, index) in fundList" :key="index">
        <template #title>
          <span class="name">{{ item.name }}</span>
        </template>
        <template #label>
          <span class="code">{{ item.code }}</span>
          <span class="risk">{{ item.riskLevel }}</span>
          <span class="type">{{ item.type }}</span>
        </template>
        <div class="number">
          <span class="rise">{{ item.rise }}</span>
        </div>
      </van-cell>
    </van-list>
  </div>
</template>
<script>
const itemTemplate = {
  name: "前海开源经济灵活配置",
  code: "881148",
  type: "混合型",
  riskLevel: "中风险",
  rise: "106.43%",
};

export default {
  data() {
    return {
      // 搜索条件
      condition: {
        type: "", // 基金类型
        sort: "des", // 近一年涨跌幅排序
        page: 0,
        pageSize: 5,
      },
      showPopover: false,
      // 基金类型
      typeList: [
        { text: "全部", value: "" },
        { text: "股票基金", value: 1 },
        { text: "债券基金", value: 2 },
        { text: "指数基金", value: 3 },
        { text: "货币基金", value: 4 },
        { text: "QDII基金", value: 5 },
        { text: "混合基金", value: 6 },
        { text: "短期理财", value: 7 },
        { text: "其他", value: 8 },
      ],
      loading: false,
      finished: false,
      fundList: [], // 基金列表
    };
  },
  computed: {
    // 所选基金类型名称
    selectedPoolName() {
      return this.typeList.find((item) => item.value === this.condition.type).text;
    },
    selectIcon() {
      return require(`images/${this.showPopover ? "up" : "down"}.png`);
    },
    sortIcon() {
      let name =
        this.condition.sort === "" ? "sort" : this.condition.sort === "asc" ? "asc" : "des";
      return require(`images/${name}.png`);
    },
  },
  mounted() {
    this.handleDataLoad();
  },
  methods: {
    handleMenuItemClick(item) {
      this.condition.type = item.value;
    },
    handleSort() {
      this.condition.sort =
        this.condition.sort === "" ? "des" : this.condition.sort === "des" ? "asc" : "";
    },
    // todo
    handleDataLoad() {
      this.condition.page += 1;
      let pageSize = this.condition.page === 1 ? 10 : 5;
      let res = new Array(pageSize).fill(1).map(() => JSON.parse(JSON.stringify(itemTemplate)));
      this.fundList = [...this.fundList, ...res];
      this.loading = false;
    },
    // fix van-popover两次点击才能生效bug
    handlePopover() {
      this.$refs.popover.onTouchstart = (event) => {
        this.$emit("touchstart", event);
      };
    },
  },
};
</script>
<style lang="less" scoped>
@import url("../../../../css/mixins.less");

.fund-pool {
  /deep/ .van-popup {
    .van-popover__content {
      padding: 0.25rem 0;
    }
  }
  .menu {
    .product-list > .select-menu();
  }
  .filter-condition {
    .product-list > .filter-wrapper();
    img {
      width: 0.14rem;
      margin-left: 0.1rem;
    }
    .rise-fall {
      margin-left: auto;
    }
  }
  /deep/.van-list {
    .product-list > .main-list();
    .van-cell {
      .product-list > .list-item();
      .number {
        font-size: 0.36rem;
        font-weight: 400;
        color: #e72b2b;
      }
      .van-cell__value {
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }
  }
}
</style>
