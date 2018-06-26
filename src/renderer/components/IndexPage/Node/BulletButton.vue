<script>
// import _ from 'lodash'
import { fromEvent } from 'rxjs'
import { map, concatAll, takeUntil } from 'rxjs/operators'

export default {
  name: 'bullet-button',

  data () {
    return {
      isDraging: false
    }
  },

  props: {
    backColor: {
      type: String,
      default: 'transparent'
    },
    handleClick: {
      type: Function,
      default () {
        return () => {}
      }
    },
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },

  render (h) {
    const preview = () => {
      if (this.isDraging && this.list.length > 0) {
        return (
          this.list
            .filter((child, index) => (index < 4))
            .map((child, index) => (
              <span style={{
                top: (index + 1) * 11 + 'px',
                opacity: 1 - (index + 1) * 0.2
              }}></span>
            ))
        )
      }
      return null
    }
    const icon = (
      <i style={{backgroundColor: this.backColor}}></i>
    )
    const bullet = (
      <a
        ref="bullet"
        class={{draging: this.isDraging}}>
        {icon}
        {preview()}
      </a>
    )

    return (
      <div class="bullet-button">
        {bullet}
      </div>
    )
  },

  methods: {
    observeDrag () {
      const bullet = this.$refs.bullet
      const bulletWidth = bullet.clientWidth
      const bulletHeight = bullet.clientHeight
      const moveBullet = (left, top) => {
        bullet.style.left = left + 'px'
        bullet.style.top = top + 'px'
      }
      const dragObserver = (pos) => {
        let range = {
          left: 0, // 左边缘
          right: document.body.clientWidth - bulletWidth, // 右边缘
          top: 0,
          bottom: document.body.clientHeight - bulletHeight
        }
        let getLeft = () => {
          let left = pos.x - (bulletWidth / 2)
          if (left < range.left) left = range.left
          if (left > range.right) left = range.right
          return left
        }
        let getTop = () => {
          let top = pos.y - (bulletHeight / 2)
          if (top < range.top) top = range.top
          if (top > range.bottom) top = range.bottom
          return top
        }

        // 首次触发 mousemove
        if (this.isDraging === false) {
          this.isDraging = true
          this.$emit('dragStart')
        }

        moveBullet(getLeft(), getTop())
      }
      const dragEndObserver = (evt) => {
        this.isDraging = false
        this.$emit('dragEnd')
      }
      const mouseUp = fromEvent(document, 'mouseup')
      const mouseMove = fromEvent(document, 'mousemove')
      const mouseDown = fromEvent(bullet, 'mousedown').pipe(
        // 当 mouseDown 时，转成 mouseMove 的事件，当 mouseUp 时，mousemove 事件结束
        map(evt => mouseMove.pipe(takeUntil(mouseUp))),
        concatAll(),
        map(evt => ({ x: evt.clientX, y: evt.clientY }))
      )

      mouseDown.subscribe(dragObserver)
      mouseUp.subscribe(dragEndObserver)
    }
  },

  mounted () {
    this.observeDrag()
  }
}
</script>

<style lang="scss" scoped>
.bullet-button {
    width: 18px;
    height: 18px;
    margin: 1px 4px 1px 0;
    border-radius: 12px;
    position: relative;
    a {
      display: block;
      width: 18px;
      height: 18px;
      > i, > span {
        background: url("../../../assets/svg/bullet.svg") no-repeat;
        border-radius: 12px;
        width: 18px;
        height: 18px;
        display: block;
        position: absolute;
      }
      > i {
        content: "";
        z-index: 2;
      }
      > span {
        background-color: #aaa;
        z-index: 1;
      }
      &:hover, &.draging {
        > i {
          background-color: #aaa !important;
        }
      }
      &.draging {
        position: fixed;
        cursor: grab;
      }
    }
}
</style>
