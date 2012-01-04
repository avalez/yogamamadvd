(function($) {
  var _has_history = !!(window.history && history.pushState);
  
  if (_has_history) {
    $(window).bind('popstate.history-yogamamadvd', function(e) {
      locationChanged();
    });
  }
  
  request = function(url, type, data) {
    $.ajax({url:url + (url.indexOf('?') > 0 ? '&' : '?') + 'partial',
      type: type, data: data,
      complete: function(jqXHR) {
        var redirect = jqXHR.getResponseHeader('Location');
        if (redirect) {
          setLocation(redirect);
        } else if (jqXHR.status == 500){
            $('body').html(jqXHR.responseText)
        } else {
          $('div#content').html(jqXHR.responseText)
        }
      }
    });
  }
  
  locationChanged = function() {
    var url = fullPath(window.location);
    request(url, 'get'); 
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
    
  $('form').live('submit.yogamamadvd', function(e) {
    e.preventDefault();
    var $form = $(e.target);
    var url = $form.attr('action');
    request(url, 'post', _parseFormParams($form));
    return false;
  });

})(jQuery);

function updateCart(url, data, callback) {
    $.ajax({
        url: url,
        data: data,
        type: 'post',
        success: function(json) {
            $('#cart_total').html(json['total']);
            
            callback();
        }
        ,
        error: function(jqXHR, textStatus, errorThrown) {
            alert(errorThrown)
        }
    });
}

function addToCart(url, productId, quantity, image_el) {
    updateCart(url, {productId: productId, quantity: quantity}, function() {
                
        $('#available-' + productId).fadeOut();
        $('#selected-' + productId).fadeIn();

        $('select#selected-qty-' + productId).val(quantity);
        
        if (image_el != undefined) {

            var image = image_el.offset();
            var cart = $('#cart_total').offset();
            image_el.before('<img src="' + image_el.attr('src') + '" id="temp" style="position: absolute; top: ' + image.top 
                 + 'px; left: ' + image.left + 'px;" />');
            params = {
                top : cart.top + 'px',
                left : cart.left + 'px',
                opacity : 0.0,
                width : $('#cart_total').width(),
                height : $('#cart_total').height()
            };
            $('#temp').animate(params, 'slow', function () {
                $('#temp').remove();
            });
        }
    });
}

function removeFromCart(url, productId) {
    updateCart(url, {productId: productId}, function() {

        $('#selected-' + productId).fadeOut();
        $('#available-' + productId).fadeIn();

        $('select#available-qty-' + productId).val($('select#selected-qty-' + productId).val());
    });
}