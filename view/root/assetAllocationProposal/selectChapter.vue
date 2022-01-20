<template>
  <div class="select-chapter">
    <div class="page-header">
      <span class="page-title">选择报告章节</span>
      <span class="tip">如无需展示，取消勾选即可</span>
    </div>
    <div class="chapter-list">
      <div class="chapter-item" v-for="(item, index) in chapterList" :key="index">
        <img :src="getCheckIcon(item)" @click="handleChapterItemClick(item)" />
        <span class="chapter-name">{{ item.name }}</span>
      </div>
    </div>
    <div class="dynamic-info">
      <img src="images/tip.png" />
      <span class="dynamic text" v-show="isCheckAll">系统会自动生成业务介绍章节，</span>
      <span class="text">点击下一步，对</span>
      <span class="stable">投顾观点、客户投资需求、资产配置方案</span>
      <span class="text">进行录入。</span>
    </div>
    <div class="footer">
      <div class="check-all" @click="handleCheckAll">
        <img :src="require(`images/${isCheckAll ? 'checkedAll' : 'icon-radio-no'}.png`)" />
        <span class="text">全选</span>
      </div>
      <span class="btn" @click="handleNextStep">下一步</span>
    </div>
    <!-- 已存在草稿时的弹框 -->
    <draft-dialog
      v-model="showDialog"
      left-btn-name="加载草稿"
      right-btn-name="放弃并重新生成"
      :dialogStyle="{ width: '5.8rem' }"
      @left-click="handleDraftLoad"
      @right-click="handleDraftCreate"
      @hide="handleDraftHide"
    >
      <div class="load-draft">存在未完成的草稿，是否加载？</div>
    </draft-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import DraftDialog from "./draftDialog.vue";

export default {
  components: {
    DraftDialog,
  },
  data() {
    return {
      // 章节列表
      chapterList: [
        {
          name: "业务介绍",
          disabled: false,
          checked: true,
          id: "1",
        },
        {
          name: "投顾观点",
          disabled: true,
          checked: true,
          id: "2",
        },
        {
          name: "投资需求",
          disabled: true,
          checked: true,
          id: "3",
        },
        {
          name: "资产配置",
          disabled: true,
          checked: true,
          id: "4",
        },
      ],
      showDialog: false, // 已存在草稿时弹窗提示
      tempDraft: null, // 接口获取的最新草稿
    };
  },
  computed: {
    ...mapGetters(["draft", "custNo"]),
    // 全选按钮状态
    isCheckAll() {
      return this.chapterList.every((item) => item.checked);
    },
  },
  methods: {
    ...mapMutations("proposal", ["setDraft"]),
    // 获取各个章节选中状态
    getCheckIcon({ disabled, checked }) {
      if (disabled) {
        return require("images/check-disabled.png");
      } else if (checked) {
        return require("images/checkedAll.png");
      } else {
        return require("images/icon-radio-no.png");
      }
    },
    // 全选点击
    handleCheckAll() {
      this.chapterList.forEach((item) => {
        if (!item.disabled) {
          item.checked = !item.checked;
        }
      });
    },
    // 单个章节点击
    handleChapterItemClick(item) {
      if (!item.disabled) {
        item.checked = !item.checked;
      }
    },
    // 下一步
    async handleNextStep() {
      const draft = await this.handleDraftFind();
      if (draft === "1001") return; // 查询草稿接口报错
      if (draft) {
        this.showDialog = true;
        this.tempDraft = draft;
        return;
      }
      const flag = await this.handleDraftUpdate();
      if (!flag) return;
      this.$router.push("/root/assetAllocationProposal/investmentAdvice");
    },
    // 查询草稿
    handleDraftFind() {
      return this.$apiFwgx.findDraft({ custNo: this.custNo }).then(({ data }) => {
        if (data.success) {
          return data.data;
        }
        return "1001";
      });
    },
    // 创建、更新草稿(有参数params时表示更新否则表示创建)
    handleDraftUpdate(params) {
      let isCreate = false;
      if (!params) {
        isCreate = true;
        params = {
          assetType: "0",
          custNo: this.custNo,
          selectReport: this.chapterList.filter((item) => item.checked).map((item) => item.id),
          pageCode: 0,
        };
      }
      return this.$apiFwgx.updateDraft({ ...params }).then(({ data }) => {
        if (data.success) {
          if (isCreate) {
            this.setDraft({ id: data.data, ...params });
          } else {
            this.setDraft({ ...params });
          }
          return true;
        }
        this.$toast.fail({
          message: data.retMsg,
          duration: 2000,
        });
      });
    },
    // 加载草稿
    async handleDraftLoad() {
      const selectReport = this.chapterList
        .filter((item) => item.checked)
        .map((item) => item.id)
        .join("");
      const tempSelectReport = this.tempDraft.selectReport.join("");
      // 章节部分没有变化
      if (selectReport === tempSelectReport) {
        this.setDraft(this.tempDraft);
      } else {
        const flag = await this.handleDraftUpdate({
          ...this.tempDraft,
          selectReport: this.chapterList.filter((item) => item.checked).map((item) => item.id),
          pageCode: 0,
        });
        if (!flag) return;
      }
      this.showDialog = false;
      this.$router.push("/root/assetAllocationProposal/investmentAdvice");
    },
    // 放弃并重新生成草稿
    async handleDraftCreate() {
      const isDelete = await this.handleDraftDelete();
      if (!isDelete) return;
      const flag = await this.handleDraftUpdate();
      if (!flag) return;
      this.showDialog = false;
      this.$router.push("/root/assetAllocationProposal/investmentAdvice");
    },
    // 删除草稿
    async handleDraftDelete() {
      const params = {
        custNo: this.custNo,
        id: this.tempDraft.id,
      };
      return this.$apiFwgx.deleteDraft(params).then(({ data }) => {
        if (data.success) {
          return true;
        }
        this.$toast.fail({
          message: data.retMsg,
          duration: 2000,
        });
      });
    },
    // 点击遮罩层隐藏弹窗
    handleDraftHide() {
      this.showDialog = false;
    },
  },
};
</script>

