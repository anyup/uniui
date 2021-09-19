<template>
  <app-layout>
    <config-demo v-model="value" :list="list">
      <au-table padding="10rpx">
        <au-tr :fixed="false">
          <au-th>姓名</au-th>
          <au-th>性别</au-th>
          <au-th :sort="value.sort">年龄</au-th>
          <au-th>居住地</au-th>
        </au-tr>
        <au-tr v-for="(value, key) in 2" :key="key">
          <au-td>张三</au-td>
          <au-td>男</au-td>
          <au-td>18</au-td>
          <au-td>山东青岛</au-td>
        </au-tr>
      </au-table>
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
          title: '排序（年龄）',
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
