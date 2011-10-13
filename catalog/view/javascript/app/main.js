$(function () {

  // initialize
  app = Sammy('#content', function() {
    this.use('Tmpl', 'html');
    this.use('AppAccount');
    this.use('AppCheckout');

    // TODO: use session cookie (expires_in: -1) but fix sammy-cookie-play first, then make sammy support this
    this.store = new Sammy.Store({name: 'yogamamadvd', element: this.$element(), type: 'session'});
    
    this.bind('location-changed', function(context) {
      // TODO: run once!
      var link = $('link[type*=x-icon]').remove().attr("href");
      $('<link href="'+ link +'" rel="shortcut icon" type="image/x-icon" />').appendTo('head');
      
      // TODO: remove!
      var url = escape(app.getLocation().split('?')[0]);
      if (app.connected()) {
          $('#welcome').html(i18n('text_logged', '#/', app.connected().firstname, '#/account/logout?_url=' + url));
      } else {
          $('#welcome').html(i18n('text_welcome', '#/account/account?_url=' + url, '#/account/register?_url=' + url));
      }
    });

    this.get('#/', function(context) {
      context.partial('catalog/view/theme/yogamamadvd/templates/main.html');
    });
    
  });

  // when i18n loaded, render body then run app
  i18nLoaded.then(function() {
    $.get('catalog/view/theme/yogamamadvd/templates/container.html', function(html) {
        $.tmpl(html).appendTo($('body'));
        app.run('#/');
    })
  })

});

