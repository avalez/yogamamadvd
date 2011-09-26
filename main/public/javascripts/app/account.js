(function($) {

  Sammy = Sammy || {};

  Sammy.AppAccount = function(app, method_alias) {

    app.get('#/account/account', function(context) {
	  if (!context.store.get('user')) {
		this.redirect('#/account/login');
	  } else {
        this.partial('templates/account/account.html', {i18n : context.i18n.account});
      }
    });

    app.get('#/account/login', function(context) {
      context.partial('templates/account/login.html', {i18n : context.i18n.account, flash: {}, type: 'account'});
    });

    app.post('#/account/authenticate', function(context) {
	  var params = {
		username: this.params.username,
		password: this.params.password,
		remember: this.params.remember
	  };
	  $.getJSON('/account/authenticate', params, function(user) {
		context.store.set('user', user);
		context.redirect("#/account/account");
		//alert(context.store.get('user').firstname);
	  });
    });

  }

})( jQuery );

