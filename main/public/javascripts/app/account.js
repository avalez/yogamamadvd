(function($) {

  Sammy = Sammy || {};

  Sammy.AppAccount = function(app, method_alias) {

    app.get('#/account/account', function(context) {
      if (!context.store.get('user')) {
        this.redirect('#/account/login');
      } else {
        this.partial('templates/account/account.html');
      }
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
    $.post('/account/authenticate', params, function(user) {
        context.store.set('user', user);
        context.redirect('#/account/account');
      });
    });

    app.get('#/account/logout', function(context) {
      $.getJSON('/account/logout', function(user) {
          //app.log.debug('logged out');
      });
      context.store.set('user', null);
      context.redirect('#/');
    });

  }

})( jQuery );

