(function($) {

  Sammy = Sammy || {};

  Sammy.AppCheckout = function(app, method_alias) {

    app.around(function(callback) {
      var context = this;
      if (app.contextMatchesOptions(context, /checkout/)) {
        // check if user is connected
        app.connected(function(user) {
          // automate context.cart
          if (!app.store.get('cart')) {
            app.store.set('cart', {});
          }  
          context.cart = app.store.get('cart');
          callback();
          app.store.set('cart', context.cart);
        });
      } else {
        callback();
      }
    });

    app.get('#/checkout/shipment', function(context) {
      context.cart.shipment = undefined;
      context.partial('templates/checkout/shipment.html')
      .render('templates/account/register.html', {_shipment: 'download', _url: '#/checkout/download'}, function(html) {
        $('div#download-register').html(html);
      }).render('templates/account/login.html', {_type: 'download', _url: '#/checkout/shipment'}, function(html) {
        $('div#download-login').html(html);
      }).render('templates/account/register.html', {_shipment: 'shipment', _url: '#/checkout/ship'}, function(html) {
        $('div#shipment-register').html(html);
      }).render('templates/account/login.html', {_type: 'shipment', _url: '#/checkout/ship'}, function(html) {
        $('div#shipment-login').html(html);
      });
    });
    
    app.any('#/checkout/download', function(context) {
      context.cart.shipment = 'download';
      context.redirect('#/checkout/payment');
    });
    
    app.any('#/checkout/ship', function(context) {
      context.cart.shipment = 'ship';
      context.redirect('#/checkout/payment');
    });
    
    app.get('#/checkout/payment', function(context) {
      context.load('data/gateways.json', function(data) {
        var categories = ['ondelivery', 'internet', 'normal', 'visa_mastercard'];
        context.partial('templates/checkout/payment.html', {categories: categories, gateways: data});
      })
    });
    
    app.post('#/checkout/payment', function(context) {
      context.cart.payment = context.params.gateway;
      context.redirect('#/checkout/checkout');
    });

    app.get('#/checkout/checkout', function(context) {
      if (typeof context.cart.shipment == 'undefined') {
        context.redirect('#/checkout/shipment');
      } else {
        context.partial('templates/checkout/checkout.html');
        context.load('data/items.json', function(products) {
          $.each(products, function(i, product) {
            product.id = i;
            product.selected = i % 2;
          });
          context.renderEach('templates/checkout/selected.html', products).appendTo('#selected');
          context.renderEach('templates/checkout/available.html', products).appendTo('#available');
	      });
	    }
    });

  }

})( jQuery );

