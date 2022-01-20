<template>
  <div class="warpp">
    <!-- 搜索组件 -->
    <div class="check">
      <!-- 搜索框 -->
      <div class="seacrh-input">
        <form action="/" style="display: block">
          <van-search
            v-model="value"
            placeholder="客户姓名/手机号/资金账号"
            style="font-size: 0.28rem"
            maxlength="50"
            @clear="clear"
            @search="search"
            @input="input"
            ref="vanSearch"
            ><template #left-icon>
              <van-image
                src="images/search-icon.png"
                alt=""
                width="0.28rem"
                height="0.28rem"
                style=""
              />
            </template>
          </van-search>
        </form>
      </div>
      <!-- <div class="cance-text" @click="$router.back(-1)">取消</div> -->
      <div class="cance-text" @click="goreturn">取消</div>
    </div>

    <!-- 输入姓氏关键字搜索有搜索结果时 -->
    <!-- 当搜索有匹配的结果时 -->
    <div class="namekey" v-show="showmatchdata" v-if="value">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <div
          class="key-list"
          v-for="(item, index) in serchList"
          :key="(item, index)"
          @click.stop="handleselect(item)"
        >
          <span class="searchname" v-html="getName(item.custNm)" v-if="item.custNm"></span>
          <span class="searchnum" v-html="getNum(item.custTel)" v-if="item.custTel"></span>
          <span class="searchnum" v-html="getNo(item.custNo)" v-if="item.custNo"></span>
        </div>
      </van-list>
    </div>
    <!-- 当搜索无匹配结果时 && 输入手机号关键字搜索有搜索结果时 -->
    <div class="nodata" v-show="Nomatchdata" style="height: calc(100vh - 0.88rem)">
      <div class="Nosearchdata">
        <img src="images/noseacrch.png" alt="" />
        <div class="word">没有匹配的客户</div>
      </div>
    </div>

    <div style="padding: 0 0.3rem">
      <!-- 搜索记录 -->
      <div class="search-record" v-show="showhistory" v-if="this.historyArray.length > 0">
        <div class="record">搜索记录</div>
        <img src="images/icon-delete.png" alt="" class="delete" @click="deleteRecode" />
        <!-- 搜索记录列表 -->
        <div class="record-list">
          <ul>
            <li v-for="tag in historyArray" :key="tag" @click="select(tag)">{{ tag }}</li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 客户四要素检查 -->
    <Dialog ref="myDialog"></Dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import Dialog from "../../ui/dialog.vue";

