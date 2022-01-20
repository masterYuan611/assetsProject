<template>
  <div class="warp">
    <!-- 搜索框 -->
    <div class="search">
      <Search />
    </div>
    <!-- 轮播图banner -->
    <div class="banner" v-for="(item, index) in bannerList" :key="index">
      <img class="bannerimg" @click.prevent="toPreview(item)" v-lazy="item.img" />
      <!-- 一期暂时不做轮播组件 -->
      <!-- <van-swipe
          class="my-swipe"
          :autoplay="5000"
          indicator-color="white"
          :stop-propagation="false"
        >
          <van-swipe-item v-for="(item, index) in bannerList" :key="index">
            <img class="bannerimg" @click.prevent="toPreview(item)" v-lazy="item.img" />
          </van-swipe-item>
        </van-swipe> -->
    </div>
    <!-- 五个icon模块 -->
    <div class="tabicon">
      <dl v-for="item in functionList" :key="item.id" @click="toPage(item)">
        <dt v-if="item.show">
          <img
            v-lazy="item.icon"
            style="
              width: 0.72rem;
              height: 0.72rem;
              position: absolute;
              top: 50%;
              left: 50%;
              margin-top: -0.36rem;
              margin-left: -0.36rem;
            "
          />
        </dt>
        <dd v-if="item.show">{{ item.name }}</dd>
      </dl>
    </div>
    <!-- <div class="statusList"></div> -->
    <!-- 客户动态 --有数据> -->

    <div class="custonstatus">
      <div class="status_title">
        <i class="title1">客户动态</i>
        <p>
          <img
            src="images/custonstatus_go.png"
            class="tostatus"
            @click="gotostatus"
            v-show="showicon"
          />
        </p>
      </div>
      <!-- 一期不展示 -->
      <!-- 客户动态有数据时 -->
      <div
        class="statusList"
        v-show="showdata"
        v-for="item in statusList"
        :key="item.id"
        @click="gotochoosecuston(item)"
      >
        · {{ item.text }}
      </div>

      <!-- 客户动态无数据时 -->
      <div class="no-statusList" v-show="nodata">
        <img src="images/nostatus.png" alt="" />
        <div class="nostatus">暂无客户动态</div>
      </div>
    </div>
  </div>
</template>

