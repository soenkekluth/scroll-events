'use strict';Object.defineProperty(exports,'__esModule',{value:true});exports.default=undefined;var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _delegatejs=require('delegatejs');var _delegatejs2=_interopRequireDefault(_delegatejs);var _eventdispatcher=require('eventdispatcher');var _eventdispatcher2=_interopRequireDefault(_eventdispatcher);var _lodash=require('lodash');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _defaults(obj,defaults){var keys=Object.getOwnPropertyNames(defaults);for(var i=0;i<keys.length;i++){var key=keys[i];var value=Object.getOwnPropertyDescriptor(defaults,key);if(value&&value.configurable&&obj[key]===undefined){Object.defineProperty(obj,key,value)}}return obj}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called')}return call&&(typeof call==='object'||typeof call==='function')?call:self}function _inherits(subClass,superClass){if(typeof superClass!=='function'&&superClass!==null){throw new TypeError('Super expression must either be null or a function, not '+typeof superClass)}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):_defaults(subClass,superClass)}var _instanceMap={};var ScrollEvents=function(_EventDispatcher){_inherits(ScrollEvents,_EventDispatcher);ScrollEvents.directionToString=function directionToString(direction){switch(direction){case ScrollEvents.UP:return'up';case ScrollEvents.DOWN:return'down';case ScrollEvents.NONE:return'none';case ScrollEvents.LEFT:return'left';case ScrollEvents.RIGHT:return'right';}};function ScrollEvents(){var scrollTarget=arguments.length<=0||arguments[0]===undefined?window:arguments[0];var options=arguments.length<=1||arguments[1]===undefined?{}:arguments[1];_classCallCheck(this,ScrollEvents);var _this=_possibleConstructorReturn(this,_EventDispatcher.call(this));if(ScrollEvents.hasScrollTarget(scrollTarget)){var _ret;return _ret=ScrollEvents.getInstance(scrollTarget),_possibleConstructorReturn(_this,_ret)}_this.scrollTarget=scrollTarget;_this.options=options;_instanceMap[scrollTarget]=_this;_this.options.animationFrame=Can.animationFrame;if(_this.options.animationFrame){ScrollEvents.unprefixAnimationFrame()}_this.destroyed=false;_this._scrollY=0;_this._scrollX=0;_this.timeout=0;_this._speedY=0;_this._speedX=0;_this._lastSpeed=0;_this._lastDirection=ScrollEvents.NONE;_this.stopFrames=3;_this.currentStopFrames=0;_this.firstRender=true;_this.animationFrame=true;_this._directionY=ScrollEvents.NONE;_this._directionX=ScrollEvents.NONE;_this.scrolling=false;_this.firstScroll=true;_this.init();return _this}ScrollEvents.prototype.init=function init(){this.getScrollPosition=this.scrollTarget===window?(0,_delegatejs2.default)(this,this.getWindowScrollPosition):(0,_delegatejs2.default)(this,this.getElementScrollPosition);this.onScroll=(0,_delegatejs2.default)(this,this.onScroll);this.onNextFrame=(0,_delegatejs2.default)(this,this.onNextFrame);this._scrollY=this.scrollY;// this._scrollX = this.scrollX;
if(this.scrollTarget.addEventListener){// this.scrollTarget.addEventListener('mousewheel', this.onScroll, Can.passiveEvents ? { passive: true } : false);
this.scrollTarget.addEventListener('scroll',this.onScroll,Can.passiveEvents?{passive:true}:false)}else if(this.scrollTarget.attachEvent){// this.scrollTarget.attachEvent('onmousewheel', this.onScroll);
this.scrollTarget.attachEvent('scroll',this.onScroll)}};ScrollEvents.prototype.destroy=function destroy(){if(!this.destroyed){this.cancelNextFrame();_EventDispatcher.prototype.destroy.call(this);if(this.scrollTarget.addEventListener){// this.scrollTarget.removeEventListener('mousewheel', this.onScroll);
this.scrollTarget.removeEventListener('scroll',this.onScroll)}else if(this.scrollTarget.attachEvent){// this.scrollTarget.detachEvent('onmousewheel', this.onScroll);
this.scrollTarget.detachEvent('scroll',this.onScroll)}this.onScroll=null;this.getScrollPosition=null;this.onNextFrame=null;this.scrollTarget=null;this.destroyed=true}};ScrollEvents.prototype.getWindowScrollPosition=function getWindowScrollPosition(){return{y:window.pageYOffset||window.scrollY||0,x:window.pageXOffset||window.scrollX||0}};ScrollEvents.prototype.getElementScrollPosition=function getElementScrollPosition(){return{y:this.scrollTarget.scrollTop,x:this.scrollTarget.scrollLeft}};ScrollEvents.prototype.onScroll=function onScroll(){this.currentStopFrames=0;if(this.firstRender){this.firstRender=false;if(this.scrollY>1){this._scrollY=this.scrollY;this._scrollX=this.scrollX;// this.getScrollPosition();
this.dispatchEvent(ScrollEvents.EVENT_SCROLL_PROGRESS);return}}if(!this.scrolling){this.scrolling=true;this.firstScroll=true;this.dispatchEvent(ScrollEvents.EVENT_SCROLL_START);if(this.options.animationFrame){this.nextFrameID=window.requestAnimationFrame(this.onNextFrame)}else{clearTimeout(this.timeout);this.onNextFrame();var self=this;this.timeout=setTimeout(function(){self.onScrollStop()},100)}}};ScrollEvents.prototype.onNextFrame=function onNextFrame(){this._lastDirection=this.directionY;// this._lastSpeed = this.speedY;
this._speedY=this._scrollY-this.scrollY;// this._speedX = this._scrollX - this.scrollX;
// if(this.options.animationFrame && this.scrolling && ((this._scrollY === this.scrollY ) && (this._lastSpeed === 0 && this.speedY === 0) && (this.directionY === this._lastDirection) && (++this.currentStopFrames > this.stopFrames) /*&& this.directionY === this._lastDirection*/) ){
//   this.onScrollStop();
//   return;
// }
if(this.options.animationFrame&&this.scrolling&&this.speedY===0&&this.currentStopFrames++>this.stopFrames){this.onScrollStop();return}this._scrollY=this.scrollY;// this._scrollX = this.scrollX;
// console.log(this._lastDirection, this.directionY);
if(this._lastDirection!==this.directionY){// this.firstScroll = false;
this.dispatchEvent('scroll:'+ScrollEvents.directionToString(this.directionY))}this.dispatchEvent(ScrollEvents.EVENT_SCROLL_PROGRESS);if(this.options.animationFrame){this.nextFrameID=window.requestAnimationFrame(this.onNextFrame)}};ScrollEvents.prototype.onScrollStop=function onScrollStop(){this.scrolling=false;this._scrollY=this.scrollY;// this.dispatchEvent('scroll:none');
// this._scrollX = this.scrollX;
if(this.options.animationFrame){this.cancelNextFrame();this.currentStopFrames=0}this.dispatchEvent(ScrollEvents.EVENT_SCROLL_STOP)};ScrollEvents.prototype.cancelNextFrame=function cancelNextFrame(){window.cancelAnimationFrame(this.nextFrameID);this.nextFrameID=0};_createClass(ScrollEvents,[{key:'attr',get:function get(){return{scrollY:this.scrollY,// scrollX: this.scrollX,
speedY:this.speedY,// speedX: this.speedX,
// angle: 0,
directionY:this.directionY// directionX: this.directionX
}}},{key:'directionY',get:function get(){if(this.speedY===0&&!this.scrolling){this._directionY=ScrollEvents.NONE}else{if(this.speedY>0){this._directionY=ScrollEvents.UP}else if(this.speedY<0){this._directionY=ScrollEvents.DOWN}}return this._directionY}},{key:'directionX',get:function get(){if(this.speedX===0&&!this.scrolling){this._directionX=ScrollEvents.NONE}else{if(this.speedX>0){this._directionX=ScrollEvents.RIGHT}else if(this.speedX<0){this._directionX=ScrollEvents.LEFT}}return this._directionX}},{key:'delta',get:function get(){return this.directionY}},{key:'speedY',get:function get(){return this._speedY}},{key:'speedX',get:function get(){return this._speedX}},{key:'scrollY',get:function get(){return this.getScrollPosition().y}},{key:'y',get:function get(){return this.scrollY}},{key:'scrollX',get:function get(){return this.getScrollPosition().x}},{key:'x',get:function get(){return this.scrollX}}]);return ScrollEvents}(_eventdispatcher2.default);ScrollEvents.getInstance=function(scrollTarget,options){if(!_instanceMap[scrollTarget]){_instanceMap[scrollTarget]=new ScrollEvents(scrollTarget,options)}return _instanceMap[scrollTarget]};ScrollEvents.hasInstance=function(scrollTarget){return typeof _instanceMap[scrollTarget]!=='undefined'};ScrollEvents.hasScrollTarget=ScrollEvents.hasInstance;ScrollEvents.clearInstance=function(){var scrollTarget=arguments.length<=0||arguments[0]===undefined?window:arguments[0];if(ScrollEvents.hasInstance(scrollTarget)){ScrollEvents.getInstance(scrollTarget).destroy();delete _instanceMap[scrollTarget]}};ScrollEvents.unprefixAnimationFrame=function(){window.requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame;window.cancelAnimationFrame=window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame||window.msCancelAnimationFrame};ScrollEvents.UP=-1;ScrollEvents.DOWN=1;ScrollEvents.NONE=0;ScrollEvents.LEFT=-2;ScrollEvents.RIGHT=2;ScrollEvents.EVENT_SCROLL_PROGRESS='scroll:progress';ScrollEvents.EVENT_SCROLL_START='scroll:start';ScrollEvents.EVENT_SCROLL_STOP='scroll:stop';ScrollEvents.EVENT_SCROLL_DOWN='scroll:down';ScrollEvents.EVENT_SCROLL_UP='scroll:up';exports.default=ScrollEvents;var passiveEvents=null;var Can=function(){function Can(){_classCallCheck(this,Can)}_createClass(Can,null,[{key:'animationFrame',get:function get(){return!!(window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame)}},{key:'passiveEvents',get:function get(){if(passiveEvents!==null){return passiveEvents}try{var opts=Object.defineProperty({},'passive',{get:function get(){passiveEvents=true}});window.addEventListener('test',null,opts)}catch(e){passiveEvents=false}}}]);return Can}();module.exports=exports['default'];