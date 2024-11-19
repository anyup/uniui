<template>
  <app-layout>
    <config-demo v-model="value" :list="list" @change="change" content-height="300rpx">
      <u-empty v-if="pager.empty"></u-empty>
      <scroll-view v-else scroll-y style="height: 300rpx" @scrolltolower="lower">
        <view v-for="item in pager.data" :key="item" class="is-bordertb is-pd-10">第{{ item }}条数据</view>
        <u-gap height="40" bg-color=""></u-gap>
        <u-loadmore :status="pager.loadmore()" />
      </scroll-view>
    </config-demo>
  </app-layout>
</template>

<script>
import { Pager, Optimize } from '@/uniui'
export default {
  data() {
    return {
      list: [
        {
          type: 'total',
          title: '数据数量',
          layout: 'radio',
          list: [20, 40, 80]
        },
        {
          type: 'limit',
          title: '分页-每页数量',
          layout: 'radio',
          list: [10, 20]
        }
      ],
      value: {
        total: 20,
        limit: 10
      },
      pager: {},
      optimize: new Optimize.Builder(2000)
    }
  },
  onLoad() {
    this.pager = new Pager(1, this.value.limit)
    this.getList()
  },
  methods: {
    getList() {
      setTimeout(() => {
        const { offset, limit } = this.pager
        const list = Array.from({ length: limit }, (v, i) => offset + i + 1)
        this.pager.setData(list).setTotal(this.value.total)
      }, 1000)
    },
    lower() {
      this.optimize.throttle(() => {
        if (this.pager.hasMore()) {
          this.getList()
        }
      })
    },
    change() {
      this.pager.reset(1, this.value.limit)
      this.getList()
    }
  }
}
</script>

<style></style>
