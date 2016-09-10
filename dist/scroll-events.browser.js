(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ScrollEvents = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var delegate = function(target, handler) {
  var args = arguments.length <= 2 ? [] : [].slice.call(arguments, 2);
  return function() {
    return handler.apply(target, (arguments.length ? args.slice().concat([].slice.call(arguments)) : args));
  };
};
module.exports = delegate;

},{}],2:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }
  return true;
}

var EventDispatcher = function () {
  function EventDispatcher() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var target = _ref.target;
    var currentTarget = _ref.currentTarget;

    _classCallCheck(this, EventDispatcher);

    this._eventMap = {};
    this._destroyed = false;
    this._target = target || this;
    this._currentTarget = currentTarget || this;

    this.on = this.bind = this.addEventListener = this.addListener;
    this.off = this.unbind = this.removeEventListener = this.removeListener;
    this.once = this.one = this.addListenerOnce;
    this.emit = this.trigger = this.dispatchEvent = this.dispatch;
  }

  EventDispatcher.prototype.addListener = function addListener(event, listener) {
    var listeners = this.getListener(event);
    if (!listeners) {
      this._eventMap[event] = [listener];
    } else if (listeners.indexOf(listener) === -1) {
      listeners.push(listener);
    }
    return this;
  };

  EventDispatcher.prototype.addListenerOnce = function addListenerOnce(event, listener) {
    var _this = this;

    var _f = function f2(e) {
      listener(e);
      _this.off(event, _f);
      listener = null;
      _f = null;
    };
    return this.on(event, _f);
  };

  EventDispatcher.prototype.removeListener = function removeListener(event, listener) {

    if (!listener) {
      return this.removeAllListener(event);
    }

    var listeners = this.getListener(event);
    if (listeners) {
      var i = listeners.indexOf(listener);
      if (i > -1) {
        listeners = listeners.splice(i, 1);
        if (!listeners.length) {
          delete this._eventMap[event];
        }
      }
    }
    return this;
  };

  EventDispatcher.prototype.removeAllListener = function removeAllListener(event) {
    var listeners = this.getListener(event);
    if (listeners) {
      this._eventMap[event].length = 0;
      delete this._eventMap[event];
    }
    return this;
  };

  EventDispatcher.prototype.hasListener = function hasListener(event) {
    return this.getListener(event) !== null;
  };

  EventDispatcher.prototype.hasListeners = function hasListeners() {
    return this._eventMap !== null && this._eventMap !== undefined && !isEmpty(this._eventMap);
  };

  EventDispatcher.prototype.dispatch = function dispatch(eventType, eventObject) {
    var listeners = this.getListener(eventType);

    if (listeners) {
      eventObject = eventObject || {};
      eventObject.type = eventType;
      eventObject.target = eventObject.target || this._target;
      eventObject.currentTarget = eventObject.currentTarget || this._currentTarget;

      var i = -1;
      while (++i < listeners.length) {
        listeners[i](eventObject);
      }
    }
    return this;
  };

  EventDispatcher.prototype.getListener = function getListener(event) {
    var result = this._eventMap ? this._eventMap[event] : null;
    return result || null;
  };

  EventDispatcher.prototype.destroy = function destroy() {
    if (this._eventMap) {
      for (var i in this._eventMap) {
        this.removeAllListener(i);
      }
      this._eventMap = null;
    }
    this._destroyed = true;
    return this;
  };

  return EventDispatcher;
}();

