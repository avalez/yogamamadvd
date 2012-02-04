var destroyableDialogs = [];
var baseUrl = 'http://localhost/~azhdanov/opencart_v1.5.1.3.1/upload/';

(function($) {
  $(function() {
    //request('#!/route=account/login');
    var m = window.location.toString().match(/test.html(#!.*)$/);
    var l = m ? m[1] : '#!/route=common/home';
    request(l);
  });

  var _has_history = !!(window.history && history.pushState);
  
  if (_has_history) {
    $(window).bind('popstate.history-ocwid', function(e) {
      locationChanged();
    });
  }
  
  var toLoad = 0;
  var onLoad = new Array();
  
  request = function(url, type, data) {
    doRequest(url, type, data, function(html) {
      $.each(destroyableDialogs, function(i,dialog){
        dialog.empty().remove();
      });
      destroyableDialogs = [];
      
      html = html.replace(/(<img\s.*?src=")(index.php)/, '$1' + baseUrl + '$2');
      html = html.replace(/(<img\s.*?src=")(catalog)/, '$1' + baseUrl + '$2');
      html = html.replace(/(<script\s.*?src=")(catalog)/, '$1' + baseUrl + '$2');
      
      //$('div#eshop').html(html)
      // strip inner div#content, and eval scripts and styles in order of appearance
      var $el = $('#eshop');
      $el.html(''); // clean
      var wait = new Array();
      $(html).each(function(i, piece) {
        if (piece.nodeName == 'DIV' && piece.id == 'content') {
          $el.append(piece.innerHTML); // div#content
        } else if (piece.nodeName == 'TITLE') {
          document.title = piece.innerHTML;
        } else if (piece.nodeName == 'SCRIPT' && piece.attributes['src']) {
          toLoad++;
          $el.append(piece); // scripts/styles/links
        } else {
          // TODO: browser not supports inline scripts
          $el.append(piece); // scripts/styles/links
        }
      });
      $('script').bind('load', function() {
        console.log('loaded');
        if (toLoad > 0) {
          toLoad--;
        } else {
          for (fn in onLoad) {
            console.log('onLoad');
            fn.apply(this, new Array());
          }
        }
      });

    });
  }
  
  
  doRequest = function(url, type, data, success) {
    url = url.replace(/.*#!\//, 'index.php?');
    if (!/index\.php\?route=\w+/.test(url)) {
      url = 'index.php?route=common/home'; // CAUTION: may request catalog
    }
    $.ajax({url: url + (url.indexOf('?') > 0 ? '&' : '?') + 'partial',
      type: type, data: data, dataType: "jsonp",
      complete:
    /*$.getJSON(url,*/ function(jqXHR) {
        var redirect = jqXHR.getResponseHeader('Location');
        if (redirect) {
          setLocation(redirect);
        } else if (jqXHR.status == 500){
            $('body').html(jqXHR.responseText)
        } else {
            //success(jqXHR.responseText);
        }
      },
      success: function(data) {
        var redirect = data['redirect'];
        if (redirect) {
          setLocation(redirect);
        } else {
          success(data['output']);
        }
      }
    });
  }
  
  locationChanged = function() {
    var url = fullPath(window.location);
    request(url, 'get'); 
  }
  
  setLocation = function(new_location) {
    new_location = new_location.replace(/.*index.php\?(route=.+)/, "#!\/$1");
      if (false && /^([^#\/]|$)/.test(new_location)) { // non-prefixed url
        if (_has_history) {
          new_location = '/' + new_location;
        } else {
          new_location = '#!/' + new_location;
        }
      }
      // HTML5 History exists and new_location is a full path
      if (_has_history && /^\//.test(new_location)) {
        history.pushState({ path: new_location }, window.title, new_location);
        locationChanged();
      } else {
        if (window.location.hash == new_location) {
          setTimeout(locationChanged, 0); // force reload
        }
        return (window.location = new_location);
      }
  }

  fullPath = function(location_obj) {
    // Bypass the `window.location.hash` attribute.  If a question mark
    // appears in the hash IE6 will strip it and all of the following
    // characters from `window.location.hash`.
    var matches = location_obj.toString().match(/^[^#]*(#.+)$/);
    var hash = matches ? matches[1] : '';
    return [location_obj.pathname, location_obj.search, hash].join('');
  };
  
  $('a').live('click.history-ocwid', function(e) {
    e.preventDefault();
    var url = fullPath(this);
    if (url) {
      setLocation(url);
    }
    return false;
  });

  _parseFormParams = function($form) {
      var params = {},
          form_fields = $form.serializeArray(),
          i;
      for (i = 0; i < form_fields.length; i++) {
        params = this._parseParamPair(params, form_fields[i].name, form_fields[i].value);
      }
      return params;
  };
  
  _parseParamPair = function(params, key, value) {
      if (params[key]) {
        if ($.isArray(params[key])) {
          params[key].push(value);
        } else {
          params[key] = [params[key], value];
        }
      } else {
        params[key] = value;
      }
      return params;
  };
    
  $('form').live('submit.ocwid', function(e) {
    e.preventDefault();
    var $form = $(e.target);
    var url = $form.attr('action');
    url = url.replace(/.*index.php\?(route=.+)/, "#!\/$1");
    request(url, 'post', _parseFormParams($form));
    return false;
  });
  
  // Override .ready() method to fire later
  var originalReadyMethod = jQuery.fn.ready;
  jQuery.fn.ready = function() {
    console.log('Ready');
    //originalReadyMethod.apply( this, arguments );
    onLoad.push(arguments[0]);
  }

  // Override .load() method to support jsonp
  var originalLoadMethod = jQuery.fn.load;
  jQuery.fn.load = function() {
    if ( typeof arguments[0] === "string" ) {
      var $el = this;
      doRequest(arguments[0], 'get', arguments[1], function(html) {
        $el.html(html);
      });
    } else {
      originalLoadMethod.apply(this, arguments);
    }
  }
  // Override .ajax() method to prefix with baseUrl
  var originalAjaxMethod = jQuery['ajax'];
  jQuery['ajax'] = function() {
    if ( typeof arguments[0] === 'string' ) {
      arguments[0] = jQuery.extend({url: arguments[0]}, arguments[1]);
    }
    if (arguments[0] && !/^https?:/.test(arguments[0]['url'])) {
      arguments[0]['url'] = baseUrl + arguments[0]['url'];
    }
    originalAjaxMethod.apply( this, arguments );
  }

})(jQuery);