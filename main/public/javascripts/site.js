(function($) {
  var _has_history = !!(window.history && history.pushState);
  
  if (_has_history) {
    $(window).bind('popstate.history-yogamamadvd', function(e) {
      locationChanged();
    });
  }
  
  locationChanged = function() {
      var url = fullPath(window.location);
      $.ajax({url:url + '?partial', type: 'get',
        success: function(html) {
          $('div#content').html(html);
        },
        error: function(jqXHR, textStatus) {
          $('div.checkout-warning').show().delay(3000).fadeOut('slow');            
        }
      });
  }
  
  setLocation = function(new_location) {
      if (/^([^#\/]|$)/.test(new_location)) { // non-prefixed url
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
  
  $('a').live('click.history-yogamamadvd', function(e) {
    e.preventDefault();
    var url = fullPath(this);
    setLocation(url);
    return false;
  });

  $('form').live('submit.yogamamadvd', function(e) {
    e.preventDefault();
    var $form = $(e.target);
    var url = $form.attr('action');
    $.ajax({url:url + '?partial', type: 'post', data: {email: 'test', password: 'test'},
      success: function(html, error, jqXHR) {
        var redirect = jqXHR.getResponseHeader('Location');
        if (redirect) {
          setLocation(redirect);
        } else {
          $('div#content').html(html)
        }
      },
      error: function(jqXHR, textStatus) {
        $('div.checkout-warning').show().delay(3000).fadeOut('slow');            
      }
    });
    return false;
  });

})(jQuery);