<style lang="less" scoped>
.select-chapter {
  font-family: PingFangSC-Medium, PingFang SC;
  .page-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1rem;
    margin-bottom: 0.7rem;
    .page-title {
      margin-bottom: 0.16rem;
      font-size: 0.42rem;
      font-weight: 500;
      color: #333333;
      line-height: 0.59rem;
    }
    .tip {
      font-size: 0.28rem;
      font-weight: 400;
      color: #999999;
      line-height: 0.4rem;
    }
  }
  .chapter-list {
    .chapter-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 0.37rem 0 0.5rem;
      margin-bottom: 0.2rem;
      img {
        width: 0.4rem;
        height: 0.4rem;
        margin-right: 0.5rem;
      }
      .chapter-name {
        flex: 1;
        height: 1rem;
        padding-left: 0.5rem;
        background: #fafbfc;
        border-radius: 0.04rem;
        border: 0.01rem solid #e6e6e6;
        font-size: 0.28rem;
        font-weight: 400;
        color: #333333;
        line-height: 1rem;
      }
    }
  }
  .dynamic-info {
    margin-top: 0.8rem;
    padding: 0 0.5rem;
    font-size: 0.28rem;
    font-weight: 400;
    color: #999999;
    line-height: 0.48rem;
    img {
      width: 0.46rem;
      height: 0.46rem;
    }
    .stable {
      color: #333333;
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1.1rem;
    // box-shadow: 0px -1px 0px 0px #e6e6e6;
    border-top: 0.01rem solid #e6e6e6;
    padding: 0 0.4rem 0 0.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: env(safe-area-inset-bottom);
    .check-all {
      display: flex;
      align-items: center;
      img {
        width: 0.4rem;
        height: 0.4rem;
      }
      .text {
        margin-left: 0.2rem;
        font-size: 0.28rem;
        font-weight: 400;
        color: #666666;
      }
    }
    .btn {
      width: 4.5rem;
      height: 0.8rem;
      background: linear-gradient(90deg, #00aff6 0%, #007bf6 100%);
      border-radius: 0.46rem;
      font-size: 0.36rem;
      font-weight: 500;
      color: #ffffff;
      line-height: 0.8rem;
      text-align: center;
    }
  }
  .load-draft {
    font-size: 0.28rem;
    font-weight: 400;
    color: #666666;
    line-height: 0.42rem;
    text-align: center;
  }
}
</style>
