# Scroll
### performant custom scroll events and custom scroll propertys

Scroll gives you custom scroll events like scroll:start, scroll:progress and scroll:end for better event / action handling
the events are triggered only in animation frames for the most performant way of default DOM manipulation.

further more it adds special propertys to the scroll state :
```
scrollY
scrollX
speedY
speedX
angle // TODO
directionY
directionX
```

Scroll will only be instanciated once for the same scroll target to save memory and optimize the performance.


### Dependencies
none!

### Browser support
IE >= 9, *

### install
```
npm install fastscroll
```
### demo (will be updated soon)
https://rawgit.com/soenkekluth/fastscroll/master/demo/index.html
please see the console.logs for now

### js
```javascript
var Scroll = require('fastscroll');
var fastScroll = new Scroll(); // takes window as scroll target
// or
new Scroll(yourElement)

fastScroll.on('scroll:start', function(event) {
  console.log('scroll:start', event);
});

fastScroll.on('scroll:progress', function(event) {
  console.log('scroll:progress', event);
});

fastScroll.on('scroll:stop', function(event) {
  console.log('scroll:stop', event);
});

```
