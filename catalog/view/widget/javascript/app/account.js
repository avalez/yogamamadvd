(function($) {

  Sammy = Sammy || {};

  Sammy.AppAccount = function(app, method_alias) {
    app.get('/account/account', function(context) {
      context.title(i18n('text_account'));
      app.connected(function(user) {
        if (!user) {
          var url = escape(context.params._url || 'index.php/account/account');
          context.redirect(app.fullPath('index.php/account/login?_url=' + url));
        } else {
          app.runRoute('get', '/index.php', { route: 'account/account'});
          //context.redirect(app.fullPath("index.php?route=account/account"));
          //context.partial('catalog/view/theme/yogamamadvd/templates/account/account.html');
        }
      })
    });

    app.get('index.php/account/login', function(context) {
      context.partial('catalog/view/theme/yogamamadvd/templates/account/login.html', {_type: 'account', _url: context.params._url});
    });

    app.post('index.php/account/login', function(context) {
      $.ajax({url:'index.php?route=account/loginx', data: context.params.toHash(), type: 'post',
        success: function(user) {
          app.store.set('user', user);
          var url = context.params._url;
          if (!url || url.match(/account/)) {
            url =  'index.php/account/account';
          }
          context.redirect(app.fullPath(url));
        },
        error: function(jqXHR, textStatus) {
          $('div.login-warning').show().delay(3000).fadeOut('slow');            
        }
      });
    });

    app.get('index.php/account/register', function(context) {
      context.partial('catalog/view/theme/yogamamadvd/templates/account/register.html', {_shipment: ''});
    });
    
    app.post('index.php/account/register', function(context) {
      var url = 'index.php?route=account/registerx';
      if (context.params._action === 'update') {
        url = 'index.php?route=account/addressx';
      }
      var data = context.params.toHash ? context.params.toHash() : context.params;
      $.ajax({url:url, data: data, type: 'post',
        success: function(user) {
          app.store.set('user', user);
          var url = context.params._url;
          if (!url || url.match(/account/)) {
            url =  'index.php/account/account';
          }
          context.redirect(app.fullPath(url));
        },
        error: function(jqXHR, textStatus) {
          $('div.register-warning').show().delay(3000).fadeOut('slow');            
        }
      })
    });

    app.get('index.php/account/logout', function(context) {
      $.get('index.php?route=account/logoutx', function(user) {
          app.log('logged out');
      });
      app.store.clear('user');
      var url = context.params._url || '';
      if (url.match(/account/)) {
        url = '';
      }
      this.redirect(app.fullPath(url));
    });
    
    app.connected = function(callback) {
      if (typeof callback == 'undefined') {
        return app.store.get('user');
      } else {
        $.get('index.php?route=account/loginx', function(user) {
          app.store.set('user', user);
           // update welcome text
          app.trigger('location-changed');
        }).always(callback);
      }
    }
 
  }

})( jQuery );

