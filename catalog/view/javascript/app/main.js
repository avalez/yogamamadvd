$(function () {

  // initialize
  app = Sammy('#content', function() {
    this.use('Tmpl', 'html');
    this.use('AppAccount');
    this.use('AppCheckout');

    // TODO: use session cookie (expires_in: -1) but fix sammy-cookie-play first, then make sammy support this
    this.store = new Sammy.Store({name: 'yogamamadvd', element: this.$element(), type: 'session'});
    
    this.bind('location-changed', function(context) {
      // TODO? on redirect
      //var link = $('link[type*=x-icon]').remove().attr("href");
      //$('<link href="'+ link +'" rel="shortcut icon" type="image/x-icon" />').appendTo('head');
      
      // TODO: remove!
      var url = escape(app.getLocation().split('?')[0]);
      if (app.connected()) {
          $('#welcome').html(i18n('text_logged', '#/account/account', app.connected().firstname, '#/account/logout?_url=' + url));
      } else {
          $('#welcome').html(i18n('text_welcome', '#/account/account?_url=' + url, '#/account/register?_url=' + url));
      }
    });

    this.get('#?/(index.php)?', function(context) {
      //context.partial('catalog/view/theme/yogamamadvd/templates/main.html');
      if (!this.params.route || this.params.route == 'common/home') {
        //TODO? partial: this.params.route = 'common/main';
        context.load('index.php?route=common/main').swap();
      } else {
        window.location.reload();
      }
      //TODO? partial: context.load('index.php?route=' + this.params.route + '&partial=true').swap();
    })
    
  });

  // run app, when i18n loaded
  i18nLoaded.always(function() {
      app.run();
  })

});