exports.default = EventDispatcher;
module.exports = exports['default'];
},{}],3:[function(_dereq_,module,exports){
'use strict';var _scrollEvents=_dereq_('./scroll-events');var _scrollEvents2=_interopRequireDefault(_scrollEvents);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}module.exports=_scrollEvents2.default;

},{"./scroll-events":4}],4:[function(_dereq_,module,exports){
'use strict';Object.defineProperty(exports,'__esModule',{value:true});exports.default=undefined;var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _delegatejs=_dereq_('delegatejs');var _delegatejs2=_interopRequireDefault(_delegatejs);var _eventdispatcher=_dereq_('eventdispatcher');var _eventdispatcher2=_interopRequireDefault(_eventdispatcher);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _defaults(obj,defaults){var keys=Object.getOwnPropertyNames(defaults);for(var i=0;i<keys.length;i++){var key=keys[i];var value=Object.getOwnPropertyDescriptor(defaults,key);if(value&&value.configurable&&obj[key]===undefined){Object.defineProperty(obj,key,value)}}return obj}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called')}return call&&(typeof call==='object'||typeof call==='function')?call:self}function _inherits(subClass,superClass){if(typeof superClass!=='function'&&superClass!==null){throw new TypeError('Super expression must either be null or a function, not '+typeof superClass)}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):_defaults(subClass,superClass)}var ScrollEvents=function(_EventDispatcher){_inherits(ScrollEvents,_EventDispatcher);ScrollEvents.getInstance=function getInstance(scrollTarget,options){if(!scrollTarget.scrollEvents){return new ScrollEvents(scrollTarget,options)}return scrollTarget.scrollEvents};ScrollEvents.hasInstance=function hasInstance(scrollTarget){return typeof scrollTarget.scrollEvents!=='undefined'};ScrollEvents.unprefixAnimationFrame=function unprefixAnimationFrame(){window.requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame;window.cancelAnimationFrame=window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame||window.msCancelAnimationFrame};ScrollEvents.directionToString=function directionToString(direction){switch(direction){case ScrollEvents.UP:return'up';case ScrollEvents.DOWN:return'down';case ScrollEvents.NONE:return'none';case ScrollEvents.LEFT:return'left';case ScrollEvents.RIGHT:return'right';}};_createClass(ScrollEvents,null,[{key:'windowScrollY',get:function get(){return window.pageYOffset||window.scrollY||0}},{key:'windowScrollX',get:function get(){return window.pageXOffset||window.scrollX||0}},{key:'documentHeight',get:function get(){return Math.max(document.body.scrollHeight,document.body.offsetHeight,document.documentElement.clientHeight,document.documentElement.scrollHeight,document.documentElement.offsetHeight)}},{key:'documentWidth',get:function get(){return Math.max(document.body.scrollWidth,document.body.offsetWidth,document.documentElement.clientWidth,document.documentElement.scrollWidth,document.documentElement.offsetWidth)}}]);function ScrollEvents(){var scrollTarget=arguments.length<=0||arguments[0]===undefined?window:arguments[0];var options=arguments.length<=1||arguments[1]===undefined?{}:arguments[1];_classCallCheck(this,ScrollEvents);if(ScrollEvents.hasScrollTarget(scrollTarget)){var _ret;return _ret=ScrollEvents.getInstance(scrollTarget),_possibleConstructorReturn(_this,_ret)}var _this=_possibleConstructorReturn(this,_EventDispatcher.call(this,{target:scrollTarget}));scrollTarget.scrollEvents=_this;_this._scrollTarget=scrollTarget;_this.options=options;_this.options.animationFrame=Can.animationFrame;if(_this.options.animationFrame){ScrollEvents.unprefixAnimationFrame()}_this.init();return _this}ScrollEvents.prototype.init=function init(){this._destroyed=false;this._scrollY=0;this._scrollX=0;this._timeout=0;this._speedY=0;this._speedX=0;this._lastSpeed=0;this._lastDirectionY=ScrollEvents.NONE;this._lastDirectionX=ScrollEvents.NONE;this._stopFrames=3;this._currentStopFrames=0;this._firstRender=true;this._directionY=ScrollEvents.NONE;this._directionX=ScrollEvents.NONE;this._scrolling=false;this._canScrollY=false;this._canScrollX=false;this.getScrollPosition=this._scrollTarget===window?(0,_delegatejs2.default)(this,this._getWindowScrollPosition):(0,_delegatejs2.default)(this,this._getElementScrollPosition);this.onScroll=(0,_delegatejs2.default)(this,this.onScroll);this.onResize=(0,_delegatejs2.default)(this,this.onResize);this.onNextFrame=(0,_delegatejs2.default)(this,this.onNextFrame);this.updateScrollPosition();this._canScrollY=this.clientHeight<this.scrollHeight;this._canScrollX=this.clientWidth<this.scrollWidth;if(this._scrollTarget!==window){var style=window.getComputedStyle(this._scrollTarget);this._canScrollY=style['overflow-y']!=='hidden';this._canScrollX=style['overflow-x']!=='hidden'}if(this._scrollTarget.addEventListener){this._scrollTarget.addEventListener('scroll',this.onScroll,false);this._scrollTarget.addEventListener('resize',this.onResize,false)}else if(this._scrollTarget.attachEvent){this._scrollTarget.attachEvent('scroll',this.onScroll);this._scrollTarget.attachEvent('resize',this.onResize)}};ScrollEvents.prototype.update=function update(){var scrollY=this._scrollY;var scrollX=this._scrollX;this.updateScrollPosition();if(scrollY!==this.y||scrollX!==this.x){this.trigger(ScrollEvents.EVENT_SCROLL_PROGRESS)}};ScrollEvents.prototype.destroy=function destroy(){if(!this._destroyed){this._cancelNextFrame();_EventDispatcher.prototype.destroy.call(this);if(this._scrollTarget.addEventListener){this._scrollTarget.removeEventListener('scroll',this.onScroll);this._scrollTarget.removeEventListener('resize',this.onResize)}else if(this._scrollTarget.attachEvent){this._scrollTarget.detachEvent('scroll',this.onScroll);this._scrollTarget.detachEvent('resize',this.onResize)}this.onResize=null;this.onScroll=null;this.getScrollPosition=null;this.onNextFrame=null;this._scrollTarget=null;this._destroyed=true}};ScrollEvents.prototype.updateScrollPosition=function updateScrollPosition(){this._scrollY=this.scrollY;this._scrollX=this.scrollX};ScrollEvents.prototype._getWindowScrollPosition=function _getWindowScrollPosition(){return{y:ScrollEvents.windowScrollY,x:ScrollEvents.windowScrollX}};ScrollEvents.prototype._getElementScrollPosition=function _getElementScrollPosition(){return{y:this._scrollTarget.scrollTop,x:this._scrollTarget.scrollLeft}};ScrollEvents.prototype.onResize=function onResize(){this.trigger(ScrollEvents.EVENT_SCROLL_RESIZE)};ScrollEvents.prototype.onScroll=function onScroll(){var _this2=this;this._currentStopFrames=0;if(this._firstRender){this._firstRender=false;if(this.y>1||this.x>1){this.updateScrollPosition();this.trigger(ScrollEvents.EVENT_SCROLL_PROGRESS);return}}if(!this._scrolling){this._scrolling=true;this._lastDirectionY=ScrollEvents.NONE;this.trigger(ScrollEvents.EVENT_SCROLL_START);if(this.options.animationFrame){this.nextFrameID=window.requestAnimationFrame(this.onNextFrame)}else{clearTimeout(this._timeout);this.onNextFrame();this._timeout=setTimeout(function(){_this2.onScrollStop()},100)}}};ScrollEvents.prototype.onNextFrame=function onNextFrame(){this._speedY=this._scrollY-this.scrollY;this._speedX=this._scrollX-this.scrollX;var speed=+this.speedY+ +this.speedX;if(this.options.animationFrame&&this._scrolling&&speed===0&&this._currentStopFrames++>this._stopFrames){this.onScrollStop();return}this.updateScrollPosition();if(this._lastDirectionY!==this.directionY){this.trigger('scroll:'+ScrollEvents.directionToString(this.directionY))}if(this._lastDirectionX!==this.directionX){this.trigger('scroll:'+ScrollEvents.directionToString(this.directionX))}this._lastDirectionY=this.directionY;this._lastDirectionX=this.directionX;this.trigger(ScrollEvents.EVENT_SCROLL_PROGRESS);if(this.options.animationFrame){this.nextFrameID=window.requestAnimationFrame(this.onNextFrame)}};ScrollEvents.prototype.onScrollStop=function onScrollStop(){this._scrolling=false;this.updateScrollPosition();this.trigger(ScrollEvents.EVENT_SCROLL_STOP);if(this._canScrollY){if(this.y<=0){this.trigger(ScrollEvents.EVENT_SCROLL_MIN)}else if(this.y+this.clientHeight>=this.scrollHeight){this.trigger(ScrollEvents.EVENT_SCROLL_MAX)}}if(this._canScrollX){if(this.x<=0){this.trigger(ScrollEvents.EVENT_SCROLL_MIN)}else if(this.x+this.clientWidth>=this.scrollWidth){this.trigger(ScrollEvents.EVENT_SCROLL_MAX)}}if(this.options.animationFrame){this._cancelNextFrame();this._currentStopFrames=0}};ScrollEvents.prototype._cancelNextFrame=function _cancelNextFrame(){window.cancelAnimationFrame(this.nextFrameID);this.nextFrameID=-1};_createClass(ScrollEvents,[{key:'destroyed',get:function get(){return this._destroyed}},{key:'scrollPosition',get:function get(){return this.getScrollPosition()}},{key:'directionY',get:function get(){if(!this._canScrollY||this.speedY===0&&!this._scrolling){this._directionY=ScrollEvents.NONE}else{if(this.speedY>0){this._directionY=ScrollEvents.UP}else if(this.speedY<0){this._directionY=ScrollEvents.DOWN}}return this._directionY}},{key:'directionX',get:function get(){if(!this._canScrollX||this.speedX===0&&!this._scrolling){this._directionX=ScrollEvents.NONE}else{if(this.speedX>0){this._directionX=ScrollEvents.LEFT}else if(this.speedX<0){this._directionX=ScrollEvents.RIGHT}}return this._directionX}},{key:'attributes',get:function get(){return{y:this.y,x:this.x,speedY:this.speedY,speedX:this.speedX,directionY:this.directionY,directionX:this.directionX}}},{key:'scrollTarget',get:function get(){return this._scrollTarget}},{key:'delta',get:function get(){return this.directionY}},{key:'scrolling',get:function get(){return this._scrolling}},{key:'speedY',get:function get(){return this._speedY}},{key:'speedX',get:function get(){return this._speedX}},{key:'scrollY',get:function get(){return this.scrollPosition.y}},{key:'y',get:function get(){return this.scrollY}},{key:'scrollX',get:function get(){return this.scrollPosition.x}},{key:'x',get:function get(){return this.scrollX}},{key:'clientHeight',get:function get(){return this._scrollTarget===window?window.innerHeight:this._scrollTarget.clientHeight}},{key:'clientWidth',get:function get(){return this._scrollTarget===window?window.innerWidth:this._scrollTarget.clientWidth}},{key:'scrollHeight',get:function get(){return this._scrollTarget===window?ScrollEvents.documentHeight:this._scrollTarget.scrollHeight}},{key:'scrollWidth',get:function get(){return this._scrollTarget===window?ScrollEvents.documentWidth:this._scrollTarget.scrollWidth}}]);return ScrollEvents}(_eventdispatcher2.default);ScrollEvents.hasScrollTarget=ScrollEvents.hasInstance;ScrollEvents.UP=-1;ScrollEvents.DOWN=1;ScrollEvents.NONE=0;ScrollEvents.RIGHT=2;ScrollEvents.LEFT=-2;ScrollEvents.EVENT_SCROLL_PROGRESS='scroll:progress';ScrollEvents.EVENT_SCROLL_START='scroll:start';ScrollEvents.EVENT_SCROLL_STOP='scroll:stop';ScrollEvents.EVENT_SCROLL_DOWN='scroll:down';ScrollEvents.EVENT_SCROLL_UP='scroll:up';ScrollEvents.EVENT_SCROLL_MIN='scroll:min';ScrollEvents.EVENT_SCROLL_MAX='scroll:max';ScrollEvents.EVENT_SCROLL_RESIZE='scroll:resize';exports.default=ScrollEvents;var Can=function(){function Can(){_classCallCheck(this,Can)}_createClass(Can,null,[{key:'animationFrame',get:function get(){return!!(window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame)}}]);return Can}();module.exports=exports['default'];

},{"delegatejs":1,"eventdispatcher":2}]},{},[3])(3)
});