(function () {
  if (self === top) {
    var s = document.getElementById("antiClickjack");
    if (s) s.parentNode.removeChild(s);
  } else {
    top.location = self.location;
  }
})();
