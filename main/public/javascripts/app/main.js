$(function () {

  var app = Sammy('#content', function() {
    this.use('Tmpl', 'html');
    this.use('AppAccount');
    this.use('AppCheckout');

    // experimental, todo: app modules similar ( use in callback, but then routes are not ready on app.run)
	$("head").append('<link rel="stylesheet" href="stylesheets/slideshow.css" type="text/css" />');
    $.getScript('javascripts/jquery/nivo-slider/jquery.nivo.slider.pack.js');

    this.around(function(callback) {
	  var context = this;

      context.store = new Sammy.Store({name: 'yogamamaddvd', element: this.$element(), type: 'local'});

	  this.load('data/messages.ru.json').then(function(i18n) {
		context.i18n = i18n;
	  }).then(callback);
    });

    this.get('#/', function(context) {
      context.partial('templates/main.html');
    });

  });

  app.run('#/');
});

