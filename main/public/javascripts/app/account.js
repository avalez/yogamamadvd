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
      context.partial('templates/account/login.html', {flash: {}, type: 'account'});
    });

    app.post('#/account/authenticate', function(context) {
      var params = {
        username: this.params.username,
        password: this.params.password,
        remember: this.params.remember
      };
      $.ajax({url:'/ws/connect', data: params, type: 'json',
        success: function(user) {
          app.store.set('user', user);
          context.redirect('#/account/account');
          app.log('logged in');
        },
        error: function(jqXHR, textStatus) {
          app.log('login failed');
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
        $.ajax({url: '/ws/connected', type: 'json',
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

