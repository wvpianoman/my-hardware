/* =============================================
 *
 *   FIXED RESPONSIVE NAV
 *
 *   (c) 2014 @adtileHQ
 *   http://www.adtile.me
 *   http://twitter.com/adtilehq
 *
 *   Free to use under the MIT License.
 *
 * ============================================= */

(function () {

  "use strict";

  // Feature test to rule out some older browsers
  if ("querySelector" in document && "addEventListener" in window) {

    // forEach method, that passes back the stuff we need
    var forEach = function (array, callback, scope) {
      for (var i = 0; i < array.length; i++) {
        callback.call(scope, i, array[i]);
      }
    };

    // Init Responsive Nav
    var navigation = responsiveNav(".nav-collapse", {

      // Close the navigation when it's tapped
      closeOnNavClick: true
    });

    // Create a Mask
    var mask = document.createElement("div");
    mask.className = "mask";

    // Append the mask inside <body>
    document.body.appendChild(mask);

    // Disable mask transitions on Android to boost performance
    // if (navigator.userAgent.match(/Android/i) !== null) {
      // document.documentElement.className += " android";
    // }

    // Find navigation links and save a reference to them
    var nav = document.querySelector(".nav-collapse ul"),
      links = nav.querySelectorAll("[data-scroll]");

    // Highlight active link when scrolling
    var wasNavigationTapped = false;
    window.addEventListener("scroll", function () {

      // Determine viewport and body size
      var top = window.pageYOffset,
        body = document.body,
        html = document.documentElement,
        viewport = window.innerHeight,
        bodyheight = Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.clientHeight,
          html.scrollHeight,
          html.offsetHeight
        );
    }, false);

    // Close navigation when tapping the mask under it
    mask.addEventListener("click", function (e) {
      e.preventDefault();
      navigation.close();
    }, false);

    // Clear wasNavigationTapped check after scrolling
    var clearTapCheck = function () {
      setTimeout(function () {
        wasNavigationTapped = false;
      }, 500);
    };
    
  }

})();

window.addEventListener('scroll', function () {
  document.body.classList[
    window.scrollY > 20 ? 'add': 'remove'
  ]('scrolled');
});
