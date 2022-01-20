<template>
  <div class="view-list">
    <van-sticky>
      <div class="search">
        <van-search v-model="viewTitle" @input="onSearch" placeholder="输入观点标题" />
        <span class="cancel" @click="cancel">取消</span>
      </div>
      <div class="status">
        <van-tabs
          v-model="statusActive"
          color="#007bf6"
          title-active-color="#007BF6"
          @click="tabclick"
        >
          <van-tab title="全部"></van-tab>
          <van-tab title="待审核"></van-tab>
          <van-tab title="已上架"></van-tab>
        </van-tabs>
      </div>
    </van-sticky>
    <div class="content" id="content">
      <van-list
        :immediate-check="false"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        offset="20"
      >
        <div
          v-for="item in viewList"
          :key="item.viewId"
          class="view-content"
          @click="viewDetail(item.viewId)"
        >
          <p class="viewtitle">{{ item.viewTitle }}</p>
          <div class="footer">
            <div :class="handleClass(item.status)">{{ handleStatus(item.status) }}</div>
            <span class="author">{{ item.addUser }}</span>
            <span class="date">{{ item.modifyDate }}</span>
          </div>
          <div class="splint-line"></div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      viewTitle: "",
      viewList: [],
      status: sessionStorage.getItem("activeStatus") || "all", // 全部:all(不包括草稿),待审核:auditing,已上架:approve
      pageNum: 1,
      loading: false,
      finished: false,
    };
  },
  created() {
    this.onLoad();
  },
  computed: {
    ...mapGetters(["statusActive"]),
  },
  methods: {
    handleClass(status) {
      let className = "";
      if ("1" === status) {
        className = "pending";
      } else if (["2", "4", "5"].includes(status)) {
        className = "onshelf";
      } else if ("3" === status) {
        className = "reject";
      } else if ("6" === status) {
        className = "offshelf";
      }
      return className;
    },
    handleStatus(status) {
      let des = "";
      if ("1" === status) {
        des = "待审核";
      } else if (["2", "4", "5"].includes(status)) {
        des = "已上架";
      } else if ("3" === status) {
        des = "已驳回";
      } else if ("6" === status) {
        des = "已下架";
      }
      return des;
    },
    viewDetail(viewId) {
      this.$router.push(`/root/view/viewDetail?viewId=${viewId}&updateTip=true`);
    },
    initParams() {
      this.viewList = [];
      this.pageNum = 1;
      this.loading = false;
      this.finished = false;
    },
    onSearch() {
      this.initParams();
      this.onLoad();
    },
    cancel() {
      this.viewTitle = "";
    },
    tabclick(_, title) {
      let active = 0;
      this.status = "all";
      if (title === "待审核") {
        active = 1;
        this.status = "auditing";
      } else if (title === "已上架") {
        active = 2;
        this.status = "approve";
      }
      this.$store.commit("user/SETSTATEACTIVE", active);
      sessionStorage.setItem("activeStatus", this.status);
      this.initParams();
      this.onLoad();
    },
    onLoad() {
      this.loading = true;
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      const params = {
        pageNum: this.pageNum,
        pageSize: 10,
        status: this.status,
        viewTitle: this.viewTitle,
      };
      this.$apiFwgx.viewSearch(params).then(({ data }) => {
        const rows = data.data.rows;
        this.pageNum += 1;
        const totalNum = data.data.totalNum;
        rows.forEach((item) => {
          this.viewList.push({
            addUser: item.author, // 创建人
            modifyDate: item.submitDate, // 提交时间
            status: item.status, // 状态
            viewId: item.viewId, // 观点id
            viewTitle: item.viewTitle, // 标题
          });
        });
        this.loading = false;
        this.$toast.clear();
        if (this.viewList.length === totalNum) {
          this.finished = true;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.van-search {
  width: 6.04rem;
  height: 0.6rem;
  border-radius: 0.12rem;
  background-color: #f2f3f5;
  padding: 0 0;
  line-height: 0.6rem;
}
/deep/.van-search__content {
  background-color: #f2f3f5;
  height: 0.6rem;
}
/deep/.van-field__control {
  font-size: 0.28rem;
  font-weight: 400;
  color: #999999;
}
/deep/.van-field__left-icon {
  width: 0.25rem;
  height: 0.25rem;
}
/deep/ .van-tabs__line {
  width: 0.4rem !important;
}
/deep/ .van-sticky {
  border-bottom: 0.01rem solid #ebebeb;
}
/deep/ .van-tab__text {
  font-size: 0.28rem;
  font-weight: 500;
}
.pending {
  border-radius: 0.04rem;
  border: 1px solid rgba(231, 43, 43, 0.6);
  height: 0.3rem;
  font-size: 0.2rem;
  font-weight: 400;
  color: #e72b2b;
  margin-right: 0.2rem;
  display: flex;
  align-items: center;
  padding: 0 0.02rem;
}
.onshelf {
  border-radius: 0.04rem;
  border: 1px solid rgba(0, 123, 246, 0.6);
  height: 0.3rem;
  font-size: 0.2rem;
  font-weight: 400;
  color: #007bf6;
  margin-right: 0.2rem;
  display: flex;
  align-items: center;
  padding: 0 0.02rem;
}
.offshelf {
  border-radius: 0.04rem;
  border: 1px solid rgba(243, 95, 37, 0.6);
  height: 0.3rem;
  font-size: 0.2rem;
  font-weight: 400;
  color: #f35f25;
  margin-right: 0.2rem;
  display: flex;
  align-items: center;
  padding: 0 0.02rem;
}
.reject {
  border-radius: 0.04rem;
  border: 1px solid #cacbcc;
  height: 0.3rem;
  font-size: 0.2rem;
  font-weight: 400;
  color: #666;
  margin-right: 0.2rem;
  display: flex;
  align-items: center;
  padding: 0 0.02rem;
}
.view-list {
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.search {
  display: flex;
  align-items: center;
  width: 7.5rem;
  height: 0.88rem;
  padding: 0.14rem 0.3rem;
  background: #fff;
  .cancel {
    margin-left: 0.3rem;
    font-size: 0.28rem;
    font-weight: 400;
    color: #666666;
  }
}
.status {
  font-size: 0.28rem;
  z-index: 999;
  border-bottom: 1px solid #ebebeb;
}
.content {
  .view-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0.26rem 0.3rem 0 0.3rem;
  }
  .viewtitle {
    font-size: 0.32rem;
    font-weight: 400;
    color: #000000;
    line-height: 0.48rem;
    text-align: left;
    margin-bottom: 0.2rem;
  }
  .footer {
    display: flex;
    margin-bottom: 0.27rem;
    align-items: center;
    .type {
      width: 0.8rem;
      height: 0.3rem;
      border-radius: 0.04rem;
      opacity: 0.3;
      margin-right: 0.2rem;
      font-size: 0.2rem;
    }
    .author,
    .date {
      font-size: 0.24rem;
      height: 0.33rem;
      font-weight: 400;
      color: #999999;
      line-height: 0.33rem;
    }
    .date {
      margin-left: auto;
    }
  }
  .splint-line {
    width: 6.9rem;
    height: 1px;
    background: #ebebeb;
    opacity: 0.5;
  }
}
</style>
