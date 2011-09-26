(function($) {

  Sammy = Sammy || {};

  Sammy.AppCheckout = function(app, method_alias) {

    app.get('#/checkout/shipment', function(context) {
      context.partial('templates/checkout/shipment.html');
    });

    app.get('#/checkout/checkout', function(context) {
      context.partial('templates/checkout/checkout.html');
      context.load('data/items.json', function(products) {
        $.each(products, function(i, product) {
          product.id = i;
          product.selected = i % 2;
        });
        context.renderEach('templates/checkout/selected.html', products).appendTo('#selected');
        context.renderEach('templates/checkout/available.html', products).appendTo('#available');
	  });
    });

  }

})( jQuery );

