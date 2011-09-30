(function($) {

  Sammy = Sammy || {};

  Sammy.AppAccount = function(app, method_alias) {
    app.get('#/account/account', function(context) {
      app.connected(function(user) {
        if (!user) {
          context.redirect('#/account/login');
        } else {
          context.partial('templates/account/account.html');
        }
      })
    });

    app.get('#/account/login', function(context) {
      context.partial('templates/account/login.html', {_type: 'account'});
    });

    app.post('#/account/login', function(context) {
      $.ajax({url:'/ws/connect', data: this.params.toHash(), type: 'post',
        success: function(user) {
          app.store.set('user', user);
          context.redirect('#/account/account');
        },
        error: function(jqXHR, textStatus) {
          $('div.warning').show().delay(3000).fadeOut('slow');            
        }
      });
    });

    app.get('#/account/register', function(context) {
      context.partial('templates/account/register.html', {_shipment: ''});
    });

    app.post('#/account/register', function(context) {
      $.ajax({url:'/ws/register', data: this.params.toHash(), type: 'post',
        success: function(user) {
          app.store.set('user', user);
          context.redirect('#/account/account');
        },
        error: function(jqXHR, textStatus) {
          $('div.warning').show().delay(3000).fadeOut('slow');            
        }
      });
    });

    app.get('#/account/logout', function(context) {
      $.getJSON('/ws/disconnect', function(user) {
          app.log('logged out');
      });
      app.store.set('user', null);
      context.redirect('#/');
    });
    
    app.connected = function(callback) {
      if (!app.store.get('connected')) { // once
        // TODO?: replace in play! template
        app.store.set('connected', true);
        $.ajax({url: '/ws/connected',
          success: function(user) {
            app.store.set('user', user);
            callback(user);
          },
          error: function() {
            callback();
          }
        });
      } else {
        callback(app.store.get('user'));
      }
    }
  }

})( jQuery );

