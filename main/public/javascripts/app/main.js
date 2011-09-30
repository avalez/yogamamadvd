$(function () {

  // initialize
  var app = Sammy('#content', function() {
    this.use('Tmpl', 'html');
    this.use('AppAccount');
    this.use('AppCheckout');

    // TODO: use session cookie (expires_in: -1) but fix sammy-cookie-play first, then make sammy support this
    this.store = new Sammy.Store({name: 'yogamamadvd', element: this.$element(), type: 'session'});
    
    this.around(function(callback) {
      app.connected(function(user) {
        if (user) {
          $('#welcome').html(i18n('text_logged', '#/', user.firstname, '#/account/logout'));
        } else {
          $('#welcome').html(i18n('text_welcome', '#/account/account', '#/account/register'));
        }
      });

      callback();
    });

    this.get('#/', function(context) {
      context.partial('templates/main.html');
    });
    
  });

  // load body and run app
  $.get('templates/container.html', function(html) {
      $.tmpl(html).appendTo($('body'));
      app.run('#/');
  });

});
