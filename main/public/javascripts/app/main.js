$(function () {

  // initialize
  var app = Sammy('#content', function() {
    this.use('Tmpl', 'html');
    this.use('AppAccount');
    this.use('AppCheckout');

    // TODO: use session cookie (expires_in: -1) but fix sammy-cookie-play first, then make sammy support this
    this.store = new Sammy.Store({name: 'yogamamadvd', element: this.$element(), type: 'session'});
    
    this.before(function(context) {
      var url = escape(context.path);
      if (app.connected()) {
          $('#welcome').html(i18n('text_logged', '#/', app.connected().firstname, '#/account/logout?_url=' + url));
      } else {
          $('#welcome').html(i18n('text_welcome', '#/account/account?_url=' + url, '#/account/register?_url=' + url));
      }
    });

    this.get('#/', function(context) {
      context.partial('templates/main.html');
    });
    
  });

  // when i18n loaded, render body then run app 
  i18nLoaded.then(function() {
    $.get('templates/container.html', function(html) {
        $.tmpl(html).appendTo($('body'));
        app.run('#/');
    });
  })

});