export default {
  components: { Dialog },
  data() {
    return {
      value: "",
      value1: "",
      value2: "",
      value3: "",
      leave: false,
      vshowText: true,
      historyArray: [],
      historyArray1: [],
      historyArray2: [],
      historyArray3: [],
      serchname: false, //按名字关键字搜索
      serchnumber: false, //按手机号搜索
      serchList: [],
      isFocused: false, //是否聚焦
      Nomatchdata: false, //无匹配结果
      showmatchdata: false, //有匹配结果
      showhistory: true, //搜索历史框
      loading: false,
      finished: false,
      list: [],
      page: 1,
      pageSize: 10,
    };
  },
  computed: {
    ...mapGetters(["isInvestmentAdvisor"]),
    type() {
      return this.$route.query.type;
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      let type = vm.$route.query.type;
      // 通过 `vm` 访问组件实例,将值传入oldUrl
      vm.oldUrl = from.path;
      if (
        vm.oldUrl == "/root/home" ||
        vm.oldUrl == "root/customerDetail/conclusion" ||
        vm.oldUrl == "/root/customerDetail/baseMessage"
      ) {
        vm.$flag = true;
      } else if (
        vm.oldUrl == "/root/historyReport/historyReport" ||
        vm.oldUrl == "/root/historyReport/custonHistoryReport"
      ) {
        vm.$flag = false;
      }

      // TODO 注释了130行
      let data = "";
      if (type == "1" || type == "4") {
        data = localStorage.getItem("value1");
        vm.$refs.vanSearch.getElementsByTagName("input")[0].focus();
      }
      if (type == "2") {
        data = localStorage.getItem("value2");
        vm.$refs.vanSearch.getElementsByTagName("input")[0].focus();
      }
      if (type == "3") {
        data = localStorage.getItem("value3");
        vm.$refs.vanSearch.getElementsByTagName("input")[0].focus();
      }
      if (data) {
        data = JSON.parse(data);
        if (data.length > 15) {
          vm.historyArray = data.slice(0, 15);
        } else {
          vm.historyArray = data;
        }
      }

      // vm.id = vm.$store.getters.roleAuth.userId;
      // let data = localStorage.getItem("value");
      // 根据用户id取历史记录
      // if (data) {
      //   data = JSON.parse(data);
      //   if (data.length > 15) {
      //     vm.historyArray = data.slice(0, 15);
      //   } else {
      //     vm.historyArray = data;
      //   }
      // }
      //  如果是详情页面返回结果页，要带出搜索结果
      if (
        vm.oldUrl == "root/home" ||
        vm.oldUrl == "root/accountDiagnose/chooseCustomer" ||
        vm.oldUrl == "/root/historyReport/historyReport"
      ) {
        // vm.vshowResult = true;
        // vm.value = vm.historyArray[0];
        vm.$refs.vanSearch.getElementsByTagName("input")[0].focus();
      } else {
        // 自动获取焦点
        // vm.$refs.vanSearch.getElementsByTagName("input")[0].focus();
      }
    });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    window.pageYOffset = 0;
  },

  mounted() {
    if (this.type == "1" || this.type == "4") {
      this.historyArray = localStorage.getItem("value1")
        ? JSON.parse(localStorage.getItem("value1"))
        : [];
    }
    if (this.type == "2") {
      this.historyArray = localStorage.getItem("value2")
        ? JSON.parse(localStorage.getItem("value2"))
        : [];
    }
    if (this.type == "3") {
      this.historyArray = localStorage.getItem("value3")
        ? JSON.parse(localStorage.getItem("value3"))
        : [];
    }
  },
  methods: {
    //根据入口不一样，点击取消按钮返回不一样
    goreturn() {
      //从账户诊断进来
      if (this.type == "1") {
        this.$light.navigate("/root/accountDiagnose/chooseCustomer?type=1");
      } else if (this.type == "2") {
        this.$light.navigate("/root/accountDiagnose/chooseCustomer?type=2"); //从建议书进来
      } else if (this.type == "3") {
        this.$light.navigate("root/historyReport/historyReport"); //从历史报告进来
      } else if (this.type == "4") {
        this.$light.navigate("root/home"); //从首页进来
      }
    },
    ...mapMutations("proposal", ["setCustNo"]),
    // 请求模糊搜索接口
    getInfoList() {
      console.log("pagenum:", this.page, "pageSize:", this.pageSize);
      return this.$apiFwgx
        .getSearchList({
          keyword: this.value,
          pageSize: this.pageSize,
          pageNum: 1,
        })
        .then((data) => {
          if (data.data.data.rows.length == 0) {
            this.Nomatchdata = true;
            this.showmatchdata = false;
          } else {
            this.finished = false;
            this.serchList = data.data.data.rows;
            if (data.data.data.rows.length < 10) {
              this.finished = true;
            }
            this.showmatchdata = true;
          }
        });
    },
    onLoad() {
      // 异步更新数据

      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        this.$apiFwgx
          .getSearchList({
            keyword: this.value,
            pageSize: 10,
            pageNum: (this.page += 1),
          })
          .then((data) => {
            console.log("下拉加载", data);
            if (data.data.data.rows.length != 0) {
              let arr = data.data.data.rows;
              arr.forEach((item) => {
                this.serchList.push(item);
              });
              // this.serchList = data.data.data.rows;
            } else {
              this.finished = true;
            }
            this.loading = false;
            // if (this.serchList.length == 0) {

            // }
            // if(let i= 0; i < data.data.rows.length;i++){
            //   this.list.push(this.list.length + 1);
            // }
          });
        // 加载状态结束
        //   // 数据全部加载完成
      }, 500);
    },
    //点击搜索框清空value图标
    clear() {
      this.showhistory = true;
      this.showmatchdata = false;
      this.Nomatchdata = false;
    },
    //聚焦时
    handleFocus() {
      this.isFocused = true;
      this.showmatchdata = false;
    },
    //失去焦点后
    handleBlur() {
      setTimeout(() => {
        this.isFocused = false;
      }, 0);
    },
    //特殊字符处理
    isEmoji(val) {
      const emojiRe =
        /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/i;
      return emojiRe.test(val);
    },
    // 去掉全部空格
    Trim(str, is_global) {
      var result;
      result = str.replace(/(^\s+)|(\s+$)/g, "");
      if (is_global.toLowerCase() == "g") {
        result = result.replace(/\s/g, "");
      }
      return result;
    },

    //历史记录列表去掉空格
    getRegExp(s) {
      var pattern = new RegExp("[`%~!@#$^&*={};,\\./?~！@#￥……&*{}；。，、？↵\r\n]");
      var rs = "";
      for (var i = 0; i < s.length; i++) {
        rs = rs + s.substr(i, 1).replace(pattern, "");
      }
      return rs;
    },
    // 输入关键字按下回车键或者搜索时请求搜索接口
    search() {
      if (!this.value) {
        this.goreturn();
      }
      // this.value = this.Trim(this.value, "g");
      // if (!this.value) {
      //   this.showhistory = true;
      //   this.Nomatchdata = false;
      // }
      // if (this.value.length == 0) {
      //   this.Nomatchdata = true;
      // }
      // if ((this.value.trim() == "" && this.value.length > 0) || this.isEmoji(this.value)) {
      //   this.Nomatchdata = true;
      //   return;
      // } else {
      //   // this.getInfoList();

      //   setTimeout(() => {
      //     this.getInfoList();
      //   }, 500);
      // }

      setTimeout(() => {
        //假如输入是空格 ，回车或者搜索都不会保留历史记录
        this.value = this.getRegExp(this.value);
        if (this.value == "") {
          return;
        }
        if (this.leave) {
          return;
        }
        // 去掉重复的词，并录入最新的词
        if (this.historyArray) {
          this.historyArray.forEach((v, index) => {
            if (this.value == v) {
              this.historyArray.splice(index, 1);
            }
          });
        }
        this.historyArray.unshift(this.value);
        this.historyArray = this.historyArray.slice(0, 15);
        this.saveSearchHistory();
        //二期 点击搜索把数据带去客户选择页面
        if (this.type == "1" || this.type == "4") {
          this.$light.navigate(
            `root/accountDiagnose/chooseCustomer?pageNum=1&pageSize=10&keyword=${this.value}&word=11&type=1`,
          );
        } else if (this.type == "2") {
          this.$light.navigate(
            `root/accountDiagnose/chooseCustomer?pageNum=1&pageSize=10&keyword=${this.value}&word=22&type=2`,
          );
        } else if (this.type == "3") {
          this.$light.navigate(
            `root/historyReport/historyReport?&keyword=${this.value}&word=33&type=3`,
          );
        }
      }, 0);
    },

    //输入的值实时匹配
    input() {
      this.showhistory = false;
      if (!this.value) {
        this.showhistory = true;
        this.Nomatchdata = false;
      }
      if ((this.value.trim() == "" && this.value.length > 0) || this.isEmoji(this.value)) {
        this.Nomatchdata = true;
        return;
      } else {
        //实时输入后500毫秒之后再请求模糊匹配接口
        setTimeout(() => {
          this.getInfoList();
        }, 200);
      }
    },
    // 点击搜索接口进行跳转
    async handleselect(item) {
      window.scrollTo(0, 0);
      if (this.$flag) {
        // type: 1账户诊断 type:2资配建议书
        if (this.type === "2") {
          this.setCustNo(item.custNo);
          const flag = await this.getRiskAssessment(item.custNo);
          if (!flag) return;
          this.handleCustomElementcheck(item.custNo);
          return;
        }
        sessionStorage.setItem("custNo", item.custNo);
        this.$light.navigate(`root/customerDetail/baseMessage`);
      } else {
        this.$light.navigate(
          `root/historyReport/custonHistoryReport?id=${item.custNo}&name=${item.custNm}`,
        );
      }
    },
    // 选择搜索历史搜索
    select(value) {
      this.value = value;
      this.$refs.vanSearch.getElementsByTagName("input")[0].focus();

      this.getInfoList();
      this.showhistory = false;
      // 去掉重复的词，并录入最新的词
      if (this.historyArray) {
        this.historyArray.forEach((v, index) => {
          if (value == v) {
            this.historyArray.splice(index, 1);
          }
        });
      }
      this.historyArray.unshift(value);
    },
    // 保存搜索记录
    saveSearchHistory() {
      if (this.historyArray.length > 0) {
        let data = JSON.stringify(this.historyArray);
        if (this.type == "1" || this.type == "4") {
          localStorage.setItem("value1", data);
        }
        if (this.type == "2") {
          localStorage.setItem("value2", data);
        }
        if (this.type == "3") {
          localStorage.setItem("value3", data);
        }
      }
    },
    // 点击删除搜索记录按钮
    deleteRecode() {
      this.historyArray = [];
      if (this.type == "3") {
        localStorage.setItem("value1", "[]");
      }
      if (this.type == "4") {
        localStorage.setItem("value2", "[]");
      }
      if (this.type == "5") {
        localStorage.setItem("value3", "[]");
      }
    },

    // 搜索名字高亮
    getName(custNm) {
      var isChinese = new RegExp("[\u4E00-\u9FA5]+");
      if (isChinese.test(this.value) && custNm) {
        return custNm.replace(
          new RegExp(this.value, "g"),
          `<span style="color: #007BF6">${this.value}</span>`,
        );
      } else {
        return custNm;
      }
    },
    //根据手机号搜索高亮
    getNum(custTel) {
      var isNum = new RegExp("^[0-9-]+");
      if (isNum.test(this.value) && custTel) {
        return custTel.replace(
          new RegExp(this.value, "g"),
          `<span style="color: #007BF6">${this.value}</span>`,
        );
      } else {
        return custTel;
      }
    },
    //根据资金账号搜索高亮
    getNo(custNo) {
      var isNum = new RegExp("^[0-9-]+");
      if (isNum.test(this.value) && custNo) {
        return custNo.replace(
          new RegExp(this.value, "g"),
          `<span style="color: #007BF6">${this.value}</span>`,
        );
      } else {
        return custNo;
      }
    },
    // 查看客户风险评测信息
    getRiskAssessment(custNo) {
      return this.$apiFwgx.getRiskAssessment({ custNo }).then(({ data }) => {
        if (data.success) {
          const { userRiskAssessmentStatus, riskLvl2 } = data.data;
          if (riskLvl2 === "C1") {
            this.$toast.fail({
              message: "C1级别的客户不可提供资产配置建议书",
              duration: 2000,
            });
            return;
          }
          if (!userRiskAssessmentStatus) {
            this.$toast.fail({
              message: "客户未做风险测评或已过期，无法生成资产配置建议书",
              duration: 2000,
            });
            return;
          }
          return true;
        }
      });
    },
    // 客户四要素检查
    handleCustomElementcheck(custNo) {
      if (!this.isInvestmentAdvisor) {
        this.$apiFwgx.customElementcheck({ custNo }).then(({ data }) => {
          const res = data.data;
          if (!res.result && res.msg) {
            this.$toast.fail({
              message: res.msg,
              duration: 2000,
            });
            return;
          }
          if (!res.result) {
            let checkInfos = [];
            checkInfos.push(
              res.riskLevelCheck,
              res.investTermCheck,
              res.investKindCheck,
              res.incomeTypeCheck,
            );
            return this.$refs.myDialog.show(checkInfos);
          }
          this.$router.push("/root/assetAllocationProposal/selectChapter");
        });
        return;
      }
      this.$router.push("/root/assetAllocationProposal/selectChapter");
    },
  },
  // 退出当前页面
  beforeDestroy() {
    this.leave = true;
  },
};
</script>