<script>
import Search from "ui/home_search.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    Search,
  },
  data() {
    return {
      bannerList: [
        {
          img: require("images/banner.png"),
          id: 0,
        },
      ],
      functionList: [
        {
          name: "账户诊断",
          icon: require("images/account.png"),
          id: 0,
          show: true,
        },
        {
          name: "AI资配工具",
          icon: require("images/assetAllocation.png"),
          id: 1,
          show: true,
        },
        {
          name: "资配建议书",
          icon: require("images/product_list.png"),
          id: 2,
          show: true,
        },
        {
          name: "历史报告",
          icon: require("images/history_report.png"),
          id: 3,
          show: true,
        },
        //超级管理员可见
        {
          name: "业绩统计",
          icon: require("images/summary.png"),
          id: 4,
          show: false,
        },
        //超级管理员可见
        {
          name: "观点审核",
          icon: require("images/view.png"),
          id: 5,
          show: true,
        },
      ],
      statusList: [], //动态列表
      showdata: false,
      showicon: false,
      nodata: false,
      custoN: "",
      hreh: "",
    };
  },
  computed: {
    ...mapGetters(["maxRole", "roleCodes"]),
  },
  created() {
    console.log("打印maxRole", this.maxRole, "++:", this.roleCodes);
  },
  mounted() {
    //一期不展示
    this.getstatus();
    this.isAdminUser();
  },
  methods: {
    // 点击轮播图跳转相应的页面
    toPreview(item) {
      switch (item.id) {
        case 0:
          this.$light.navigate("root/assetIntroduce");
          break;
        // case 1:
        //   this.$light.navigate("/root/assetAllocation/assetAllocation");
        //   break;
      }
    },
    // 是否是管理员
    isAdminUser() {
      console.log("管理员1", this.$store.getters);
      let newArr = [];
      this.roleCodes.forEach((item) => {
        // newArr.push(Object.values(item)[0]);
        newArr.push(item);
      });
      let biaoshi = newArr.findIndex((item) => {
        return item == "1001";
      });
      if (biaoshi != -1) {
        this.functionList[4].show = true;
        this.functionList[5].show = true;
      }
      // if (this.maxRole == "1001") {
      //   this.functionList[4].show = true;
      //   this.functionList[5].show = true;
      // }
    },
    //一期不展示
    //获取客户动态列表
    getstatus() {
      this.$apiFwgx
        .getHomeStatusList({
          Authorization: "",
        })
        .then((data) => {
          console.log("客户列表", data);
          this.statusList = data.data.data.rows;
          if (data.data.data.rows.length == 0) {
            this.nodata = true;
            this.showdata = false;
            this.showicon = false;
          } else {
            this.showdata = true;
            this.showicon = true;
            this.statusList = data.data.data.rows;
            this.nodata = false;
          }
          // if (!data || data.data.data == null) {
          //   this.showdata = false;
          //   this.showicon = false;
          // } else {
          //   this.showdata = true;
          //   this.showicon = true;
          //   this.statusList = data.data.data;
          //   this.nodata = false;
          // }
        });
    },
    // 点击右箭头去到客户动态页面
    gotostatus() {
      this.$light.navigate("root/customerSatatus");
    },

    // 点击客户动态进入客户详情——基本信息页面
    gotochoosecuston(item) {
      sessionStorage.setItem("custNo", item.custNo);
      this.$router.push(`/root/customerDetail`);
    },
    // 功能按钮页面跳转
    toPage(item) {
      // console.log(item)
      switch (item.id) {
        case 0:
          this.$light.navigate("/root/accountDiagnose/chooseCustomer?type=1");
          break;
        case 1:
          this.$light.navigate("root/customerDetail/configurationPlan");
          break;
        case 2:
          this.$light.navigate("/root/accountDiagnose/chooseCustomer?type=2"); // type:1表示账户诊断2表示资配建议书
          break;
        case 3:
          this.$light.navigate("/root/historyReport/historyReport?type=3");
          break;
        case 4:
          this.$toast({
            message: "敬请期待",
          });
          setInterval(() => {
            this.$toast.clear();
          }, 3000);
          break;
        case 5:
          this.$light.navigate("root/view/search");
          break;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.warp {
  margin: 0;
  padding: 0;
  width: 6.9rem;
  background: linear-gradient(180deg, #ffffff, #f5f6f7);
  padding: 0 0.3rem;
}
.main {
  width: 6.9rem;
  height: 100%;
  padding: 0 0.3rem;
}

.search {
  padding: 0.14rem 0;
  height: 0.64rem;
}

/* 轮播图 */
.banner {
  width: 6.9rem;
  height: 2.2rem;
  margin-top: 0.2rem;
  .my-swipe {
    width: 6.9rem;
    height: 2.2rem;
    .van-swipe__track {
      width: 6.9rem !important;
      transition-duration: 500ms;
      transform: translateX(-690 px);
      height: 100%;
      // overflow: hidden;
      .van-swipe-item {
        width: 6.9rem !important;
        height: 100%;
        color: #fff;
        text-align: center;
        overflow: hidden;
        // background-color: #39a9ed;
        img {
          width: 6.9rem;
          height: 2.2rem;
        }
      }
    }
  }
}

// .van-swipe-item {
//   width: 6.9rem;
//   height: 2.2rem;
//   color: #fff;
//   font-size: 0.2rem;
//   line-height: 2.2rem;
//   text-align: center;
//   // overflow: hidden;
//   position: relative;
// }
.bannerimg {
  display: block;
  width: 100%;
  height: 100%;
}
// .my-swipe {
//   width: 6.9rem;
//   height: 2.2rem;
// }
.tabicon {
  margin-top: 0.1rem;
  width: 6.9rem;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0.4rem;
}
dl {
  // height: 1.24rem;
  width: 1.725rem;
  float: left;
  margin-top: 0.3rem;
  dt {
    width: 1.725rem;
    height: 0.72rem;
    position: relative;
  }
  dd {
    margin-top: 0.15rem;
    width: 1.725rem;
    height: 0.37rem;
    font-size: 0.26rem;
    font-weight: 400;
    text-align: center;
    color: #666666;
    line-height: 0.37rem;
  }
}
// .statusList {
//   width: 6.9rem;
//   height: 6.28rem;
//   background: #ffffff;
//   border-radius: 0.12rem;
//   border: 1px solid #ebeced;
//   div {
//     margin-top: 0.4rem;
//     width: 6.9rem;
//     height: 0.4rem;
//     font-size: 0.28rem;
//     font-weight: 400;
//     color: #333333;
//     line-height: 0.4rem;
//   }
// }
/* 客户动态 */
.custonstatus {
  height: 6.03rem;
  margin-top: 0.4rem;
  padding: 0.4rem 0.3rem 0 0.3rem;
  position: relative;
  background: #ffffff;
  border: 1px solid #ebeced;
  border-radius: 0.12rem;
  .status_title {
    height: 0.48rem;
    display: flex;
    justify-content: space-between;
  }
  .title1 {
    font-style: normal;
    display: block;
    height: 100%;
    font-size: 0.32rem;
    font-weight: bold;
    text-align: left;
    color: #383838;
    line-height: 0.48rem;
  }

  p {
    width: 0.32rem;
    height: 0.32rem;
    margin: 0.08rem 0.08rem 0 0;
    position: relative;
  }
  .tostatus {
    display: block;
    width: 0.26rem;
    height: 0.26rem;
    position: absolute;
    left: 0.02rem;
    top: 0.02rem;
  }
  /* 客户动态最新的5条列表 */
  .statusList {
    height: 0.4rem;
    margin-top: 0.4rem;
    font-size: 0.28rem;
    font-weight: 400;
    text-align: justify;
    color: #333333;
    line-height: 0.4rem;
    width: 6.3rem;
    background: #ffffff;
    // div {
    //   margin-top: 0.4rem;
    //   height: 0.4rem;
    //   font-size: 0.28rem;
    //   font-weight: 400;
    //   color: #333333;
    //   line-height: 0.4rem;
    // }
  }
  .no-statusList {
    width: 4.4rem;
    height: 3.2rem;
    position: absolute;
    left: 1.25rem;
    top: 2.43rem;
    font-size: 0.28rem;
    font-weight: 400;
    color: #333333;
    line-height: 0.4rem;
    text-align: center;
    img {
      width: 100%;
      height: 2.8rem;
      display: block;
    }
  }
  .nostatus {
    height: 0.4rem;
    line-height: 0.4rem;
    text-align: center;
    color: #999999;
    font-size: 0.28rem;
    font-weight: 400;
  }
}
.list {
  height: 0.4rem;
}
/deep/ .van-toast {
  position: fixed;
  top: 43%;
  left: 80%;
}
</style>
