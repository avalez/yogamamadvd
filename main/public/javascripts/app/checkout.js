(function($) {

  Sammy = Sammy || {};

  Sammy.AppCheckout = function(app, method_alias) {

    // helper    
    var cart = function(key, value) {
      var cart = app.store.get('cart') || {};
      if (arguments.length === 0) {
        return cart;
      } else if (arguments.length === 2) {
        cart[key] = value;
        app.store.set('cart', cart);
      }
      return cart[key];
    }

    app.get('#/checkout/shipment', function(context) {
      app.connected(function() {
        context.partial('templates/checkout/shipment.html')
        .render('templates/account/register.html', {_shipment: 'download', _url: '#/checkout/download'}, function(html) {
          $('div#download-register').html(html);
        }).render('templates/account/login.html', {_type: 'download', _url: '#/checkout/shipment'}, function(html) {
          $('div#download-login').html(html);
        }).render('templates/account/register.html', {_shipment: 'shipment', _url: '#/checkout/ship'}, function(html) {
          $('div#shipment-register').html(html);
        }).render('templates/account/login.html', {_type: 'shipment', _url: '#/checkout/ship'}, function(html) {
          $('div#shipment-login').html(html);
        })
      })
    });
    
    app.any('#/checkout/download', function(context) {
      cart('shipment', 'download');
      context.redirect('#/checkout/payment');
    });
    
    app.any('#/checkout/ship', function(context) {
      cart('shipment', 'ship');
      context.redirect('#/checkout/payment');
    });
    
    app.get('#/checkout/payment', function(context) {
      if (!cart('shipment')) {
        context.redirect('#/checkout/shipment');
      } else {
        context.load('data/gateways.json', function(data) {
          var categories = ['ondelivery', 'internet', 'normal', 'visa_mastercard'];
          context.partial('templates/checkout/payment.html', {categories: categories, gateways: data});
        })
      }
    });
    
    app.post('#/checkout/payment', function(context) {
      cart('payment', context.params.gateway);
      context.redirect('#/checkout/product');
    });

    app.get('#/checkout/product', function(context) {
      if (!cart('payment')) {
        context.redirect('#/checkout/payment');
      } else {
        context.load('data/products.json', function(data) {
          context.partial('templates/checkout/product.html', {products: data});
        })
      }
    });
    
    app.post('#/checkout/product', function(context) {
      var items = {}, total_quantity = 0, total = 0;
      context.load('data/products.json', function(products) {
        $.each(products, function(i, product) {
          var selected = $.isArray(context.params.products) ? context.params.products : [context.params.products];
          if ($.inArray(product.id.toString(), selected) >= 0) {
            var quantity = parseInt(context.params['qties.' + product.id]);
            var price = product.price;
            items[product.id] = {
              quantity: quantity,
              price: price,
              total: price * quantity
            };
            total_quantity += quantity;
            total += quantity * price;
          }
        })
        cart('items', items);
        cart('quantity', total_quantity);
        cart('total', total);
        context.redirect('#/checkout/checkout');
      })
    });

    app.get('#/checkout/checkout', function(context) {
      if (!cart('items')) {
        context.redirect('#/checkout/product');
      } else {
        context.partial('templates/checkout/checkout.html');
        context.load('data/products.json', function(products) {
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