<style lang="less" scoped>
.warpp {
  height: 14.48rem;
  background: #ffffff;
  // padding: 0 0.3rem;
}
.check {
  height: 0.6rem;
  padding: 0.14rem 0;
  display: flex;
  justify-content: space-between;
  padding: 0.14rem 0.3rem;
}
// 输入框
.seacrh-input {
  width: 6.01rem;
  height: 0.6rem;
  line-height: 0.6rem;
  background: #f2f3f5;
  border-radius: 0.12rem;
}
// 取消按钮
.cance-text {
  font-size: 0.28rem;
  font-weight: 400;
  text-align: left;
  color: #666666;
  line-height: 0.6rem;
}
/deep/ .van-search {
  width: 100%;
  height: 0.6rem;
  padding: 0;
  position: relative;
  .van-cell {
    padding: 0;
  }
  .van-search__content {
    height: 0.6rem;
    padding-left: 0.29rem;
  }
  .van-field__body {
    height: 0.6rem;
    font-size: 0.28rem;
    font-weight: 400;
    text-align: left;
    color: #999999;
  }
  .van-field__control {
    height: 0.4rem;
    line-height: 0.4rem;
    padding-left: 0.45rem;
  }
  .van-image {
    position: absolute;
    top: 0.18rem;
    left: 0;
  }
  .van-icon {
    margin-right: 0.19rem;
  }
}

