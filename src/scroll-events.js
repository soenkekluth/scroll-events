import EventDispatcher from 'eventdispatcher';
import scrollParent from './scroll-parent';

export default class ScrollEvents extends EventDispatcher {

  static getInstance(scrollTarget, options) {
    if (!scrollTarget.scrollEvents) {
      return new ScrollEvents(scrollTarget, options);
    }
    return scrollTarget.scrollEvents;
  }

  static hasInstance(scrollTarget) {
    return (typeof scrollTarget.scrollEvents !== 'undefined');
  }

  static getScrollParent(element){
    return scrollParent(element);
  }

  static hasScrollTarget = ScrollEvents.hasInstance;

  static get windowScrollY() {
    return (window.pageYOffset || window.scrollY || 0);
  }

  static get windowScrollX() {
    return (window.pageXOffset || window.scrollX || 0);
  }

  static get documentHeight() {
    return Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
  }

  static get documentWidth() {
    return Math.max(document.body.scrollWidth, document.body.offsetWidth, document.documentElement.clientWidth, document.documentElement.scrollWidth, document.documentElement.offsetWidth);
  }

  static unprefixAnimationFrame() {
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
      window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
    }
  }

  static UP = -1;
  static DOWN = 1;
  static NONE = 0;
  static RIGHT = 2;
  static LEFT = -2;

  static EVENT_SCROLL_PROGRESS = 'scroll:progress';
  static EVENT_SCROLL_START = 'scroll:start';
  static EVENT_SCROLL_STOP = 'scroll:stop';
  static EVENT_SCROLL_DOWN = 'scroll:down';
  static EVENT_SCROLL_UP = 'scroll:up';
  static EVENT_SCROLL_MIN = 'scroll:min';
  static EVENT_SCROLL_MAX = 'scroll:max';
  static EVENT_SCROLL_RESIZE = 'scroll:resize';


  static directionToString(direction) {
    switch (direction) {
      case ScrollEvents.UP:
        return 'up';
      case ScrollEvents.DOWN:
        return 'down';
      case ScrollEvents.NONE:
        return 'none';
      case ScrollEvents.LEFT:
        return 'left';
      case ScrollEvents.RIGHT:
        return 'right';
    }
  }

  constructor(scrollTarget = window, options = {}) {

    if (ScrollEvents.hasScrollTarget(scrollTarget)) {
      return ScrollEvents.getInstance(scrollTarget);
    }

    super({ target: scrollTarget });

    scrollTarget.scrollEvents = this;
    this._scrollTarget = scrollTarget;
    this.options = options;

    if (Can.animationFrame) {
      ScrollEvents.unprefixAnimationFrame();
    }

    this.init();

  }

  init() {

    this._destroyed = false;
    this._scrollY = 0;
    this._scrollX = 0;
    this._speedY = 0;
    this._speedX = 0;
    this._lastSpeed = 0;
    this._lastDirectionY = ScrollEvents.NONE;
    this._lastDirectionX = ScrollEvents.NONE;
    this._stopFrames = 3;
    this._currentStopFrames = 0;
    this._firstRender = true;
    this._directionY = ScrollEvents.NONE;
    this._directionX = ScrollEvents.NONE;
    this._scrolling = false;
    this._canScrollY = false;
    this._canScrollX = false;

    this.getScrollPosition = (this._scrollTarget === window) ?  this._getWindowScrollPosition.bind(this) : this._getElementScrollPosition.bind(this);

    this.onScroll = this.onScroll.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onNextFrame = this.onNextFrame.bind(this);

    this.updateScrollPosition();

    this._canScrollY = this.clientHeight < this.scrollHeight;
    this._canScrollX = this.clientWidth < this.scrollWidth;
    if (this._scrollTarget !== window) {
      var style = window.getComputedStyle(this._scrollTarget);
      this._canScrollY = style['overflow-y'] !== 'hidden';
      this._canScrollX = style['overflow-x'] !== 'hidden';
    }

    if (this._scrollTarget.addEventListener) {
      // this._scrollTarget.addEventListener('mousewheel', this.onScroll, Can.passiveEvents ? { passive: true } : false);
      this._scrollTarget.addEventListener('scroll', this.onScroll, false);
      this._scrollTarget.addEventListener('resize', this.onResize, false);
    } else if (this._scrollTarget.attachEvent) {
      // this._scrollTarget.attachEvent('onmousewheel', this.onScroll);
      this._scrollTarget.attachEvent('scroll', this.onScroll);
      this._scrollTarget.attachEvent('resize', this.onResize);
    }
  }


  update() {
    var scrollY = this._scrollY;
    var scrollX = this._scrollX;
    this.updateScrollPosition();
    if (scrollY !== this.y || scrollX !== this.x) {
      this.trigger(ScrollEvents.EVENT_SCROLL_PROGRESS);
    }
  }


  get destroyed() {
    return this._destroyed;
  }


  destroy() {
    if (!this._destroyed) {
      this._cancelNextFrame();

      super.destroy();

      if (this._scrollTarget.addEventListener) {
        // this._scrollTarget.removeEventListener('mousewheel', this.onScroll);
        this._scrollTarget.removeEventListener('scroll', this.onScroll);
        this._scrollTarget.removeEventListener('resize', this.onResize);
      } else if (this._scrollTarget.attachEvent) {
        // this._scrollTarget.detachEvent('onmousewheel', this.onScroll);
        this._scrollTarget.detachEvent('scroll', this.onScroll);
        this._scrollTarget.detachEvent('resize', this.onResize);
      }

      this.onResize = null;
      this.onScroll = null;
      this.getScrollPosition = null;
      this.onNextFrame = null;
      this._scrollTarget = null;
      this._destroyed = true;
    }
  }


  updateScrollPosition() {

    this._scrollY = this.scrollY;
    this._scrollX = this.scrollX;
  }


  get scrollPosition() {
    return this.getScrollPosition();
  }


  get directionY() {
    if (!this._canScrollY || (this.speedY === 0 && !this._scrolling)) {
      this._directionY = ScrollEvents.NONE;
    } else {
      if (this.speedY > 0) {
        this._directionY = ScrollEvents.UP;
      } else if (this.speedY < 0) {
        this._directionY = ScrollEvents.DOWN;
      }
    }
    return this._directionY;
  }

  get directionX() {
    if (!this._canScrollX || (this.speedX === 0 && !this._scrolling)) {
      this._directionX = ScrollEvents.NONE;
    } else {
      if (this.speedX > 0) {
        this._directionX = ScrollEvents.LEFT;
      } else if (this.speedX < 0) {
        this._directionX = ScrollEvents.RIGHT;
      }
    }
    return this._directionX;
  }

  get attributes() {
    return {
      y: this.y,
      x: this.x,
      speedY: this.speedY,
      speedX: this.speedX,
      directionY: this.directionY,
      directionX: this.directionX
    };
  }

  get scrollTarget() {
    return this._scrollTarget;
  }

  get delta() {
    return this.directionY;
  }

  get scrolling() {
    return this._scrolling;
  }

  get speedY() {
    return this._speedY;
  }

  get speedX() {
    return this._speedX;
  }


  get scrollY() {
    return this.scrollPosition.y;
  }

  get y() {
    return this.scrollY;
  }

  get scrollX() {
    return this.scrollPosition.x;
  }

  get x() {
    return this.scrollX;
  }


  get clientHeight() {
    return (this._scrollTarget === window ? window.innerHeight : this._scrollTarget.clientHeight);
  }

  get clientWidth() {
    return (this._scrollTarget === window ? window.innerWidth : this._scrollTarget.clientWidth);
  }


  get scrollHeight() {
    return (this._scrollTarget === window ? ScrollEvents.documentHeight : this._scrollTarget.scrollHeight);
  }

  get scrollWidth() {
    return (this._scrollTarget === window ? ScrollEvents.documentWidth : this._scrollTarget.scrollWidth);
  }

  _getWindowScrollPosition() {
    return {
      y: ScrollEvents.windowScrollY,
      x: ScrollEvents.windowScrollX
    };
  }

  _getElementScrollPosition() {
    return {
      y: this._scrollTarget.scrollTop,
      x: this._scrollTarget.scrollLeft
    };
  }

  onResize() {
    this.trigger(ScrollEvents.EVENT_SCROLL_RESIZE);
  }


  onScroll() {
    this._currentStopFrames = 0;
    if (this._firstRender) {
      this._firstRender = false;
      if (this.y > 1 || this.x > 1) {
        this.updateScrollPosition();
        this.trigger(ScrollEvents.EVENT_SCROLL_PROGRESS);
        return;
      }
    }

    if (!this._scrolling) {
      this._scrolling = true;
      this._lastDirectionY = ScrollEvents.NONE;
      this._lastDirectionX = ScrollEvents.NONE;
      this.trigger(ScrollEvents.EVENT_SCROLL_START);
      if (Can.animationFrame) {
        this.nextFrameID = window.requestAnimationFrame(this.onNextFrame);
      } else {
        this.onNextFrame();
      }
    }
  }

  onNextFrame() {

    // this._lastSpeed = this.speedY;
    this._speedY = this._scrollY - this.scrollY;
    this._speedX = this._scrollX - this.scrollX;

    var speed = (+this.speedY) + (+this.speedX);
    if (this._scrolling && (speed === 0 && (this._currentStopFrames++ > this._stopFrames))) {
      this.onScrollStop();
      return;
    }

    this.updateScrollPosition();

    if (this._lastDirectionY !== this.directionY) {
      this.trigger('scroll:' + ScrollEvents.directionToString(this.directionY));
    }
    if (this._lastDirectionX !== this.directionX) {
      this.trigger('scroll:' + ScrollEvents.directionToString(this.directionX));
    }

    this._lastDirectionY = this.directionY;
    this._lastDirectionX = this.directionX;

    this.trigger(ScrollEvents.EVENT_SCROLL_PROGRESS);

    if (Can.animationFrame) {
      this.nextFrameID = window.requestAnimationFrame(this.onNextFrame);
    } else {
      this._nextTimeout = setTimeout(() => {
        this.onNextFrame();
      }, 1000 / 60);
    }
  }

  onScrollStop() {

    this._scrolling = false;
    this.updateScrollPosition();

    this.trigger(ScrollEvents.EVENT_SCROLL_STOP);

    if (this._canScrollY) {
      if (this.y <= 0) {
        this.trigger(ScrollEvents.EVENT_SCROLL_MIN);
      } else if (this.y + this.clientHeight >= this.scrollHeight) {
        this.trigger(ScrollEvents.EVENT_SCROLL_MAX);
      }
    }

    if (this._canScrollX) {
      if (this.x <= 0) {
        this.trigger(ScrollEvents.EVENT_SCROLL_MIN);
      } else if (this.x + this.clientWidth >= this.scrollWidth) {
        this.trigger(ScrollEvents.EVENT_SCROLL_MAX);
      }
    }

    this._currentStopFrames = 0;
    this._cancelNextFrame();
  }

  _cancelNextFrame() {
    if (Can.animationFrame) {
      window.cancelAnimationFrame(this.nextFrameID);
      this.nextFrameID = -1;
    } else {
      clearTimeout(this._nextTimeout);
    }
  }

}

class Can {
  static get animationFrame() {
    return !!(window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame);
  }
}
