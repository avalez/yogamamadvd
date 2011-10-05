(function($) {

  Sammy = Sammy || {};

  Sammy.AppAccount = function(app, method_alias) {
    app.get('#/account/account', function(context) {
      app.connected(function(user) {
        if (!user) {
          var url = escape(context.params._url || '#/account/account');
          context.redirect('#/account/login?_url=' + url);
        } else {
          context.partial('templates/account/account.html');
        }
      })
    });

    app.get('#/account/login', function(context) {
      context.partial('templates/account/login.html', {_type: 'account', _url: context.params._url});
    });

    app.post('#/account/login', function(context) {
      $.ajax({url:'../ws/connect', data: context.params.toHash(), type: 'post',
        success: function(user) {
          app.store.set('user', user);
          var url = context.params._url;
          if (!url || url.match(/account/)) {
            url =  '#/account/account';
          }
          context.redirect(url);
        },
        error: function(jqXHR, textStatus) {
          $('div.login-warning').show().delay(3000).fadeOut('slow');            
        }
      });
    });

    app.get('#/account/register', function(context) {
      context.partial('templates/account/register.html', {_shipment: ''});
    });
    
    // routes
    app.post('#/account/register', function(context) {
      var url = '../ws/register';
      if (context.params._action === 'update') {
        url += 'Update';
      } else if (context.params._shipment == 'download') {
        url += 'Short';
      }
      var data = context.params.toHash ? context.params.toHash() : context.params;
      $.ajax({url:url, data: data, type: 'post',
        success: function(user) {
          app.store.set('user', user);
          var url = context.params._url;
          if (!url || url.match(/account/)) {
            url =  '#/account/account';
          }
          context.redirect(url);
        },
        error: function(jqXHR, textStatus) {
          $('div.register-warning').show().delay(3000).fadeOut('slow');            
        }
      })
    });

    app.get('#/account/logout', function(context) {
      $.get('../ws/disconnect', function(user) {
          app.log('logged out');
      });
      app.store.set('user', null);
      var url = context.params._url || '#/';
      if (url.match(/account/)) {
        url = '#/';
      }
      this.redirect(url);
    });
    
    app.connected = function(callback) {
      if (typeof callback == 'undefined') {
        return app.store.get('user');
      } else {
        if (!app.store.get('connected')) { // once
          // TODO?: replace in play! template
          app.store.set('connected', true);
          $.get('../ws/connected', function(user) {
            app.store.set('user', user);
             // update welcome text
            app.trigger('location-changed');
          }).always(callback);
        } else {
          callback(app.store.get('user'));
        }
      }
    }
 
  }

})( jQuery );

