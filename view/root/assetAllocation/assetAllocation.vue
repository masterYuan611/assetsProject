<template>
  <div>
    <div
      class="main-content"
      :style="isFromDeploy ? 'padding: 0.2rem 0.3rem 1.5rem;' : 'padding: 0.2rem 0.3rem;'"
    >
      <div class="module-card">
        <div class="card-title">参数设定</div>
        <div v-if="isFromDeploy" class="risk-rank">
          客户风险等级：<span style="color: #333333">{{ risk }}</span>
        </div>
        <div class="card-content" v-if="!isFromDeploy">
          基于客户的收益目标和可承受风险程度，通过投资模型进行试算，得出参考投资建议
        </div>
        <div class="card-adjust">
          <div class="adleft">
            <p>年化收益目标：{{ setAsset ? setAsset.annualizedRateOfReturnRate : "" }}%</p>
            <p>最大可承受风险：{{ setAsset ? setAsset.maximumRiskToleranceRate : "" }}%</p>
          </div>
          <div class="adright" v-if="!isFromDeploy">
            <div class="button" @click="adjustNum">参数调整</div>
          </div>
        </div>
        <div class="connections">
          <img src="images/connectimg.png" alt="" />
        </div>
      </div>
      <div class="module-card2">
        <!-- <div class="period" v-if="isFromHome">
          <div
            v-for="item in tabList"
            :key="item.name"
            :class="{ PeriodTabactive: tab === item.name }"
            @click="changeTab(item.name)"
          >
            {{ item.text }}
          </div>
        </div> -->
        <div class="card-title">大类配置</div>
        <div class="echart-img">
          <div class="allcont" v-if="!isFromHome">
            <div id="firE" class="twoEchart"></div>
            <div class="txt">当前持仓</div>
          </div>
          <div class="arrow" v-if="!isFromHome">
            <img src="images/arrow.png" alt="" />
          </div>
          <div class="allcont">
            <div id="secE" class="twoEchart"></div>
            <div class="txt">建议持仓</div>
          </div>
        </div>
        <div class="table">
          <div class="theader">
            <div>资产类型</div>
            <div v-if="!isFromHome">当前持仓</div>
            <div>建议持仓</div>
            <div v-if="!isFromHome">持仓建议</div>
          </div>
          <div class="data" v-for="(item, index) in dataArr" :key="index">
            <div class="firstd">
              <div
                class="smround"
                :style="
                  isFromHome
                    ? 'left:0.97rem;background:' + item.color + ';'
                    : 'left:0.27rem;background:' + item.color + ';'
                "
              ></div>
              <div class="cname">{{ item.t1 }}</div>
            </div>
            <div v-if="!isFromHome">{{ item.currentRatio }}</div>
            <div>{{ item.suggestRatio }}</div>
            <div v-if="!isFromHome">
              {{
                parseFloat(item.currentRatio) > parseFloat(item.suggestRatio)
                  ? "减持"
                  : parseFloat(item.currentRatio) < parseFloat(item.suggestRatio)
                  ? "增持"
                  : "不变"
              }}
            </div>
          </div>
        </div>
        <div v-if="groupArr.length > 0" class="card-title2">产品组合</div>
        <div>
          <div class="classifys" v-for="(item, index) in groupArr" :key="index">
            <div class="classify">
              <div class="title-line"></div>
              <div class="ctitle">{{ item.title }}</div>
            </div>
            <div class="group-card" v-for="(list, ins) in item.list" :key="ins">
              <div class="group-list">
                <div class="cleft">
                  <p class="p1">{{ list.prodName }}</p>
                  <div class="p2">
                    <div
                      v-if="list.riskLevel == '高风险' || list.riskLevel == '中高风险'"
                      class="lables lables1"
                    >
                      {{ list.riskLevel }}
                    </div>
                    <div v-if="list.riskLevel == '中风险'" class="lables lables2">
                      {{ list.riskLevel }}
                    </div>
                    <div
                      v-if="list.riskLevel == '中低风险' || list.riskLevel == '低风险'"
                      class="lables lables3"
                    >
                      {{ list.riskLevel }}
                    </div>
                  </div>
                </div>
                <div class="cright">
                  <p
                    class="p3"
                    :style="parseFloat(list.yearProfitRate) > 0 ? 'color:red' : 'color:green'"
                  >
                    {{ list.yearProfitRate }}
                  </p>
                  <p class="p4">近一年收益率</p>
                </div>
              </div>
              <div class="cut-line" v-if="ins != item.list.length - 1"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="tipInfo">重要提示</div>
      <div :class="flag ? 'info-content' : 'info-content2'">
        <div class="steps" v-for="(item, index) in stepsArr" :key="index">
          <div class="numbg">{{ index + 1 }}</div>
          {{ item.txt }}
        </div>
      </div>
      <div class="down-up" @click="lookmore()">
        <div v-if="flag">展开更多</div>
        <div v-else>收起</div>
        <div class="icon">
          <img :src="flag ? 'images/icon-down.png' : 'images/icon-up.png'" alt="" />
        </div>
      </div>
      <div class="footer" v-if="isFromDeploy">
        <button class="plan-btn" @click="loadScheme">加载当前方案</button>
      </div>
    </div>
    <div class="mydialog">
      <van-dialog
        v-model="show"
        title="参数调整"
        show-cancel-button
        confirmButtonText="确定"
        @confirm="submitAsset"
      >
        <div class="setnum">
          <div class="smalltitle">年化收益目标</div>
          <div class="input">
            <van-stepper
              v-model="value1"
              min="1"
              max="100"
              integer
              theme="round"
              button-size="22"
              @change="change"
            />
            <span class="symbol">%</span>
          </div>
        </div>
        <div class="setnum">
          <div class="smalltitle">最大可承受风险</div>
          <div class="input">
            <van-stepper
              v-model="value2"
              min="1"
              max="100"
              integer
              theme="round"
              button-size="22"
              @change="change"
            />
            <span class="symbol">%</span>
          </div>
        </div>
      </van-dialog>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";

