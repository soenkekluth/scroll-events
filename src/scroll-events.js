import delegate from 'delegatejs';
import EventDispatcher from 'eventdispatcher';

const _instanceMap = {};


export default class ScrollEvents extends EventDispatcher {

  static getInstance = (_scrollTarget, options) => {
    if (!_instanceMap[_scrollTarget]) {
      _instanceMap[_scrollTarget] = new ScrollEvents(_scrollTarget, options);
    }
    return _instanceMap[_scrollTarget];
  };

  static hasInstance = (_scrollTarget) => {
    return (typeof _instanceMap[_scrollTarget] !== 'undefined');
  };

  static hasScrollTarget = ScrollEvents.hasInstance;

  static clearInstance = (_scrollTarget = window) => {
    if (ScrollEvents.hasInstance(_scrollTarget)) {
      ScrollEvents.getInstance(_scrollTarget).destroy();
      delete _instanceMap[_scrollTarget];
    }
  };


  static get documentHeight() {
    return Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
  }

  static get documentWidth() {
    return Math.max(document.body.scrollWidth, document.body.offsetWidth, document.documentElement.clientWidth, document.documentElement.scrollWidth, document.documentElement.offsetWidth);
  }


  static unprefixAnimationFrame = () => {
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
  };

  static UP = -1;
  static DOWN = 1;
  static NONE = 0;
  static LEFT = -2;
  static RIGHT = 2;

  static EVENT_SCROLL_PROGRESS = 'scroll:progress';
  static EVENT_SCROLL_START = 'scroll:start';
  static EVENT_SCROLL_STOP = 'scroll:stop';
  static EVENT_SCROLL_DOWN = 'scroll:down';
  static EVENT_SCROLL_UP = 'scroll:up';
  static EVENT_SCROLL_TOP = 'scroll:top';
  static EVENT_SCROLL_BOTTOM = 'scroll:bottom';
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

    super();

    if (ScrollEvents.hasScrollTarget(scrollTarget)) {
      return ScrollEvents.getInstance(scrollTarget);
    }

    this._scrollTarget = scrollTarget;
    this.options = options;

    _instanceMap[scrollTarget] = this;

    this.options.animationFrame = Can.animationFrame;
    if (this.options.animationFrame) {
      ScrollEvents.unprefixAnimationFrame();
    }

    this._destroyed = false;
    this._scrollY = 0;
    this._scrollX = 0;
    this._timeout = 0;
    this._speedY = 0;
    this._speedX = 0;
    this._lastSpeed = 0;
    this._lastDirection = ScrollEvents.NONE;
    this._stopFrames = 3;
    this._currentStopFrames = 0;
    this._firstRender = true;
    this._directionY = ScrollEvents.NONE;
    this._directionX = ScrollEvents.NONE;
    this._scrolling = false;

