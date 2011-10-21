(function($) {

  Sammy = Sammy || {};

  Sammy.AppCheckout = function(app, method_alias) {

    // functions  
    
    app.cart = function(key, value) {
      var cart = app.store.get('cart') || {};
      if (arguments.length === 0) {
        return cart;
      } else if (arguments.length === 2) {
        cart[key] = value;
        app.store.set('cart', cart);
      }
      return cart[key];
    }
    
    app.updateCart = function(context, productIds, qties, callback) {
      var items = app.cart('items') || {},
        total_quantity = app.cart('quantity') || 0,
        total = app.cart('total') || 0;
      
      var totals = function() {
        // update totals
        var data = {jsonCart: $.toJSON(app.cart())};
        $.ajax({url:'index.php?route=checkout/checkoutx', data: data, type: 'post',
          success: function(totals) {
            app.cart('totals', totals)
          },
          error: function(jqXHR, textStatus) {
            $('div.checkout-warning').show().delay(3000).fadeOut('slow')
          }
        }).always(callback)
      };

      if (productIds) {
        // update cart
        app.loadProducts(context, productIds, function(products) {
          $.each(products, function(i, product) {
            var item = items[product.product_id] || {};

            if (qties) {
              var quantity = parseInt(qties['qties.' + product.product_id]);
              items[product.product_id] = {
                name: product.name,
                quantity: quantity,
              }
            } else { // remove
              delete items[product.product_id];
            }
          });

          app.cart('items', items);
          totals()
        })
      } else {
        totals()
      }
    }
    
    app.loadProducts = function(context, productIds, callback) {
      if ($.isFunction(productIds)) {
        callback = productIds;
        productIds = null;
      }
      return context.load('index.php?route=product/categoryx&name=Yoga', {cache: true}, function(products) {
        if (productIds) {
          var ids = $.isArray(productIds) ? productIds : [productIds];
          products = $.grep(products, function(product) {
            return !productIds || $.inArray(product.product_id, ids) >= 0;
          });
        }
        callback(products)
      })
    }

    // let define new variable within jquery templates, e.g. {{var xxx=123}}    

    $.extend($.tmpl.tag, {
        "var": {
            open: "var $1;"
        }
    });
    
    // events
    
    app.bind('updateCart', function(arg0, data) {
      if (data.shipment) {
        app.cart('shipment', data.shipment);
      }
      if (data.payment) {
        app.cart('payment', data.payment);
      }
      app.updateCart(this, data.products, data.qties, data.callback);
    });
    
    // routes

    app.get('#/checkout/shipment', function(context) {
      app.connected(function() {
        context.partial('catalog/view/theme/yogamamadvd/templates/checkout/shipment.html')
        .render('catalog/view/theme/yogamamadvd/templates/account/register.html', {_shipment: 'download', _url: '#/checkout/download'}, function(html) {
          $('div#download-register').html(html);
        }).render('catalog/view/theme/yogamamadvd/templates/account/login.html', {_type: 'download', _url: '#/checkout/shipment'}, function(html) {
          $('div#download-login').html(html);
        }).render('catalog/view/theme/yogamamadvd/templates/account/register.html', {_shipment: 'shipment', _url: '#/checkout/ship'}, function(html) {
          $('div#shipment-register').html(html);
        }).render('catalog/view/theme/yogamamadvd/templates/account/login.html', {_type: 'shipment', _url: '#/checkout/ship'}, function(html) {
          $('div#shipment-login').html(html);
        })
      })
    });
    
    app.any('#/checkout/download', function(context) {
      app.cart('shipment', 'download');
      context.redirect('#/checkout/payment');
    });
    
    app.any('#/checkout/ship', function(context) {
      app.cart('shipment', 'ship');
      context.redirect('#/checkout/payment');
    });
    
    app.get('#/checkout/payment', function(context) {
      if (!app.cart('shipment')) {
        context.redirect('#/checkout/shipment');
      } else {
        context.load('catalog/gateways.json', function(data) {
          var categories = ['ondelivery', 'internet', 'normal', 'visa_mastercard'];
          context.partial('catalog/view/theme/yogamamadvd/templates/checkout/payment.html', {categories: categories, gateways: data});
        })
      }
    });
    
    app.post('#/checkout/payment', function(context) {
      app.cart('payment', context.params.gateway);
      app.cart('_category', context.params._category);
      context.redirect('#/checkout/product');
    });
    
    app.get('#/checkout/product', function(context) {
      if (!app.cart('payment')) {
        context.redirect('#/checkout/payment');
      } else {
        app.loadProducts(context, function(products) {
          context.partial('catalog/view/theme/yogamamadvd/templates/checkout/product.html', {products: products});
        })
      }
    });

    app.post('#/checkout/product', function(context) {
      app.cart('items', {});
      app.cart('quantity', 0);
      app.cart('total', 0);
      app.updateCart(context, context.params.products, context.params, function() {
        context.redirect('#/checkout/checkout');
      })
    });

    app.get('#/checkout/checkout', function(context) {
      if (!app.cart('items')) {
        context.redirect('#/checkout/product');
      } else {
        app.updateCart(context, null, null, function() {
          app.connected(function(user) {
            var deferred = function() {
              return $.get('index.php?route=account/addressx&addressId=' + user.addressId);
            };
            $.when(deferred()).always(function(address) {
              // register form will appear only for 'ship' +  conected
              var register = {_shipment: 'ship', _action: 'update', _url: '#/checkout/checkout', address: address};
              app.loadProducts(context, function(products) {
                context.load('catalog/gateways.json', function(gateways) {
                  context.partial('catalog/view/theme/yogamamadvd/templates/checkout/checkout.html',
                    {products: products, gateways: gateways, address: address}
                  ).render('catalog/view/theme/yogamamadvd/templates/account/register.html', register, function(html) {
                      $('#dialog').html(html);
                  })
                })
              })
  	        })
          })
	      })
      }
    });
    
    app.post('#/checkout/checkout', function(context) {
      $.ajax({url:'index.php?route=checkout/checkoutx', type: 'get',
        success: function(json) {
          // redirect after post
          app.store.set('html', json.output);
          context.redirect('#/checkout/confirm');
        },
        error: function(jqXHR, textStatus) {
          $('div.checkout-warning').show().delay(3000).fadeOut('slow');            
        }
      })
    });

    app.get('#/checkout/confirm', function(context) {
      if (!app.store.get('html')) {
        context.redirect('#/checkout/checkout');
      } else {
        app.swap(app.store.get('html'));
      }
    });

  }

})( jQuery );

