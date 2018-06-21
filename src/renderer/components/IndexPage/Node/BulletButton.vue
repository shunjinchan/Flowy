<script>
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
    isCollapsed: {
      type: Boolean
    },
    handleClick: {
      type: Function,
      default () {
        return () => {}
      }
    }
  },

  render (h) {
    return (
      <div class="bullet-button">
        <a
          ref="bullet"
          class={{collapse: this.isCollapsed, draging: this.isDraging}}></a>
      </div>
    )
  },

  methods: {
    observe () {
      const bullet = this.$refs.bullet
      const mouseDown = fromEvent(bullet, 'mousedown')
      const mouseUp = fromEvent(document.body, 'mouseup')
      const mouseMove = fromEvent(document.body, 'mousemove')

      mouseDown.pipe(
        // 当 mouseDown 时，转成 mouseMove 的事件，当 mouseUp 时，mousemove 事件结束
        map(evt => mouseMove.pipe(takeUntil(mouseUp))),
        concatAll(),
        map(evt => ({ x: evt.clientX, y: evt.clientY }))
      ).subscribe(pos => {
        this.isDraging = true
        bullet.style.left = pos.x - (bullet.clientWidth / 2) + 'px'
        bullet.style.top = pos.y - (bullet.clientHeight / 2) + 'px'
      })

      mouseUp.subscribe((evt) => (this.isDraging = false))
    }
  },

  mounted () {
    this.observe()
  }
}
</script>

<style lang="scss" scoped>
.bullet-button {
    width: 18px;
    height: 18px;
    margin: 1px 4px 1px 0;
    border-radius: 12px;
    a {
      display: block;
      width: 18px;
      height: 18px;
      background: url("../../../assets/svg/bullet.svg") no-repeat;
      border-radius: 12px;

      &.collapse {
        background-color: #e0e0e0;
      }
      &:hover, &.draging {
          background-color: #aaa;
      }
      &.draging {
        position: fixed;
        cursor: grab;
      }
    }
}
</style>
