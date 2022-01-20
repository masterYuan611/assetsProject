<template>
  <table>
    <tr>
      <th v-for="(item, index) in tab.head" :key="index">{{ item }}</th>
    </tr>
    <tr v-for="(item, index) in tab.body" :key="index">
      <td v-for="(innerItem, index) in item" :key="index" :rowspan="innerItem.rowspan">
        {{ innerItem.content }}
      </td>
    </tr>
  </table>
</template>
<script>
export default {
  props: ["tab"],
  data() {
    return {};
  },
};
</script>
<style lang="less" scoped>
table {
  width: 100%;
  border-radius: 0.04rem;
  border-right: 0.01rem solid #e5e5e5;
  border-bottom: 0.01rem solid #e5e5e5;
}
th {
  font-size: 0.24rem;
  color: #666;
  background-color: #f7f8fa;
  height: 0.5rem;
  line-height: 0.5rem;
  text-align: center;
  border-left: 0.01rem solid #e5e5e5;
  border-top: 0.01rem solid #e5e5e5;
}
td {
  font-size: 0.26rem;
  height: 0.5rem;
  line-height: 0.5rem;
  color: #333;
  text-align: center;
  border-left: 0.01rem solid #dbdbdb;
  border-top: 0.01rem solid #dbdbdb;
}
</style>
