<template>
  <div class="product-combination" ref="productCombination">
    <div class="filter-condition">
      <!-- 组合类型下拉选择 -->
      <van-popover
        ref="popover"
        v-model="showPopover"
        trigger="click"
        :get-container="() => $refs.productCombination"
        placement="bottom-start"
        @hook:mounted="handlePopover"
      >
        <div class="menu">
          <span
            class="menu-item"
            :class="[item.value === condition.type ? 'active' : '']"
            v-for="(item, index) in typeList"
            :key="index"
            @click="handleMenuItemClick(item)"
            >{{ item.text }}</span
          >
        </div>
        <template #reference>
          <div class="select">
            <span>{{ selectedCombinationName }}</span
            ><img :src="selectIcon" />
          </div>
        </template>
      </van-popover>
      <div class="max-retracement" @click="handleSort('maxRetracement')">
        <span>最大回撤</span>
        <img :src="maxRetracementIcon" />
      </div>
      <div class="total-income" @click="handleSort('totalIncome')">
        <span>总收益</span>
        <img :src="totalIncomeIcon" />
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
      <van-cell v-for="(item, index) in comList" :key="index">
        <template #title>
          <span class="name">{{ item.name }}</span>
        </template>
        <template #label>
          <span class="risk">{{ item.riskLevel }}</span>
          <span class="type">{{ item.type }}</span>
        </template>
        <div class="number">
          <span class="retracement">{{ item.maxRetracement }}</span>
          <span class="income">{{ item.totalIncome }}</span>
        </div>
      </van-cell>
    </van-list>
  </div>
</template>
<script>
const itemTemplate = {
  name: "成长掘金",
  type: "盈享利",
  riskLevel: "中风险",
  maxRetracement: "20.37%",
  totalIncome: "106.43%",
};

export default {
  data() {
    return {
      // 搜索条件
      condition: {
        type: "", // 组合类型
        maxRetracement: "", // 最大回撤排序
        totalIncome: "des", // 总收益排序
        page: 0,
        pageSize: 5,
      },
      showPopover: false,
      // 组合类型列表
      typeList: [
        { text: "全部", value: "" },
        { text: "盈享利", value: 1 },
        { text: "普通组合", value: 2 },
      ],
      loading: false,
      finished: false,
      comList: [], // 组合列表
    };
  },
  computed: {
    // 所选组合类型名称
    selectedCombinationName() {
      return this.typeList.find((item) => item.value === this.condition.type).text;
    },
    selectIcon() {
      return require(`images/${this.showPopover ? "up" : "down"}.png`);
    },
    maxRetracementIcon() {
      let sort = this.condition.maxRetracement;
      let name = sort === "" ? "sort" : sort === "asc" ? "asc" : "des";
      return require(`images/${name}.png`);
    },
    totalIncomeIcon() {
      let sort = this.condition.totalIncome;
      let name = sort === "" ? "sort" : sort === "asc" ? "asc" : "des";
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
    /**
     * 搜索排序
     * @param {*} type
     * maxRetracement:最大回撤
     * totalIncome:总收益
     * @returns
     */
    handleSort(type) {
      this.condition[type] =
        this.condition[type] === "" ? "des" : this.condition[type] === "des" ? "asc" : "";
    },
    // todo
    handleDataLoad() {
      this.condition.page += 1;
      let pageSize = this.condition.page === 1 ? 10 : 5;
      let res = new Array(pageSize).fill(1).map(() => JSON.parse(JSON.stringify(itemTemplate)));
      this.comList = [...this.comList, ...res];
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

.product-combination {
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
    .max-retracement {
      margin-left: auto;
    }
    .total-income {
      margin-left: 1.18rem;
    }
  }
  /deep/.van-list {
    .product-list > .main-list();
    .van-cell {
      .product-list > .list-item();
      .number {
        width: 100%;
        display: flex;
        justify-content: space-between;
        font-size: 0.36rem;
        font-weight: 400;
        color: #333333;
        .income {
          color: #e72b2b;
        }
      }
      .van-cell__title {
        width: 3.32rem;
        flex: none;
      }
      .van-cell__value {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
