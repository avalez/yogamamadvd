//$(function () {
  var baseUrl = 'http://localhost/~azhdanov/opencart_v1.5.1.3.1/upload/';

  function templateUrl(name) {
    return baseUrl + 'index.php?route=common/source&name=' + name;
  }

  function messagesUrl(name) {
    return baseUrl + 'index.php?route=common/source/messages&name=' + name;
    
  }

  // Override .ajax() method for jsonp
  var originalAjaxMethod = jQuery['ajax'];
  jQuery['ajax'] = function() {
    if ( typeof arguments[0] === 'string' ) {
      arguments[0] = jQuery.extend({url: arguments[0]}, arguments[1]);
    }
    var source = window.location.protocol + '//' + window.location.hostname + window.location.port;
    if (arguments[0] && /^https?:/.test(arguments[0]['url'])
        && arguments[0]['url'].indexOf(source) == -1
        && arguments[0].dataType !== 'jsonp') {
      // handle jsonp
      var success = arguments[0]['success'];
      arguments[0]['success'] = function(jsonp) {
        success(jsonp.output);
      }
      arguments[0].dataType = 'jsonp';
      console.log(arguments[0]['url']);
    }
    originalAjaxMethod.apply( this, arguments );
  }

  addStyleSheet = function(styleSheet) {
    if (document.createStyleSheet){
      document.createStyleSheet(styleSheet);
    }
    else {
      $("head").append($("<link rel='stylesheet' href='" + styleSheet + "' type='text/css' media='screen' />"));
    }
  }
//});