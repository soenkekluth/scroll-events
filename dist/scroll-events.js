'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _delegatejs = require('delegatejs');

var _delegatejs2 = _interopRequireDefault(_delegatejs);

var _eventdispatcher = require('eventdispatcher');

var _eventdispatcher2 = _interopRequireDefault(_eventdispatcher);

var _scrollParent = require('./scroll-parent');

var _scrollParent2 = _interopRequireDefault(_scrollParent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScrollEvents = function (_EventDispatcher) {
  _inherits(ScrollEvents, _EventDispatcher);

  _createClass(ScrollEvents, null, [{
    key: 'getInstance',
    value: function getInstance(scrollTarget, options) {
      if (!scrollTarget.scrollEvents) {
        return new ScrollEvents(scrollTarget, options);
      }
      return scrollTarget.scrollEvents;
    }
  }, {
    key: 'hasInstance',
    value: function hasInstance(scrollTarget) {
      return typeof scrollTarget.scrollEvents !== 'undefined';
    }
  }, {
    key: 'getScrollParent',
    value: function getScrollParent(element) {
      return (0, _scrollParent2.default)(element);
    }
  }, {
    key: 'unprefixAnimationFrame',
    value: function unprefixAnimationFrame() {
      if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
      }
    }
  }, {
    key: 'directionToString',
    value: function directionToString(direction) {
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
  }, {
    key: 'windowScrollY',
    get: function get() {
      return window.pageYOffset || window.scrollY || 0;
    }
  }, {
    key: 'windowScrollX',
    get: function get() {
      return window.pageXOffset || window.scrollX || 0;
    }
  }, {
    key: 'documentHeight',
    get: function get() {
      return Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
    }
  }, {
    key: 'documentWidth',
    get: function get() {
      return Math.max(document.body.scrollWidth, document.body.offsetWidth, document.documentElement.clientWidth, document.documentElement.scrollWidth, document.documentElement.offsetWidth);
    }
  }]);

  function ScrollEvents() {
    var scrollTarget = arguments.length <= 0 || arguments[0] === undefined ? window : arguments[0];
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, ScrollEvents);

    if (ScrollEvents.hasScrollTarget(scrollTarget)) {
      var _ret;

      return _ret = ScrollEvents.getInstance(scrollTarget), _possibleConstructorReturn(_this, _ret);
    }

    var _this = _possibleConstructorReturn(this, (ScrollEvents.__proto__ || Object.getPrototypeOf(ScrollEvents)).call(this, { target: scrollTarget }));

    scrollTarget.scrollEvents = _this;
    _this._scrollTarget = scrollTarget;
    _this.options = options;

    if (Can.animationFrame) {
      ScrollEvents.unprefixAnimationFrame();
    }

    _this.init();

    return _this;
  }

  _createClass(ScrollEvents, [{
    key: 'init',
    value: function init() {

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

      this.getScrollPosition = this._scrollTarget === window ? (0, _delegatejs2.default)(this, this._getWindowScrollPosition) : (0, _delegatejs2.default)(this, this._getElementScrollPosition);

      this.onScroll = (0, _delegatejs2.default)(this, this.onScroll);
      this.onResize = (0, _delegatejs2.default)(this, this.onResize);
      this.onNextFrame = (0, _delegatejs2.default)(this, this.onNextFrame);

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
  }, {
    key: 'update',
    value: function update() {
      var scrollY = this._scrollY;
      var scrollX = this._scrollX;
      this.updateScrollPosition();
      if (scrollY !== this.y || scrollX !== this.x) {
        this.trigger(ScrollEvents.EVENT_SCROLL_PROGRESS);
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      if (!this._destroyed) {
        this._cancelNextFrame();

        _get(ScrollEvents.prototype.__proto__ || Object.getPrototypeOf(ScrollEvents.prototype), 'destroy', this).call(this);

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
  }, {
    key: 'updateScrollPosition',
    value: function updateScrollPosition() {

      this._scrollY = this.scrollY;
      this._scrollX = this.scrollX;
    }
  }, {
    key: '_getWindowScrollPosition',
    value: function _getWindowScrollPosition() {
      return {
        y: ScrollEvents.windowScrollY,
        x: ScrollEvents.windowScrollX
      };
    }
  }, {
    key: '_getElementScrollPosition',
    value: function _getElementScrollPosition() {
      return {
        y: this._scrollTarget.scrollTop,
        x: this._scrollTarget.scrollLeft
      };
    }
  }, {
    key: 'onResize',
    value: function onResize() {
      this.trigger(ScrollEvents.EVENT_SCROLL_RESIZE);
    }
  }, {
    key: 'onScroll',
    value: function onScroll() {
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
  }, {
    key: 'onNextFrame',
    value: function onNextFrame() {
      var _this2 = this;

      // this._lastSpeed = this.speedY;
      this._speedY = this._scrollY - this.scrollY;
      this._speedX = this._scrollX - this.scrollX;

      var speed = +this.speedY + +this.speedX;
      if (this._scrolling && speed === 0 && this._currentStopFrames++ > this._stopFrames) {
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
        this._nextTimeout = setTimeout(function () {
          _this2.onNextFrame();
        }, 1000 / 60);
      }
    }
  }, {
    key: 'onScrollStop',
    value: function onScrollStop() {

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
  }, {
    key: '_cancelNextFrame',
    value: function _cancelNextFrame() {
      if (Can.animationFrame) {
        window.cancelAnimationFrame(this.nextFrameID);
        this.nextFrameID = -1;
      } else {
        clearTimeout(this._nextTimeout);
      }
    }
  }, {
    key: 'destroyed',
    get: function get() {
      return this._destroyed;
    }
  }, {
    key: 'scrollPosition',
    get: function get() {
      return this.getScrollPosition();
    }
  }, {
    key: 'directionY',
    get: function get() {
      if (!this._canScrollY || this.speedY === 0 && !this._scrolling) {
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
  }, {
    key: 'directionX',
    get: function get() {
      if (!this._canScrollX || this.speedX === 0 && !this._scrolling) {
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
  }, {
    key: 'attributes',
    get: function get() {
      return {
        y: this.y,
        x: this.x,
        speedY: this.speedY,
        speedX: this.speedX,
        directionY: this.directionY,
        directionX: this.directionX
      };
    }
  }, {
    key: 'scrollTarget',
    get: function get() {
      return this._scrollTarget;
    }
  }, {
    key: 'delta',
    get: function get() {
      return this.directionY;
    }
  }, {
    key: 'scrolling',
    get: function get() {
      return this._scrolling;
    }
  }, {
    key: 'speedY',
    get: function get() {
      return this._speedY;
    }
  }, {
    key: 'speedX',
    get: function get() {
      return this._speedX;
    }
  }, {
    key: 'scrollY',
    get: function get() {
      return this.scrollPosition.y;
    }
  }, {
    key: 'y',
    get: function get() {
      return this.scrollY;
    }
  }, {
    key: 'scrollX',
    get: function get() {
      return this.scrollPosition.x;
    }
  }, {
    key: 'x',
    get: function get() {
      return this.scrollX;
    }
  }, {
    key: 'clientHeight',
    get: function get() {
      return this._scrollTarget === window ? window.innerHeight : this._scrollTarget.clientHeight;
    }
  }, {
    key: 'clientWidth',
    get: function get() {
      return this._scrollTarget === window ? window.innerWidth : this._scrollTarget.clientWidth;
    }
  }, {
    key: 'scrollHeight',
    get: function get() {
      return this._scrollTarget === window ? ScrollEvents.documentHeight : this._scrollTarget.scrollHeight;
    }
  }, {
    key: 'scrollWidth',
    get: function get() {
      return this._scrollTarget === window ? ScrollEvents.documentWidth : this._scrollTarget.scrollWidth;
    }
  }]);

  return ScrollEvents;
}(_eventdispatcher2.default);

ScrollEvents.hasScrollTarget = ScrollEvents.hasInstance;
ScrollEvents.UP = -1;
ScrollEvents.DOWN = 1;
ScrollEvents.NONE = 0;
ScrollEvents.RIGHT = 2;
ScrollEvents.LEFT = -2;
ScrollEvents.EVENT_SCROLL_PROGRESS = 'scroll:progress';
ScrollEvents.EVENT_SCROLL_START = 'scroll:start';
ScrollEvents.EVENT_SCROLL_STOP = 'scroll:stop';
ScrollEvents.EVENT_SCROLL_DOWN = 'scroll:down';
ScrollEvents.EVENT_SCROLL_UP = 'scroll:up';
ScrollEvents.EVENT_SCROLL_MIN = 'scroll:min';
ScrollEvents.EVENT_SCROLL_MAX = 'scroll:max';
ScrollEvents.EVENT_SCROLL_RESIZE = 'scroll:resize';
exports.default = ScrollEvents;

var Can = function () {
  function Can() {
    _classCallCheck(this, Can);
  }

  _createClass(Can, null, [{
    key: 'animationFrame',
    get: function get() {
      return !!(window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame);
    }
  }]);

  return Can;
}();

module.exports = exports['default'];