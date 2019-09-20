<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: null
      },
      listenScroll: { // 监听是否滚动的标志
        type: Boolean,
        default: false
      },
      pullup: { // 是否下拉刷新列表
        type: Boolean,
        default: false
      },
      beforeScroll: { // 监听搜索列表的滚动事件  一旦滚动则让输入框失去焦点 输入法收起
        type: Boolean,
        default: false
      },
      refreshDelay: {
        type: Number,
        default: 20
      }
    },
    mounted() { // 在挂载虚拟dom之后进行初始化scroll区域
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll() { // 初始化scroll
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })

        if (this.listenScroll) {
          let that = this
          this.scroll.on('scroll', (pos) => { // 监听滚动事件 获取滚动坐标
            that.$emit('scroll', pos)
          })
        }

        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {  // 派发搜索列表的滚动事件 继续发请求获取更多数据
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd')
            }
          })
        }

        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll')
          })
        }
      },
      enable() { // 启用 better-scroll, 默认 开启。
        this.scroll && this.scroll.enable()
      },
      disable() { // 禁用 better-scroll，DOM 事件（如 touchstart、touchmove、touchend）的回调函数不再响应
        this.scroll && this.scroll.disable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }

    },
    watch: {
      data() { // 监视data数据的变化 当数据发生改变时 重新渲染滑动区域
        setTimeout(() => {
          this.refresh()
        }, 20)
      }
    }
  }
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">

</style>
