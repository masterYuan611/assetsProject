export default {
  dealSumMoney(val, fix = 2) {
    if (val == 0) {
      val = "0.00";
      return val;
    }
    if (!val) return val;
    let negativeFlag = false;
    if (val < 0) {
      val = Math.abs(val); // 将负数转为负数
      negativeFlag = true;
    }
    val = val.toFixed(fix); // 保留小数2位
    val += "";
    let int = val.slice(0, fix * -1 - 1); // 拿到整数
    let ext = val.slice(fix * -1 - 1); // 获取到小数
    //每个三位价格逗号
    int = int.split("").reverse().join(""); // 翻转整数
    let temp = ""; // 临时变量
    for (let i = 0; i < int.length; i++) {
      temp += int[i];
      if ((i + 1) % 3 == 0 && i != int.length - 1) {
        temp += ","; // 每隔三个数字拼接一个逗号
      }
    }
    temp = temp.split("").reverse().join(""); // 加完逗号之后翻转
    temp = temp + ext; // 整数小数拼接
    if (negativeFlag) {
      temp = "-" + temp;
    }
    return temp; // 返回
  },
};
