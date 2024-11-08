var isLast = function(word) {
    return word.nextElementSibling ? false : true;
  }
  
  var getNext = function(word) {
    return word.nextElementSibling;
  }
  
  var getVisible = function() {
    return document.getElementsByClassName('is-visible')[0]; // assuming only one element is visible at a time
  }
  
  var getFirst = function() {
    return document.querySelector('.words-wrapper').firstElementChild;
  }
  
  var switchWords = function(current, next) {
    current.classList.remove('is-visible');
    current.classList.add('is-hidden');
    next.classList.remove('is-hidden');
    next.classList.add('is-visible');
  }
  
  var getStarted = function() {
    var first = getVisible();
    var next = getNext(first);
    
    if (next) {
      switchWords(first, next);
    } else {
      first.classList.remove('is-visible');
      first.classList.add('is-hidden');
      
      var newEl = getFirst();
      newEl.classList.remove('is-hidden');
      newEl.classList.add('is-visible');
    }
  }
  
  var init = function() {
    setInterval(getStarted, 2000);
  }
  
  init();
  