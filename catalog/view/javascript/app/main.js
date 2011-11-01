$(function () {

  // initialize
  app = Sammy('#content', function() {
    this.use('Tmpl', 'html');
    this.use('Title');
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

    this.around(function(route) {
        route();
        if (!$('#content').data('already-loaded')) {
            $('#content').data('already-loaded', true);
        }
    })

    this.get('#?/(index.php)?$', function(context) {
      //context.partial('catalog/view/theme/yogamamadvd/templates/main.html');

      if ($('#content').data('already-loaded')) {

        // TODO: app.getLocation() ?
        var route = this.params.route || 'common/home';
        var url = 'index.php?route=' + route + '&partial=true';
        context.load(url).then(function(content) {
          // strip inner div#content, and eval scripts and styles in order of appearance
          var $el = $('#content');
          $el.html(''); // clean
          $(content).each(function(i, piece) {
            if (piece.nodeName == 'DIV') {
              $el.append(piece.innerHTML); // div#content
            } else if (piece.nodeName == 'TITLE') {
              context.title(piece.innerHTML);
            } else {
              // TODO: browser not supports inline scripts
              $el.append(piece); // scripts/styles/links
            }
          })

        })
      }
    });
    
  });

  // run app, when i18n loaded
  i18nLoaded.always(function() {
      app.run();
  })

});

