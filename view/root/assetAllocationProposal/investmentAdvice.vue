<template>
  <proposal-wrapper title="投顾观点" describe="每份报告只可选择其中一个观点" page="1">
    <template>
      <van-list
        v-show="finalList.length > 0"
        v-model="loading"
        :finished="finished"
        :immediate-check="false"
        offset="20"
        finished-text="没有更多了"
        @load="handleLoad"
        class="view-list"
      >
        <div
          :class="[
            'view-item',
            index + 1 === finalList.length ? 'last-child' : '',
            item.viewId == draft.viewId ? 'active' : '',
          ]"
          v-for="(item, index) in finalList"
          :key="index"
        >
          <div class="view-title">
            <span @click="handleViewSelect(item)">
              {{ item.viewTitle.slice(0, 20) }}{{ item.viewTitle.length > 20 ? "..." : "" }}
            </span>
            <div class="more" @click="handleDetail(item)">
              <span>详情</span>
              <img src="images/more-right.png" />
            </div>
          </div>
          <div class="creator-date">
            <span class="creator">{{ item.author }}</span>
            <span class="date">{{ item.submitDate }}</span>
          </div>
        </div>
      </van-list>
      <div v-if="loading && finalList.length === 0" class="view-list">
        <van-skeleton title :row="4" />
        <van-skeleton title :row="4" />
        <van-skeleton title :row="4" />
        <van-skeleton title :row="4" />
      </div>
    </template>
    <template #footer>
      <div class="draft" @click="handleDraftSave">
        <img src="images/draft-save.png" />
        <span>保存草稿</span>
      </div>
      <span class="btn" @click="handleNextStep">下一步</span>
    </template>
  </proposal-wrapper>
</template>

<script>
import ProposalWrapper from "./proposalWrapper.vue";
import { mapGetters, mapMutations } from "vuex";

export default {
  components: {
    ProposalWrapper,
  },
  data() {
    return {
      loading: false,
      finished: false,
      viewList: [], // 观点列表
      page: 1,
      pageSize: 6,
      tempId: 0, // 进入页面时的观点id,用来判断是否有更新
    };
  },
  computed: {
    ...mapGetters(["draft", "custNo"]),
    // 草稿中已选观点置顶
    finalList() {
      const { auditSearchViewVO } = this.draft;
      let list = [...this.viewList];
      if (auditSearchViewVO) {
        const index = list.findIndex((item) => item.viewId === auditSearchViewVO.viewId);
        if (index > -1) {
          list.splice(index, 1);
        }
        return [{ ...auditSearchViewVO }, ...list];
      } else {
        return list;
      }
    },
  },
  created() {
    if (this.draft.viewId) {
      this.tempId = this.draft.viewId;
    }
  },
  mounted() {
    this.handleLoad();
  },
  methods: {
    ...mapMutations("proposal", ["setDraft"]),
    // 加载观点列表
    handleLoad() {
      this.loading = true;
      const params = {
        pageNum: this.page,
        pageSize: this.pageSize,
        status: "approve",
      };
      this.$apiFwgx
        .findViews(params)
        .then(({ data }) => {
          if (data.success) {
            let { data: result } = data;
            if (this.page == 1) {
              this.viewList = [...result.rows];
              // 草稿中没有已选观点时,默认选中第一条观点
              if (!this.tempId) {
                const { viewId, version } = this.viewList[0];
                this.setDraft({
                  ...this.draft,
                  viewId,
                  viewVersion: version,
                });
              }
            } else {
              this.viewList = [...this.viewList, ...result.rows];
            }
            this.page += 1;
            if (result.rows.length < this.pageSize) {
              this.finished = true;
            }
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 选中观点
    handleViewSelect({ viewId, version }) {
      this.setDraft({
        ...this.draft,
        viewId,
        viewVersion: version,
      });
    },
    // 进入观点详情
    handleDetail(item) {
      this.$router.push(`/root/view/viewDetail?viewId=${item.viewId}&from=investmentAdvice`);
    },
    // 直接保存草稿退出
    handleDraftSave() {
      this.handleNextStep("temp");
    },
    // 下一步
    async handleNextStep(type) {
      if (this.tempId === this.draft.viewId) {
        this.$router.push("/root/assetAllocationProposal/investmentNeeds");
        return;
      }
      const view = this.finalList.find((item) => item.viewId === this.draft.viewId);
      const { viewId, version } = view;
      let draft = {
        ...this.draft,
        viewId,
        viewVersion: version,
        pageCode: 1,
        assetType: "0",
      };
      const flag = await this.handleDraftUpdate(draft);
      if (!flag) return;
      this.setDraft({
        ...draft,
        auditSearchViewVO: {
          ...view,
        },
      });
      if (type === "temp") {
        this.$router.push("/root/home");
      } else {
        this.$router.push("/root/assetAllocationProposal/investmentNeeds");
      }
    },
    // 更新草稿
    handleDraftUpdate(params) {
      return this.$apiFwgx.updateDraft(params).then(({ data }) => {
        if (data.success) {
          return true;
        }
        this.$toast.fail({
          message: data.retMsg,
          duration: 2000,
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.view-list {
  margin: 0 0.3rem;
  padding: 0.33rem 0.3rem 0.3rem 0.3rem;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.9) 0%,
    #ffffff 9%,
    rgba(255, 255, 255, 0.95) 100%
  );
  border-radius: 0.1rem;
  border: 0.02rem solid #ffffff;
  .view-item {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 6.3rem;
    // height: 2.13rem;
    padding: 0.3rem;
    margin-bottom: 0.2rem;
    background: #f8f9fa;
    border-radius: 0.06rem;
    &.active {
      padding: 0.29rem;
    }
    .view-title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.2rem;
      font-size: 0.32rem;
      font-weight: 500;
      color: #333333;
      line-height: 0.48rem;
      > span {
        width: 4.5rem;
      }
      .more {
        display: flex;
        align-items: center;
        font-size: 0.28rem;
        font-weight: 400;
        color: #007bf6;
        height: 0.48rem;
        line-height: 0.48rem;
        img {
          width: 0.28rem;
          height: 0.28rem;
          margin-left: 0.1rem;
        }
      }
    }
    .creator-date {
      font-size: 0.26rem;
      font-weight: 400;
      color: #999999;
      line-height: 0.37rem;
      .creator {
        margin-right: 0.4rem;
      }
    }
    &.last-child {
      margin-bottom: 0;
    }
    &.active {
      background: rgba(0, 123, 246, 0.05);
      border: 1px solid rgba(0, 123, 246, 0.3);
    }
  }
}
.draft {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1.4rem;
  img {
    width: 0.4rem;
    height: 0.4rem;
    margin-bottom: 0.1rem;
  }
  span {
    font-size: 0.2rem;
    font-weight: 400;
    color: #666666;
    line-height: 0.2rem;
  }
}
.btn {
  width: 5.7rem;
  height: 0.8rem;
  background: linear-gradient(90deg, #00aff6 0%, #007bf6 100%);
  border-radius: 0.46rem;
  font-size: 0.34rem;
  font-weight: 500;
  color: #ffffff;
  line-height: 0.8rem;
  text-align: center;
}
</style>
