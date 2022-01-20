<template>
  <div class="viewDetail">
    <div class="tip" v-if="status === '2' && updateTip" @click="changeBefore">
      <span v-show="!changeBeforeFlag"
        >此观点已更新，需审批后生效，点击查看更新前内容<van-icon name="arrow"
      /></span>
      <span v-show="changeBeforeFlag"><van-icon name="arrow-left" />点击查看更新后内容</span>
    </div>
    <div class="content">
      <div class="viewTitle" v-if="status === '2'">
        {{ changeBeforeFlag ? viewTitle : updateViewTitle }}
      </div>
      <div v-else class="viewTitle">{{ viewTitle }}</div>
      <div class="author">
        <span class="adduser">{{ author }}</span>
        <span>{{ submitDate }}</span>
      </div>
      <div
        class="viewContent"
        v-if="status === '2'"
        v-html="changeBeforeFlag ? viewContent : updateViewContent"
      ></div>
      <div class="viewContent" v-else v-html="viewContent"></div>
    </div>
    <div class="footer" v-if="!['3', '6'].includes(status)">
      <template v-if="['investmentAdvice'].includes(from)">
        <div class="reject" @click="handleGoback">返回</div>
        <div class="pass" @click="handleConfirm">确认选择</div>
      </template>
      <template v-else-if="['1', '2'].includes(status) && !changeBeforeFlag">
        <div class="reject" @click="reject">审核驳回</div>
        <div class="pass" @click="pass">审核通过</div>
      </template>
      <template v-else-if="['4', '5'].includes(status) || changeBeforeFlag">
        <div class="offShelf" @click="remove">下架</div>
      </template>
    </div>
    <OperationDialog ref="operationDialog" />
    <van-overlay :show="overlayShow" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import OperationDialog from "./operationDialog.vue";
