<template>
    <div class="slider">
      <mt-swipe :auto="4000">
        <mt-swipe-item v-for="item in recommendList" :key="item.id">
          <a :href="item.linkUrl">
            <img :src="item.picUrl" >
          </a>
        </mt-swipe-item>
      </mt-swipe>
    </div>
</template>

<script>
export default {
  props: ['recommendList']
}
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
  .mint-swipe
    height 165px
    text-align center
    .mint-swipe-items-wrap
      width 100%
      img
        display block
        width 100%
        height 100%

</style>
