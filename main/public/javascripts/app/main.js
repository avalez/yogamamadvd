$(function () {

  var app = Sammy('#content', function() {
    this.use('Tmpl', 'html');
    this.use('AppAccount');
    this.use('AppCheckout');

    // experimental, use play! ${i18n/} in play's app/view/main.html instead or static properties file
    // todo: app modules similar ( 'use' in callback)
    $.ajax({url: '/application/messages', async: false, success: function(html) {
      $('head').append(html);
    }});

    this.around(function(callback) {
      var context = this;

      context.store = new Sammy.Store({name: 'yogamamaddvd', element: this.$element(), type: 'local'});
      
      var welcome = i18n('text_welcome', '#/account/account', '#/account/register');
      if (context.store.get('user')) {
        welcome = i18n('text_logged', '#/', context.store.get('user').firstname, '#/account/logout');
      }
      $('#welcome').html(welcome);

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

