$(function () {

  var app = Sammy('#content', function() {
    this.use('Tmpl', 'html');
    this.use('AppAccount');
    this.use('AppCheckout');

    // TODO: static properties file or use ${i18n/} in play! template
    // TODO?: app modules similar ( 'use' in callback)
    $.ajax({url: '/ws/messages', async: false, success: function(html) {
      $('head').append(html);
    }});

    // TODO: use session cookie (expires_in: -1) but fix sammy-cookie-play first
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
      if ($('body').nivoSlider == undefined) {
        $("head").append('<link rel="stylesheet" href="stylesheets/slideshow.css" type="text/css" />');
        $.getScript('javascripts/jquery/nivo-slider/jquery.nivo.slider.pack.js');
      }

      context.partial('templates/main.html');
    });

  });

  app.run('#/');
});