//姓氏关键字搜索
.namekey {
  padding: 0 0.3rem;
  margin-top: 0.2rem;
  background: #ffffff;
}
.key-list {
  height: 0.99rem;
  // border-bottom: 0.5px solid rgba(229, 229, 229, 0.5);
  font-size: 0.32rem;
  font-weight: 400;
  text-align: left;
  position: relative;
  &:after {
    position: absolute;
    content: "";
    background-color: #e5e5e5;
    display: block;
    width: 100%;
    height: 1px; /*no*/
    transform: scale(1, 0.5);
    bottom: 0;
    left: 0;
  }
}
.searchname {
  max-width: 2.4rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  font-size: 0.3rem;
  font-weight: 500;
  color: #333333;
}
.searchnum {
  margin-left: 0.4rem;
  line-height: 1rem;
  display: inline-block;
  font-size: 0.3rem;
  font-weight: 400;
  color: #333333;
}
.nodata {
  border-top: 1px #f2f3f5 solid;
  position: relative;
}
// 无搜索结果时
.Nosearchdata {
  width: 4.4rem;
  height: 3.2rem;
  font-size: 0.28rem;
  text-align: center;
  color: #333333;
  line-height: 0.4rem;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -1.6rem;
  margin-left: -2.2rem;
  // top: 4.76rem;
  // left: 1.25rem;
  img {
    width: 100%;
    height: 2.8rem;
    display: block;
  }
}
.word {
  height: 0.4rem;
  line-height: 0.4rem;
  font-size: 0.28rem;
  font-weight: 400;
  text-align: center;
  color: #999999;
}

// 搜索记录
.search-record {
  height: 0.45rem;
  line-height: 0.45rem;
  margin-top: 0.26rem;
  position: relative;
}
.record {
  // width: 1.28rem;
  height: 0.45rem;
  font-size: 0.32rem;
  font-weight: bold;
  text-align: left;
  color: #333333;
  line-height: 0.45rem;
}
// 删除按钮
.delete {
  width: 0.24rem;
  height: 0.24rem;
  display: block;
  position: absolute;
  right: 0;
  top: 0.1rem;
}
// 搜索记录
.record-list {
  margin-top: 0.24rem;
  height: auto;
  font-size: 0.28rem;
  text-align: center;
  font-weight: 400;

  li {
    font-weight: 400;
    margin-bottom: 0.2rem;
    padding: 0.05rem 0.15rem;
    margin-right: 0.2rem;
    font-size: 0.28rem;
    text-align: justify;
    color: #333333;
    background: #f2f3f5;
    border-radius: 0.04rem;
    float: left;
  }
}

.no-recode {
  font-size: 0.32rem;
  font-weight: 400;
  text-align: center;
  color: #333333;
  line-height: 0.4rem;
}
</style>
