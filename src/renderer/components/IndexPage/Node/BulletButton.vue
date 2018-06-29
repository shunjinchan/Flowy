<script>
// import _ from 'lodash'
import { fromEvent } from 'rxjs'
import {
  map, concatAll, takeUntil, filter, withLatestFrom, throttleTime
} from 'rxjs/operators'

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
      const validValue = (value, max, min) => {
        return Math.min(Math.max(value, min), max)
      }
      const dragObserver = (pos) => {
        this.isDraging = true
        // 首次触发 mousemove
        this.$parent.$emit('dragStart')
        moveBullet(pos.x, pos.y)
      }
      const dragEndObserver = (evt) => {
        this.isDraging = false
        this.$parent.$emit('dragEnd')
      }
      const mouseUp = fromEvent(document, 'mouseup')
      const mouseMove = fromEvent(document, 'mousemove')
      const mouseDown = fromEvent(bullet, 'mousedown')

      mouseDown.pipe(
        filter(evt => !bullet.classList.contains('draging')),
        // 当 mouseDown 时，转成 mouseMove 的事件，当 mouseUp 时，mousemove 事件结束
        map(evt => mouseMove.pipe(takeUntil(mouseUp), throttleTime(12))),
        // map 操作符本身返回一个 Observable
        // .pipe 返回的也是一个 Observable，使用 concatAll 摊平
        concatAll(),
        // 只有在主要的 observable 送出新的值时，才會执行 callback
        // 在这里主要的 observable 就是 mousemove
        withLatestFrom(mouseDown, (move, down) => ({
          // 限制移动点，不要超出浏览器视口
          x: validValue(
            move.clientX - down.offsetX, window.innerWidth - bulletWidth, 0
          ),
          y: validValue(
            move.clientY - down.offsetY, window.innerHeight - bulletHeight, 0
          )
        }))
      ).subscribe(dragObserver)

      mouseUp.pipe(
        filter(evt => bullet.classList.contains('draging'))
      ).subscribe(dragEndObserver)
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