export default {
  data() {
    return {
      isFromDeploy: false, // 是否来自资产配置
      risk: "", // 风险等级
      tabList: [
        { name: "balance", text: "平衡" },
        { name: "aggressive", text: "进取" },
        { name: "radicalness", text: "激进" },
      ],
      tab: "balance",
      custNo: "",
      setAsset: {},
      isApp: APIconfig.isApp,
      show: false,
      dataArr: [
        { t1: "权益类", color: "#007BF6", currentRatio: "", suggestRatio: "" },
        { t1: "固收类", color: "#F7B501", currentRatio: "", suggestRatio: "" },
        { t1: "现金类", color: "#34C2FC", currentRatio: "", suggestRatio: "" },
        { t1: "其他", color: "#4FDEB2", currentRatio: "", suggestRatio: "" },
      ],
      groupArr: [],
      flag: true, //开关
      stepsArr: [
        {
          txt: "国海证券出具的账户诊断报告基于客户在我司系统过往交易数据分析得出，仅供客户参考，不对客户构成投资交易要约投资建议。客户在决定投资交易前，应充分了解投资交易的条款、细则、限制与风险等因素，评估投资交易是否切合自身的条件与目标，国海证券不会因所提供报告中表述的观点与实施结果存在差异而承担任何法律或经济上的责任。",
        },
        {
          txt: "国海证券出具的账户诊断报告中的数据和观点截止到报告生成日期，具有时效性。",
        },
        {
          txt: "客户个人信息提供不完全、客观环境变化、客户个人财务状况变化等因素均可能导致本账户诊断报告的实施诊断结果与预期目标服务预期之间出现差异，国海证券对此不承担任何法律或经济上的责任。",
        },
        {
          txt: "客户所提供的一切个人信息国海证券依法严格保密。",
        },
        {
          txt: "市场有风险，投资需谨慎。",
        },
      ],
      value1: 0,
      value2: 0,
      isFromHome: false, //判断是否是首页直接过来的
    };
  },
  computed: {
    ...mapGetters(["draft"]),
  },
  created() {
    let query = this.$route.query;
    // 2：账户诊断进来，1：首页进来，3：资配建议书进来
    switch (query.type) {
      case "1":
        this.isFromHome = true;
        this.setAsset = {
          annualizedRateOfReturnRate: query.annualizedRateOfReturnPer,
          maximumRiskToleranceRate: query.maximumRiskTolerancePer,
        };
        this.getSuggestElseData();
        this.getCombinationElseProducts();
        break;
      case "2":
        this.custNo = query.id || "";
        this.getCustAsset();
        this.getAssetData();
        this.getSuggestData();
        this.getCombinationProducts();
        break;
      case "3":
        this.isFromDeploy = true;
        this.custNo = query.id || "";
        this.setAsset = {
          annualizedRateOfReturnRate: query.annualizedRateOfReturnPer,
          maximumRiskToleranceRate: query.maximumRiskTolerancePer,
        };
        this.getRisk();
        this.getAssetData();
        this.getSuggest();
        this.getProducts();
        break;
      default:
        break;
    }
  },
  methods: {
    ...mapMutations("proposal", ["setDraft"]),
    // 获取客户的资产配置参数
    getCustAsset() {
      return this.$apiFwgx.getCustAsset({ custNo: this.custNo }).then((res) => {
        if (res.data.data) {
          this.setAsset = res.data.data;
        }
      });
    },
    //参数调整
    adjustNum() {
      this.show = true;
      this.value1 = this.setAsset ? this.setAsset.annualizedRateOfReturnRate : "";
      this.value2 = this.setAsset ? this.setAsset.maximumRiskToleranceRate : "";
    },
    change() {
      if (this.value1 && (this.value1 < 1 || this.value1 > 100)) {
        this.$toast("年化收益目标应介于1%~100%之间");
        setTimeout(() => {
          this.$toast.clear();
        }, 2000);
        if (this.value1 < 1) {
          this.value1 = 1;
        } else if (this.value1 > 100) {
          this.value1 = 100;
        }
        return;
      } else if ((this.value2 && this.value2 < 1) || this.value2 > 100) {
        this.$toast("最大可承受风险应介于1%~100%之间");
        setTimeout(() => {
          this.$toast.clear();
        }, 2000);
        if (this.value2 < 1) {
          this.value2 = 1;
        } else if (this.value2 > 100) {
          this.value2 = 100;
        }
        return;
      }
    },
    //修改配置
    submitAsset() {
      if (this.value1 && (this.value1 < 1 || this.value1 > 100)) {
        this.$toast("年化收益目标应介于1%~100%之间");
        setTimeout(() => {
          this.$toast.clear();
        }, 2000);
        return;
      } else if (this.value2 && (this.value2 < 1 || this.value2 > 100)) {
        this.$toast("最大可承受风险应介于1%~100%之间");
        setTimeout(() => {
          this.$toast.clear();
        }, 2000);
        return;
      } else {
        if (this.isFromHome) {
          this.setAsset = {
            annualizedRateOfReturnRate: this.value1,
            maximumRiskToleranceRate: this.value2,
          };
          this.getSuggestElseData();
          this.getCombinationElseProducts();
        } else {
          return this.$apiFwgx
            .postAllocationRevise({
              custNo: this.custNo,
              annualizedRateOfReturnPer: this.value1,
              maximumRiskTolerancePer: this.value2,
            })
            .then((data) => {
              this.getCustAsset();
              this.getSuggestData();
              this.getCombinationProducts();
            });
        }
      }
    },
    // 首页进来tab切换
    changeTab(tab) {
      this.tab = tab;
      console.log(tab);
    },
    // 获取大类配置数据当前持有
    getAssetData() {
      return this.$apiFwgx.getAssetData({ custNo: this.custNo }).then((res) => {
        let arr = [];
        if (res.data.data) {
          this.dataArr.map((item) => {
            switch (item.t1) {
              case "权益类":
                item.currentRatio = res.data.data.rightsMktValPer;
                arr[0] = { value: parseFloat(res.data.data.rightsMktValPer) };
                break;
              case "固收类":
                item.currentRatio = res.data.data.fixedMktValPer;
                arr[1] = { value: parseFloat(res.data.data.fixedMktValPer) };
                break;
              case "现金类":
                item.currentRatio = res.data.data.cashMktValPer;
                arr[2] = { value: parseFloat(res.data.data.cashMktValPer) };
                break;
              case "其他":
                item.currentRatio = res.data.data.otherMktValPer;
                arr[3] = { value: parseFloat(res.data.data.otherMktValPer) };
                break;
              default:
                break;
            }
          });
        }
        this.drawEchartsFirst(arr);
      });
    },
    // 建议持仓
    getSuggestData() {
      return this.$apiFwgx.getSuggestData({ custNo: this.custNo }).then((res) => {
        let arr = [];
        if (res.data.data) {
          this.dataArr.map((item) => {
            switch (item.t1) {
              case "权益类":
                item.suggestRatio = res.data.data.equityAssetWeight;
                arr[0] = { value: parseFloat(res.data.data.equityAssetWeight) };
                break;
              case "固收类":
                item.suggestRatio = res.data.data.bondAssetWeight;
                arr[1] = { value: parseFloat(res.data.data.bondAssetWeight) };
                break;
              case "现金类":
                item.suggestRatio = res.data.data.cashAssetWeight;
                arr[2] = { value: parseFloat(res.data.data.cashAssetWeight) };
                break;
              case "其他":
                item.suggestRatio = res.data.data.alternativeAssetWeight;
                arr[3] = { value: parseFloat(res.data.data.alternativeAssetWeight) };
                break;
              default:
                break;
            }
          });
        }
        this.drawEchartsSecond(arr);
      });
    },
    // 无客户号的建议持仓
    getSuggestElseData() {
      return this.$apiFwgx
        .getSuggestElseData({ maximumRiskToleranceRate: this.setAsset.maximumRiskToleranceRate })
        .then((res) => {
          let arr = [];
          if (res.data.data) {
            this.dataArr.map((item) => {
              switch (item.t1) {
                case "权益类":
                  item.suggestRatio = res.data.data.equityAssetWeight;
                  arr[0] = { value: parseFloat(res.data.data.equityAssetWeight) };
                  break;
                case "固收类":
                  item.suggestRatio = res.data.data.bondAssetWeight;
                  arr[1] = { value: parseFloat(res.data.data.bondAssetWeight) };
                  break;
                case "现金类":
                  item.suggestRatio = res.data.data.cashAssetWeight;
                  arr[2] = { value: parseFloat(res.data.data.cashAssetWeight) };
                  break;
                case "其他":
                  item.suggestRatio = res.data.data.alternativeAssetWeight;
                  arr[3] = { value: parseFloat(res.data.data.alternativeAssetWeight) };
                  break;
                default:
                  break;
              }
            });
          }
          if (!this.isFromHome) {
            this.drawEchartsFirst([]);
          }
          this.drawEchartsSecond(arr);
        });
    },
    // 组合产品
    getCombinationProducts() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      return this.$apiFwgx
        .getCombinationProducts({ custNo: this.custNo })
        .then((res) => {
          let obj = { title: "", list: [] };
          this.groupArr = [];
          if (res.data.data) {
            if (res.data && res.data.data.equityProductPortfolioVO) {
              obj.title = "权益类";
              obj.list = res.data.data.equityProductPortfolioVO;
              this.groupArr.push(obj);
              obj = { title: "", list: [] };
            }
            if (res.data && res.data.data.bondProductPortfolioVO) {
              obj.title = "固收类";
              obj.list = res.data.data.bondProductPortfolioVO;
              this.groupArr.push(obj);
              obj = { title: "", list: [] };
            }
            if (res.data && res.data.data.cashProductPortfolioVO) {
              obj.title = "现金类";
              obj.list = res.data.data.cashProductPortfolioVO;
              this.groupArr.push(obj);
              obj = { title: "", list: [] };
            }
            if (res.data && res.data.data.alternativeProductPortfolioVO) {
              obj.title = "其他";
              obj.list = res.data.data.alternativeProductPortfolioVO.alternativeProductListVO;
              this.groupArr.push(obj);
              obj = { title: "", list: [] };
            }
          }
        })
        .finally(() => {
          this.$toast.clear();
        });
    },
    getCombinationElseProducts() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      return this.$apiFwgx
        .getCombinationElseProducts({
          maximumRiskToleranceRate: this.setAsset.maximumRiskToleranceRate,
        })
        .then((res) => {
          let obj = { title: "", list: [] };
          this.groupArr = [];
          if (res.data.data) {
            if (res.data && res.data.data.equityProductPortfolioVO) {
              obj.title = "权益类";
              obj.list = res.data.data.equityProductPortfolioVO;
              this.groupArr.push(obj);
              obj = { title: "", list: [] };
            }
            if (res.data && res.data.data.bondProductPortfolioVO) {
              obj.title = "固收类";
              obj.list = res.data.data.bondProductPortfolioVO;
              this.groupArr.push(obj);
              obj = { title: "", list: [] };
            }
            if (res.data && res.data.data.cashProductPortfolioVO) {
              obj.title = "现金类";
              obj.list = res.data.data.cashProductPortfolioVO;
              this.groupArr.push(obj);
              obj = { title: "", list: [] };
            }
            if (res.data && res.data.data.alternativeProductPortfolioVO) {
              obj.title = "其他";
              obj.list = res.data.data.alternativeProductPortfolioVO;
              this.groupArr.push(obj);
              obj = { title: "", list: [] };
            }
          }
        })
        .finally(() => {
          this.$toast.clear();
        });
    },
    //展开查看更多
    lookmore() {
      if (this.flag) {
        this.flag = false;
      } else {
        this.flag = true;
      }
    },
    drawEchartsFirst(data) {
      var chartDom = document.getElementById("firE");
      var myChart = this.$echarts.init(chartDom);
      var option;
      option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["80%", "100%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            color: ["#007BF6", "#F7B501", "#34C2FC", "#4FDEB2"],
            emphasis: {
              label: {
                show: true,
                fontSize: "40",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: data,
          },
        ],
      };
      option && myChart.setOption(option);
    },
    drawEchartsSecond(data) {
      var chartDom = document.getElementById("secE");
      var myChart = this.$echarts.init(chartDom);
      var option;
      option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["80%", "100%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            color: ["#007BF6", "#F7B501", "#34C2FC", "#4FDEB2"],
            emphasis: {
              label: {
                show: true,
                fontSize: "40",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: data,
          },
        ],
      };
      option && myChart.setOption(option);
    },
    // 二期
    // 获取客户风险等级
    getRisk() {
      return this.$apiFwgx
        .getRisk({ custNo: this.custNo })
        .then((res) => {
          this.risk = res.data.data.customRiskLevel;
        })
        .catch((err) => {});
    },
    // 二期配置过来的建议持仓
    getSuggest() {
      return this.$apiFwgx
        .getSuggest({ custNo: this.custNo, maxDeficitRate: this.setAsset.maximumRiskToleranceRate })
        .then((res) => {
          let arr = [];
          if (res.data.data) {
            this.dataArr.map((item) => {
              switch (item.t1) {
                case "权益类":
                  item.suggestRatio = res.data.data.equityAssetWeight;
                  arr[0] = { value: parseFloat(res.data.data.equityAssetWeight) };
                  break;
                case "固收类":
                  item.suggestRatio = res.data.data.bondAssetWeight;
                  arr[1] = { value: parseFloat(res.data.data.bondAssetWeight) };
                  break;
                case "现金类":
                  item.suggestRatio = res.data.data.cashAssetWeight;
                  arr[2] = { value: parseFloat(res.data.data.cashAssetWeight) };
                  break;
                case "其他":
                  item.suggestRatio = res.data.data.alternativeAssetWeight;
                  arr[3] = { value: parseFloat(res.data.data.alternativeAssetWeight) };
                  break;
                default:
                  break;
              }
            });
          }
          this.drawEchartsSecond(arr);
        })
        .catch((err) => {});
    },
    //二期配置过来的组合产品
    getProducts() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      return this.$apiFwgx
        .getProducts({
          custNo: this.custNo,
          maxDeficitRate: this.setAsset.maximumRiskToleranceRate,
        })
        .then((res) => {
          let obj = { title: "", list: [] };
          this.groupArr = [];
          if (res.data.data) {
            if (res.data && res.data.data.equityProductPortfolioVO) {
              obj.title = "权益类";
              obj.list = res.data.data.equityProductPortfolioVO;
              obj.key = "equity";
              this.groupArr.push(obj);
              obj = { title: "", list: [] };
            }
            if (res.data && res.data.data.bondProductPortfolioVO) {
              obj.title = "固收类";
              obj.list = res.data.data.bondProductPortfolioVO;
              obj.key = "bond";
              this.groupArr.push(obj);
              obj = { title: "", list: [] };
            }
            if (res.data && res.data.data.cashProductPortfolioVO) {
              obj.title = "现金类";
              obj.list = res.data.data.cashProductPortfolioVO;
              obj.key = "cash";
              this.groupArr.push(obj);
              obj = { title: "", list: [] };
            }
            if (res.data && res.data.data.alternativeProductPortfolioVO) {
              obj.title = "其他";
              obj.list = res.data.data.alternativeProductPortfolioVO.alternativeProductListVO;
              obj.key = "alter";
              this.groupArr.push(obj);
              obj = { title: "", list: [] };
            }
          }
        })
        .finally(() => {
          this.$toast.clear();
        });
    },
    // 加载当前方案
    loadScheme() {
      let equityWeightList = [];
      let fixedWeightList = [];
      let cashWeightList = [];
      let equityWeight = 0;
      let fixedWeight = 0;
      let cashWeight = 0;
      this.groupArr.forEach(({ key, list }) => {
        if (key === "equity") {
          equityWeightList = [...list];
        } else if (key === "bond") {
          fixedWeightList = [...list];
        } else if (key === "cash") {
          cashWeightList = [...list];
        }
      });
      this.dataArr.forEach(({ t1, suggestRatio }) => {
        if (t1 === "权益类") {
          equityWeight = parseFloat(suggestRatio.slice(0, -1));
        } else if (t1 === "固收类") {
          fixedWeight = parseFloat(suggestRatio.slice(0, -1));
        } else if (t1 === "现金类") {
          cashWeight = parseFloat(suggestRatio.slice(0, -1));
        }
      });
      const equityWeightIds = equityWeightList.map(({ prodCate, prodCode, prodCodeDesc }) => ({
        secType: prodCate,
        secCd: prodCode,
        prodCodeDesc,
      }));
      const fixedWeightIds = fixedWeightList.map(({ prodCate, prodCode, prodCodeDesc }) => ({
        secType: prodCate,
        secCd: prodCode,
        prodCodeDesc,
      }));
      const cashWeightIds = cashWeightList.map(({ prodCate, prodCode, prodCodeDesc }) => ({
        secType: prodCate,
        secCd: prodCode,
        prodCodeDesc,
      }));
      this.setDraft({
        ...this.draft,
        equityWeightList,
        fixedWeightList,
        cashWeightList,
        equityWeight,
        fixedWeight,
        cashWeight,
        equityWeightIds,
        fixedWeightIds,
        cashWeightIds,
      });
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
.PeriodTabactive {
  background-color: #fff;
  border: 0.01rem solid rgba(0, 123, 246, 0.3);
  box-shadow: 0 0.02rem 0.1rem 0 rgba(65, 93, 148, 0.15);
  color: #007bf6;
  border-radius: 0.04rem;
  font-weight: 500;
}
.main-content {
  height: auto;
  background: #f2f3f5;
  .module-card2 {
    margin-top: 0.2rem;
    .period {
      margin: 0 auto;
      margin-bottom: 0.4rem;
      width: 4.74rem;
      box-sizing: content-box;
      height: 0.54rem;
      display: flex;
      align-items: center;
      background-color: #f2f3f5;
      border-radius: 0.06rem;
      font-size: 0.26rem;
      color: #666;
      padding: 0.04rem 0.04rem;
      div {
        width: 1.56rem;
        font-weight: 500;
        height: 100%;
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
      }
    }
  }
  .module-card,
  .module-card2 {
    background: #ffffff;
    border-radius: 0.1rem;
    padding: 0.5rem 0.3rem 0.4rem 0.3rem;
    position: relative;
    .card-title,
    .card-title2 {
      height: 0.45rem;
      font-size: 0.32rem;
      font-weight: 600;
      text-align: left;
      color: #333333;
      line-height: 0.45rem;
    }
    .card-title2 {
      margin-top: 0.7rem;
    }
    .risk-rank {
      font-size: 0.28rem;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 0.4rem;
      margin: 0.3rem 0 0.4rem 0;
    }
    .card-content {
      height: 0.92rem;
      font-size: 0.28rem;
      font-weight: 400;
      text-align: left;
      color: #666666;
      line-height: 0.46rem;
      margin-top: 0.3rem;
    }
    .card-adjust {
      background: #f7f8fa;
      height: 1.4rem;
      margin-top: 0.4rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .adleft {
        margin-left: 0.39rem;
        p {
          height: 0.4rem;
          font-size: 0.28rem;
          font-weight: 400;
          text-align: left;
          color: #333333;
          line-height: 0.4rem;
          margin: 0.05rem 0;
        }
      }
      .adright {
        margin-right: 0.21rem;
        .button {
          width: 1.6rem;
          height: 0.6rem;
          border: 0.01rem solid rgba(0, 123, 246, 0.5);
          border-radius: 0.31rem;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 0.26rem;
          font-weight: 500;
          text-align: left;
          color: #007bf6;
        }
      }
    }
    .connections {
      display: flex;
      width: 6.3rem;
      height: 0.63rem;
      position: absolute;
      bottom: -0.42rem;
      z-index: 5;
      img {
        width: 6.3rem;
        height: 0.63rem;
      }
    }
    .echart-img {
      height: 1.8rem;
      margin: 0.6rem 0;
      display: flex;
      justify-content: center;
      align-items: center;
      .allcont {
        position: relative;
        .twoEchart {
          width: 1.8rem;
          height: 1.8rem;
        }
        .txt {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          font-size: 0.24rem;
          font-weight: 400;
          text-align: center;
          color: #666666;
          line-height: 1.8rem;
        }
      }

      .arrow {
        display: flex;
        width: 0.7rem;
        height: 0.3rem;
        margin: 0 0.35rem;
        img {
          width: 0.7rem;
          height: 0.3rem;
        }
      }
    }
    .table {
      border-top: 0.01rem solid #e5e5e5;
      border-left: 0.01rem solid #e5e5e5;
      .theader,
      .data {
        display: flex;
        justify-content: center;
        align-items: center;
        .firstd {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          .smround {
            position: absolute;
            top: 0.21rem;
            display: inline-block;
            width: 0.08rem;
            height: 0.08rem;
            border-radius: 50%;
          }
          .cname {
            margin-left: 0.07rem;
          }
        }
        & > div {
          flex: 1;
          height: 0.5rem;
          border-right: 0.01rem solid #e5e5e5;
          border-bottom: 0.01rem solid #e5e5e5;
          height: 0.5rem;
          font-size: 0.24rem;
          font-weight: 400;
          text-align: center;
          color: #666666;
          line-height: 0.5rem;
          background: #f7f8fa;
        }
      }
      .data > div {
        background: none;
      }
    }
    .classifys {
      margin-top: 0.6rem;
      &:first-of-type {
        margin-top: 0.4rem;
      }
    }
    .classify {
      display: flex;
      justify-content: start;
      align-items: center;
      height: 0.4rem;
      margin-bottom: 0.3rem;
      .title-line {
        width: 0.06rem;
        height: 0.24rem;
        background: #007bf6;
        margin-right: 0.1rem;
      }
      .ctitle {
        height: 0.4rem;
        font-size: 0.28rem;
        font-weight: 500;
        text-align: left;
        color: #333333;
        line-height: 0.4rem;
      }
    }
    .group-card {
      padding: 0 0.3rem;
      background: #f7f8fa;
      border-radius: 0.04rem;
      .group-list {
        height: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .cleft {
          .p1 {
            max-width: 4.3rem;
            overflow: hidden;
            text-overflow: ellipsis; //文本溢出显示省略号
            white-space: nowrap; //文本不会换行
            height: 0.4rem;
            font-size: 0.28rem;
            font-weight: 500;
            text-align: left;
            color: #333333;
            line-height: 0.4rem;
            margin-bottom: 0.12rem;
          }
          .p2 {
            height: 0.3rem;
            font-size: 0.2rem;
            font-weight: 400;
            text-align: left;
            line-height: 0.3rem;
            display: flex;
            justify-content: left;
            align-items: center;
            .lables {
              display: inline-block;
              padding: 0 0.1rem;
              height: 0.3rem;
              border: 0.01rem solid;
              line-height: 0.3rem;
              border-radius: 0.02rem;
            }
            .lables1 {
              border-color: rgba(231, 43, 43, 0.3);
              color: #e72b2b;
              background: #fce9e9;
            }
            .lables2 {
              border-color: rgba(0, 123, 246, 0.3);
              color: #007bf6;
              background: #e5f1fe;
            }
            .lables3 {
              border-color: rgba(22, 160, 67, 0.3);
              color: #16a043;
              background: #ecf8f0;
            }
          }
        }
        .cright {
          .p3 {
            height: 0.34rem;
            font-size: 0.28rem;
            font-weight: 400;
            text-align: right;
            color: #333333;
            line-height: 0.34rem;
            margin-bottom: 0.12rem;
          }
          .p4 {
            height: 0.33rem;
            font-size: 0.24rem;
            font-weight: 400;
            text-align: right;
            color: #999999;
            line-height: 0.33rem;
          }
        }
      }
      .cut-line {
        width: 5.7rem;
        height: 0.02rem;
        background: #ebebeb;
        border-radius: 0.04rem;
      }
    }
  }
  .tipInfo {
    height: 0.4rem;
    font-size: 0.26rem;
    font-weight: 500;
    text-align: left;
    color: #666666;
    line-height: 0.4rem;
    margin-top: 0.4rem;
  }
  .info-content {
    max-height: 1.4rem;
    /*! autoprefixer: off */
    text-overflow: ellipsis;
    overflow-y: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    /*! autoprefixer: on */
  }
  .info-content2 {
    // transition: max-height 0.5s;
    max-height: 8.88rem;
  }
  .info-content,
  .info-content2 {
    font-size: 0.26rem;
    font-weight: 400;
    text-align: left;
    color: #999999;
    line-height: 0.4rem;
    .steps {
      margin-top: 0.2rem;
    }
    .numbg {
      display: inline-block;
      text-align: center;
      line-height: 0.32rem;
      width: 0.32rem;
      height: 0.32rem;
      background: url("../../../images/numBg.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      font-size: 0.2rem;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 400;
      text-align: center;
      color: #666666;
      line-height: 0.32rem;
    }
  }
  .down-up {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 0.37rem;
    font-size: 0.26rem;
    font-weight: 400;
    text-align: left;
    color: #999999;
    line-height: 0.37rem;
    margin: 0.3rem 0;
    .icon {
      display: flex;
      width: 0.28rem;
      height: 0.28rem;
      margin-left: 0.1rem;
      img {
        width: 0.28rem;
        height: 0.28rem;
      }
    }
  }
  .footer {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0.15rem 0.4rem 0.3rem;
    background: #fff;
    height: 1.1rem;
    box-shadow: 0px -1px 0px 0px #ebebeb;
    padding-bottom: env(safe-area-inset-bottom);
    .plan-btn {
      width: 100%;
      line-height: 0.8rem;
      border-radius: 0.46rem;
      background: linear-gradient(to right, #00aff6, #007bf6);
      font-weight: 500;
      text-align: center;
      color: #fff;
      font-size: 0.36rem;
    }
  }
}

.mydialog {
  .van-dialog {
    width: 6rem;
    height: 4.7rem;
    background: #ffffff;
    border-radius: 0.1rem;
  }
  /deep/ .van-overlay {
    background-color: rgba(0, 0, 0, 0.4);
  }
  & /deep/ .van-dialog__header {
    padding-top: 0.4rem;
    height: 0.5rem;
    font-size: 0.36rem;
    font-weight: 600;
    text-align: center;
    color: #333333;
    line-height: 0.5rem;
  }
  & /deep/ .van-dialog__content {
    margin: 0.5rem 0.4rem;
  }
  & /deep/ .van-hairline--top,
  .van-dialog__footer {
    height: 1rem;
  }
  & /deep/ .van-button {
    height: 1rem;
    font-size: 0.34rem;
    font-weight: 500;
    text-align: center;
    color: #333333;
    line-height: 1rem;
  }
  & /deep/ .van-dialog__confirm {
    color: #007bf6;
  }
  .setnum {
    display: flex;
    justify-content: left;
    align-items: center;
    height: 0.7rem;
    margin: 0.4rem 0;
    .smalltitle {
      width: 2rem;
      height: 0.4rem;
      font-size: 0.28rem;
      font-weight: 400;
      text-align: left;
      color: #666666;
      line-height: 0.4rem;
      margin-right: 0.2rem;
    }
    .input {
      display: flex;
      align-items: center;
      width: 3rem;
      height: 0.7rem;
      position: relative;
      .van-stepper {
        display: flex;
        align-items: center;
      }
      .symbol {
        position: absolute;
        right: 1rem;
      }
      & /deep/ .van-stepper--round button {
        width: 0.5rem !important;
        height: 0.5rem !important;
        border: 0.01rem solid #e6e6e6;
        box-shadow: 0 0.02rem 0.07rem 0 rgba(171, 199, 227, 0.2);
        color: #848d9f;
        background: #ffffff;
      }
      & /deep/ .van-stepper--round input {
        width: 1.42rem;
        height: 0.7rem !important;
        margin: 0 0.3rem;
        border: 0.01rem solid #cccccc;
        border-radius: 0.05rem;
        padding-right: 0.55rem;
        font-size: 0.32rem;
        font-weight: bold;
        color: #333333;
      }
      & /deep/ .van-stepper--round .van-stepper__minus--disabled {
        opacity: 0.5;
      }
    }
  }
  & /deep/ .van-button {
    border-top: 0.01rem solid #e9ebf0;
  }
  & /deep/ .van-dialog__cancel {
    border-right: 0.01rem solid #e9ebf0;
  }
}
</style>
