<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import {prefixStyle} from "common/js/dom"

  const transform = prefixStyle('transform')

  const progressBtnWidth = 16
  export default {
    created() {
      this.touch = {}
    },
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    watch: {
      percent(newVal) {
        if (newVal > 0 && !this.touch.initiated) {
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          const offsetWidth = barWidth * newVal
          this._offset(offsetWidth)
        }

      }
    },
    methods: {
      _offset(offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3D(${offsetWidth}px,0,0)`
      },
      progressTouchStart(e) {
        this.touch.initiated = true
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth
      },
      progressTouchMove(e) {
        if (!this.touch.initiated) {
          return
        }
        // 手指移动偏移量
        let delatX = e.touches[0].pageX - this.touch.startX
        // 距离起点位置
        let offsetWidth = Math.min(Math.max(0, this.touch.left + delatX), this.$refs.progressBar.clientWidth - progressBtnWidth)
        this._offset(offsetWidth)

      },
      progressTouchEnd(e) {
        this.touch.initiated = false
        this._triggerPercent()
      },
      /**
       * 派发进度条百分比改变事件
       * @private
       */
      _triggerPercent() {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('percentChange', percent)
      },
      progressClick(e) {
        const rect = this.$refs.progressBar.getBoundingClientRect()
        const offsetWidth = e.pageX - rect.left
        this._offset(offsetWidth)
        // rect.left得到的是离屏幕左边的距离
        // 这里当我们点击progressBtn的时候  e.offsetX 获取不对
        // this._offset(offsetWidth)
        this._triggerPercent()
      }
    }
  }
</script>

<style scoped lang="stylus" ref="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme

</style>
