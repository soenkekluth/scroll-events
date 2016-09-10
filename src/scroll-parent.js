var regex = /(auto|scroll)/;

var scrollParent = function(element) {

  if (!(element instanceof HTMLElement)) {
    return window;
  }

  while (element.parentNode) {
    if (element.parentNode === document.body) {
      return window;
    }
    var style = window.getComputedStyle(element.parentNode, null);
    if (regex.test(style.getPropertyValue('overflow') + style.getPropertyValue('overflow-y') + style.getPropertyValue('overflow-x'))) {
      return element.parentNode;
    }

    element = element.parentNode;
  }

  return window;
};

module.exports = scrollParent;
