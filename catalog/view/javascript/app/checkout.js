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

      app.loadProducts(context, productIds, function(products) {
        $.each(products, function(i, product) {
          var item = items[product.product_id] || {};
          var old_quantity = item.quantity || 0;
          var old_price = item.price || 0;

          total_quantity -= old_quantity;
          total -= old_quantity * old_price;

          if (qties) {
            var quantity = parseInt(qties['qties.' + product.product_id]);
            items[product.product_id] = {
              name: product.name,
              quantity: quantity,
              price: parseFloat(product.price),
              total: product.price * quantity
            }
            total_quantity += quantity;
            total += quantity * parseFloat(product.price)
          } else { // remove
            items[product.product_id] = null;
          }
        })

        app.cart('items', items);
        app.cart('quantity', total_quantity);
        app.cart('total', total);
        app.cart('additional_costs', 1);
        app.cart('grand_total', total + 1);
        
        if (callback) {
          callback();
        }
      })
    }
    
    app.loadProducts = function(context, productIds, callback) {
      if ($.isFunction(productIds)) {
        callback = productIds;
        productIds = null;
      }
      context.load('index.php?route=product/categoryx&name=Cameras', {cache: false}, function(products) {
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
        if (data.callback) {
          data.callback();
        }
      } else if (data.products) {
        app.updateCart(this, data.products, data.qties, data.callback);
      } else {
        throw "unknown update";
      }
      
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
        app.connected(function(user) {
          // register form will appear only for 'ship' +  conected
          var register = {_shipment: 'ship', _action: 'update', _url: '#/checkout/checkout'};
          app.loadProducts(context, function(products) {
            context.load('catalog/gateways.json', function(gateways) {
              context.partial('catalog/view/theme/yogamamadvd/templates/checkout/checkout.html',
                {products: products, gateways: gateways}
              ).render('catalog/view/theme/yogamamadvd/templates/account/register.html', register, function(html) {
                  $('#dialog').html(html)
              })
            })
	        })
	      })
      }
    });

    app.post('#/checkout/checkout', function(context) {
      var data = {jsonCart: $.toJSON(app.cart())};
      $.ajax({url:'index.php?route=checkout/checkoutx', data: data, type: 'post',
        success: function(html) {
          app.swap(html.output);
          //context.redirect('#/account/account');
        },
        error: function(jqXHR, textStatus) {
          $('div.checkout-warning').show().delay(3000).fadeOut('slow');            
        }
      })
    });

  }

})( jQuery );

