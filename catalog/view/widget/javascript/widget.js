//$(function () {
  var baseUrl = 'http://localhost/~azhdanov/opencart_v1.5.1.3.1/upload/';

  function templateUrl(name) {
    return baseUrl + 'index.php?route=widget/template&name=' + name;
  }

  function messagesUrl(name) {
    return baseUrl + 'index.php?route=widget/messages&name=' + name;
  }
  
  function scriptUrl(name) {
    return baseUrl + 'catalog/view/widget/javascript/' + name;
  }

  function addStyleSheet(styleSheet) {
    if (document.createStyleSheet){
      document.createStyleSheet(styleSheet);
    }
    else {
      jQuery("head").append(jQuery("<link rel='stylesheet' href='" + styleSheet + "' type='text/css' media='screen' />"));
    }
  }

  function product(product_id) {
    var context = new Sammy.EventContext(app, 'get', 'product', {});
    addStyleSheet(baseUrl + 'catalog/view/theme/default/stylesheet/slideshow.css');
    $.getScript(baseUrl + 'catalog/view/javascript/jquery/nivo-slider/jquery.nivo.slider.pack.js');
    context.partial('main', 'account/account').then(function() {
        $('#slideshow0').nivoSlider();
    });
  }
    
  var scriptHook = document.getElementsByTagName('script')[0];
  function loadScript(name) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = scriptUrl(name);
    scriptHook.parentNode.appendChild(script);
  }
    
  if (typeof jQuery == 'undefined') {
    //jQuery is provided by require-jquery.js
    //loadScript('../../javascript/jquery/jquery-1.6.1.min.js');
  }
  
  var require = {
    baseUrl: scriptUrl(''),
    paths: {
      //"jquery": "../../javascript/jquery/jquery-1.6.1.min"
      'jquery-ui': '../../javascript/jquery/ui/jquery-ui-1.8.16.custom.min',
    },
    callback: function() {
      // do not load jquery if it's available
      if (typeof jQuery != 'undefined') {
        define( "jquery", [], function () { return jQuery; } ); // FIXME: do not redefine      
      }
      require(['sammy/sammy', 'app/main'], function() {
        // Override .ajax() method for jsonp
        var originalAjaxMethod = jQuery['ajax'];
        jQuery['ajax'] = function() {
          if ( typeof arguments[0] === 'string' ) {
            arguments[0] = jQuery.extend({url: arguments[0]}, arguments[1]);
          }
          var source = window.location.protocol + '//' + window.location.hostname + window.location.port;
          var s_this = this;
          var s_arguments = arguments;
          if (arguments[0] && /^https?:/.test(arguments[0]['url'])
              && arguments[0]['url'].indexOf(source) == -1
              && arguments[0].dataType !== 'jsonp') {
            // handle jsonp
            var success = arguments[0]['success'];
            arguments[0]['success'] = function(data) {
              if (data.redirect) {
                console.log('redirect');
                s_arguments[0]['url'] = data.redirect;
                originalAjaxMethod.apply(s_this, s_arguments );
              } else {
                data = data.output || data;
                success(data);
              }
            };
            var complete = arguments[0]['complete'];
            arguments[0]['complete'] = function(jqXHR) {
                var redirect = jqXHR.getResponseHeader('Location');
                if (redirect) {
                  console.log('redirect');
                  s_arguments[0]['url'] = redirect;
                  originalAjaxMethod.apply(s_this, s_arguments );
                } else if (jqXHR.status == 500){
                  $('body').html(jqXHR.responseText)
                } else {
                  if (typeof complete == 'function') {
                    complete(jqXHR);
                  }
                }
            };
            arguments[0].dataType = 'jsonp';
            console.log(arguments[0]['url']);
          }
          originalAjaxMethod.apply( this, arguments );
        };

        // override for context.partial('main', 'child1', 'childN', data)  
        var originalPartialMethod = Sammy.EventContext.prototype.partial;
        Sammy.EventContext.prototype.partial = function() {
          var partials = {};
          var data;
          for (i in arguments) {
            var partial = arguments[i];
            if (typeof partial == 'string') {
              partials[partial] = templateUrl(partial);
            } else {
              data = partial;
            }
          }
          var args = new Array(arguments[0], data, partials);
          return originalPartialMethod.apply(this, args);
        }
      });
      
    }
    //waitSeconds: 15,
    //locale: "fr-fr"
  };

  if (typeof jQuery == 'undefined') {
    loadScript('require-jquery.js')
  } else {
    loadScript('require.js')
  }
//});