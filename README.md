# ScrollEvents
### performant custom scroll events and custom scroll propertys

ScrollEvents gives you custom scroll events like scroll:start, scroll:progress and scroll:end for better event / action handling
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

ScrollEvents will only be instanciated once for the same scroll target to save memory and optimize the performance.


### Dependencies
none!

### Browser support
IE >= 9, *

### install
```
npm install scroll-events
```
### demo (will be updated soon)
https://rawgit.com/soenkekluth/scroll-events/master/demo/index.html
please see the console.logs for now

### js
```javascript
var ScrollEvents = require('scroll-events');
var scrollEvents = new ScrollEvents(); // takes window as scroll target
// or
new ScrollEvents(yourElement)


scrollEvents.on('scroll:down', function(event) {
  console.log('========== scroll:down =============');
});

scrollEvents.on('scroll:up', function(event) {
  console.log('========== scroll:up =============');
});

scrollEvents.on('scroll:start', function(event) {
  console.log('scroll:start     y:' + scrollEvents.y + '  direction: ' + scrollEvents.directionY+' ('+ ScrollEvents.directionToString(scrollEvents.directionY)+')')
});

scrollEvents.on('scroll:progress', function(event) {
  console.log('scroll:progress  y:' + scrollEvents.y + '  direction: ' + scrollEvents.directionY+' ('+ ScrollEvents.directionToString(scrollEvents.directionY)+')')
});

scrollEvents.on('scroll:stop', function(event) {
  console.log('scroll:stop      y:' + scrollEvents.y + '  direction: ' + scrollEvents.directionY+' ('+ ScrollEvents.directionToString(scrollEvents.directionY)+')')
});

```
