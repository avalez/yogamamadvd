var request = function (options, callback) {
  options.success = function (obj) {
    callback(null, obj);
  }
  options.error = function (err) {
    if (err) callback(err);
    else callback(true);
  }
  if (options.data && typeof options.data == 'object') {
    options.data = JSON.stringify(options.data)
  }
  if (!options.dataType) options.processData = false;
  if (!options.dataType) options.contentType = 'application/json';
  if (!options.dataType) options.dataType = 'json';
  $.ajax(options)
}

$.expr[":"].exactly = function(obj, index, meta, stack){ 
  return ($(obj).text() == meta[3])
}

var param = function( a ) {
  // Query param builder from jQuery, had to copy out to remove conversion of spaces to +
  // This is important when converting datastructures to querystrings to send to CouchDB.
	var s = [];
	if ( jQuery.isArray(a) || a.jquery ) {
		jQuery.each( a, function() { add( this.name, this.value ); });		
	} else { 
	  for ( var prefix in a ) { buildParams( prefix, a[prefix] ); }
	}
  return s.join("&");
	function buildParams( prefix, obj ) {
		if ( jQuery.isArray(obj) ) {
			jQuery.each( obj, function( i, v ) {
				if (  /\[\]$/.test( prefix ) ) { add( prefix, v );
				} else { buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "") +"]", v )}
			});				
		} else if (  obj != null && typeof obj === "object" ) {
			jQuery.each( obj, function( k, v ) { buildParams( prefix + "[" + k + "]", v ); });				
		} else { add( prefix, obj ); }
	}
	function add( key, value ) {
		value = jQuery.isFunction(value) ? value() : value;
		s[ s.length ] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
	}
}

var app = {baseURL: /* util.getBaseURL(document.location.pathname) */ 'http://li.iriscouch.com/cats/_design/app/_rewrite'};
app.index = function () {
  request({url: app.baseURL + '/_view/foo'}, function(error, data) {
    app.s.swap($('script#test').tmpl(data));
    $(data.rows).each(function(i, row) {
        $('input#' + row.id).data('doc', row.value);
    })
  })
};

app.update = function (item) {
    var doc = $(item).data('doc');
    doc.name = item.value;
    request({type: 'PUT', url: app.baseURL + '/api/' + item.id, data: doc}, function(error, data) {
    })
}

/*
$(function () {
  app.s = $.sammy('body', function () {
    // Index of all databases
    this.get('', app.index);
    this.get("#/", app.index);
  })
  app.s.run();
});
*/

// The view model is an abstract description of the state of the UI, but without any knowledge of the UI technology (HTML)
var viewModel = {};

var save = function (row) {
  request({type: 'PUT', url: app.baseURL + '/api/' + row._id, data: row}, function(error, data) {
  })
};

request({url: app.baseURL + '/_view/foo'}, function(error, data) {
  viewModel.rows = ko.observableArray(); //ko.observableArray(data.rows);
  $(data.rows).each(function(i, row) {
    var o = ko.observable(row.value);
    viewModel.rows.push(o);
    o.subscribe(function() {
        alert(this)});
  })

  viewModel.rows.subscribe(save);

  ko.applyBindings(viewModel);
});
