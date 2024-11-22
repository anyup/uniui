<template>
  <app-layout>
    <config-demo v-model="value" :list="list">
      <col-table padding="10rpx">
        <col-tr :fixed="false">
          <col-th>姓名</col-th>
          <col-th>性别</col-th>
          <col-th :sort="value.sort">年龄</col-th>
          <col-th>居住地</col-th>
        </col-tr>
        <col-tr v-for="(value, key) in 2" :key="key">
          <col-td>张三</col-td>
          <col-td>男</col-td>
          <col-td>18</col-td>
          <col-td>北京市</col-td>
        </col-tr>
      </col-table>
    </config-demo>
  </app-layout>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          type: 'sort',
          title: '排序（年龄）: sort',
          tips: '配置按照某列排序',
          layout: 'radio',
          list: ['desc', 'asc', 'none']
        }
      ],
      value: {
        sort: 'desc'
      }
    }
  }
}
</script>