    this.init();

  }

  init() {

    this.getScrollPosition = (this._scrollTarget === window) ? delegate(this, this._getWindowScrollPosition) : delegate(this, this._getElementScrollPosition);

    this.onScroll = delegate(this, this.onScroll);
    this.onResize = delegate(this, this.onResize);
    this.onNextFrame = delegate(this, this.onNextFrame);

    this.updateScrollPosition();

    if (this._scrollTarget.addEventListener) {
      // this._scrollTarget.addEventListener('mousewheel', this.onScroll, Can.passiveEvents ? { passive: true } : false);
      this._scrollTarget.addEventListener('scroll', this.onScroll, Can.passiveEvents ? { passive: true } : false);
      this._scrollTarget.addEventListener('resize' ,this.onResize, false);
    } else if (this._scrollTarget.attachEvent) {
      // this._scrollTarget.attachEvent('onmousewheel', this.onScroll);
      this._scrollTarget.attachEvent('scroll', this.onScroll);
      this._scrollTarget.attachEvent('resize', this.onResize);
    }
  }


  update(){
    var scrollY = this._scrollY;
    this.updateScrollPosition();
    if(scrollY !== this.y){
      this.dispatchEvent(ScrollEvents.EVENT_SCROLL_PROGRESS);
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

  get attr() {
    return {
      scrollY: this.scrollY,
      // scrollX: this.scrollX,
      speedY: this.speedY,
      // speedX: this.speedX,
      // angle: 0,
      directionY: this.directionY
        // directionX: this.directionX
    };
  }


  updateScrollPosition() {
    this._scrollY = this.scrollY;
    // this._scrollX = this.scrollX;
  }


  get scrollPosition() {
    return this.getScrollPosition();
  }


  get directionY() {
    if (this.speedY === 0 && !this._scrolling) {
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
    if (this.speedX === 0 && !this._scrolling) {
      this._directionX = ScrollEvents.NONE;
    } else {
      if (this.speedX > 0) {
        this._directionX = ScrollEvents.RIGHT;
      } else if (this.speedX < 0) {
        this._directionX = ScrollEvents.LEFT;
      }
    }
    return this._directionX;
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
    //document.documentElement.clientHeight
  }

  get clientWidth() {
    return (this._scrollTarget === window ? window.innerWidth : this._scrollTarget.clientWidth);
    //document.documentElement.clientHeight
  }


  get scrollHeight() {
    return (this._scrollTarget === window ? ScrollEvents.documentHeight : this._scrollTarget.scrollHeight);
  }

  get scrollWidth() {
    return (this._scrollTarget === window ? ScrollEvents.documentHeight : this._scrollTarget.scrollHeight);
  }

  _getWindowScrollPosition() {
    return {
      y: (window.pageYOffset || window.scrollY || 0),
      // x: (window.pageXOffset || window.scrollX || 0)
    }
  }

  _getElementScrollPosition() {
    return {
      y: this._scrollTarget.scrollTop,
      // x: this._scrollTarget.scrollLeft
    }
  }

  onResize() {
    this.dispatchEvent(ScrollEvents.EVENT_SCROLL_RESIZE);
  }


  onScroll() {
    this._currentStopFrames = 0;
    if (this._firstRender) {
      this._firstRender = false;
      if (this.scrollY > 1) {

        this.updateScrollPosition();
        this.dispatchEvent(ScrollEvents.EVENT_SCROLL_PROGRESS);
        return;
      }
    }

    if (!this._scrolling) {
      this._scrolling = true;

      this.dispatchEvent(ScrollEvents.EVENT_SCROLL_START);
      if (this.options.animationFrame) {
        this.nextFrameID = window.requestAnimationFrame(this.onNextFrame);
      } else {
        clearTimeout(this._timeout);
        this.onNextFrame();
        var self = this;
        this._timeout = setTimeout(function() {
          self.onScrollStop();
        }, 100);
      }
    }
  }

  onNextFrame() {

    this._lastDirection = this.directionY;
    // this._lastSpeed = this.speedY;
    this._speedY = this._scrollY - this.scrollY;
    // this._speedX = this._scrollX - this.scrollX;



    // if(this.options.animationFrame && this._scrolling && ((this._scrollY === this.scrollY ) && (this._lastSpeed === 0 && this.speedY === 0) && (this.directionY === this._lastDirection) && (++this._currentStopFrames > this._stopFrames) /*&& this.directionY === this._lastDirection*/) ){
    //   this.onScrollStop();
    //   return;
    // }


    if (this.options.animationFrame && (this._scrolling && (this.speedY === 0 && (this._currentStopFrames++ > this._stopFrames)))) {
      this.onScrollStop();
      return;
    }


    this.updateScrollPosition();

    // console.log(this._lastDirection, this.directionY);
    if (this._lastDirection !== this.directionY) {
      this.dispatchEvent('scroll:' + ScrollEvents.directionToString(this.directionY));
    }

    this.dispatchEvent(ScrollEvents.EVENT_SCROLL_PROGRESS);

    if (this.options.animationFrame) {
      this.nextFrameID = window.requestAnimationFrame(this.onNextFrame);
    }
  }

  onScrollStop() {
    this._scrolling = false;
    this.updateScrollPosition();


    this.dispatchEvent(ScrollEvents.EVENT_SCROLL_STOP);

    if (this.scrollY <= 0) {
      this.dispatchEvent(ScrollEvents.EVENT_SCROLL_TOP);
    } else {


      if (this.scrollY + this.clientHeight >= this.scrollHeight) {
        this.dispatchEvent(ScrollEvents.EVENT_SCROLL_BOTTOM);
      }
    }

    // this.dispatchEvent('scroll:none');
    // this._scrollX = this.scrollX;
    if (this.options.animationFrame) {
      this._cancelNextFrame();
      this._currentStopFrames = 0;
    }

  }

  _cancelNextFrame() {
    window.cancelAnimationFrame(this.nextFrameID);
    this.nextFrameID = 0;
  }

}


var passiveEvents = null;

class Can {


  static get animationFrame() {
    return !!(window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame);
  };


  static get passiveEvents() {
    if (passiveEvents !== null) {
      return passiveEvents;
    }
    try {
      var opts = Object.defineProperty({}, 'passive', {
        get: () => {
          passiveEvents = true;
        }
      });
      window.addEventListener("test", null, opts);
    } catch (e) {
      passiveEvents = false;
    }
  }
}