import { Toast } from "vant";
export default {
  components: { OperationDialog },
  data() {
    return {
      viewTitle: "", // 标题/已上架的标题
      viewContent: "", // 观点正文/已上架的观点内容
      submitDate: "", // 提交时间
      author: "", // 添加用户
      updateViewTitle: "", // 更新后观点标题
      updateViewContent: "", // 更新后观点正文
      status: "", // 状态
      show: true,
      overlayShow: false,
      view: null,
      changeBeforeFlag: false,
    };
  },
  computed: {
    ...mapGetters(["draft"]),
    viewId() {
      return this.$route.query.viewId;
    },
    updateTip() {
      return this.$route.query.updateTip;
    },
    //页面来源
    from() {
      return this.$route.query.from;
    },
  },
  created() {
    this.getDetail();
  },
  mounted() {
    this.$EventBus.$on("define", (type) => {
      let message = "观点已下架";
      if (type === "reject") {
        message = "观点已驳回";
      }
      Toast({
        message,
        overlay: true,
        duration: 2000,
      });
      this.$router.push("/root/view/search"); // 审核完观点，自动跳转到观点列表中
    });
  },
  methods: {
    changeBefore() {
      this.changeBeforeFlag = !this.changeBeforeFlag;
    },
    ...mapMutations("proposal", ["setDraft"]),
    async getDetail() {
      const api = ["investmentAdvice"].includes(this.from) ? "findViewDetail" : "viewDetail";
      const { data } = await this.$apiFwgx[api]({ viewId: this.viewId });
      const res = data.data;
      this.viewTitle = res.viewTitle;
      this.viewContent = res.viewContent;
      this.submitDate = res.submitDate;
      this.author = res.author;
      this.updateViewTitle = res.updateViewTitle;
      this.updateViewContent = res.updateViewContent;
      this.status = res.status;
      this.view = res;
    },
    pass() {
      this.$apiFwgx.viewApprove({ viewId: this.viewId }).then(({ data }) => {
        if (data.success) {
          this.$toast({
            type: "success",
            message: "观点审核通过，已上架",
            overlay: true,
            duration: 2000,
            onClose: () => {
              this.$router.push("/root/view/search"); // 审核完观点，自动跳转到观点列表中
            },
          });
        }
      });
    },
    reject() {
      this.$refs.operationDialog.show("reject", this.viewId);
    },
    remove() {
      this.$refs.operationDialog.show("remove", this.viewId);
    },
    handleGoback() {
      this.$router.go(-1);
    },
    // 选择观点
    async handleConfirm() {
      if (this.viewId === this.draft.viewId) {
        this.$router.replace("/root/assetAllocationProposal/investmentNeeds");
        return;
      }
      let draft = {
        ...this.draft,
        viewId: this.view.viewId,
        viewVersion: this.view.version,
        pageCode: 1,
        assetType: "0",
      };
      const flag = await this.handleDraftUpdate(draft);
      if (!flag) return;
      this.setDraft({
        ...draft,
        auditSearchViewVO: {
          ...this.view,
        },
      });
      this.$router.replace("/root/assetAllocationProposal/investmentNeeds");
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
.viewDetail {
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  .tip {
    margin-bottom: 0.47rem;
    background: #e5f1fe;
    height: 0.8rem;
    font-size: 0.28rem;
    font-weight: 400;
    color: #35528e;
    line-height: 0.8rem;
    display: flex;
    justify-content: center;
  }
  .content {
    padding: 0 0.3rem 0.6rem 0.3rem;
    background: #fff;
    .viewTitle {
      margin-top: 0.2rem;
      text-align: left;
      font-size: 0.44rem;
      font-weight: 500;
      color: #333333;
      line-height: 0.7rem;
    }
    .author {
      margin-top: 0.2rem;
      height: 0.42rem;
      font-size: 0.28rem;
      font-weight: 400;
      color: #999999;
      line-height: 0.42rem;
      .adduser {
        margin-right: 0.4rem;
      }
    }
    .viewContent {
      margin-top: 0.66rem;
      margin-bottom: 0.3rem;
    }
  }

  .footer {
    border-top: 1px solid #ebebeb;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1.1rem;
    padding: 0.15rem 0.4rem;
    display: flex;
    align-items: center;
    background: #fff;
    .reject {
      width: 3.25rem;
      height: 0.8rem;
      line-height: 0.8rem;
      text-align: center;
      border-radius: 0.46rem;
      opacity: 0.7;
      border: 1px solid #007bf6;
      font-size: 0.32rem;
      font-weight: 500;
      color: #007bf6;
      background: #fff;
    }
    .pass {
      width: 3.25rem;
      height: 0.8rem;
      line-height: 0.8rem;
      text-align: center;
      border-radius: 0.46rem;
      background: linear-gradient(90deg, #00aff6 0%, #007bf6 100%);
      font-size: 0.32rem;
      font-weight: 500;
      color: #fff;
      margin-left: 0.2rem;
    }
    .offShelf {
      width: 6.7rem;
      height: 0.8rem;
      line-height: 0.8rem;
      text-align: center;
      background: linear-gradient(90deg, #00aff6 0%, #007bf6 100%);
      border-radius: 0.46rem;
      font-size: 0.34rem;
      font-weight: 500;
      color: #ffffff;
    }
  }
}
</style>

<style lang="less">
.viewContent {
  margin-top: 0.66rem;
  padding-bottom: 0.6rem;
  p {
    font-size: 0.34rem;
    font-weight: 400;
    color: #333333;
    line-height: 0.6rem;
  }
  h1 {
    font-size: 0.4rem;
    font-weight: 500;
    color: #2e2f33;
    line-height: 0.56rem;
    margin-bottom: 0.48rem;
  }
  h1:nth-child(n + 1) {
    margin-top: 0.68rem;
  }
  h2 {
    font-size: 0.36rem;
    font-weight: 500;
    color: #2e2f33;
    line-height: 0.5rem;
    margin-bottom: 0.3rem;
  }
  li,
  h3 {
    font-size: 0.34rem;
    font-weight: 500;
    line-height: 0.48rem;
    margin-bottom: 0.3rem;
  }
  img {
    max-width: 100%;
  }
}
</style>
