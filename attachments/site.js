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

var cache = [];

app.uuid = function (callback) {
    if (cache.length > 0) {
        callback(cache.pop());
    } else {
        request({url: app.baseURL + '/../../../../_uuids?count=2'}, function(error, data) {
            Array.prototype.push.apply(cache, data.uuids);
            callback(cache.pop());
        });
    }
};

ko.bindingHandlers.addOnEnter = {
    init: function(element, valueAccessor) {
        $(element).keypress(function(event) {
          if ( event.which == 13 ) {
             event.preventDefault();
             var doc = {
               name: event.target.value,
               type: 'todo',
               completed: false
             };
             app.uuid(function(uuid) {
               doc._id = uuid;
               save(ko.toJS(doc), function(error, data) {
                 doc._rev = data.rev;
               })             
             })
           }
        })
    }
};

// The view model is an abstract description of the state of the UI, but without any knowledge of the UI technology (HTML)
var viewModel = {};

var save = function (doc, callback) {
  request({type: 'PUT', url: app.baseURL + '/api/' + doc._id, data: doc}, callback)
};

var create = function() {
  
}

var observable = function(doc) {
  var $save = function() {
    save(ko.toJS(doc), function(error, data) {
      doc._rev = data.rev;
    })
  };
  doc.name = ko.observable(doc.name);
  doc.name.subscribe($save);
  doc.completed = ko.observable(doc.completed);
  doc.completed.subscribe($save);
  return doc;
};

request({url: app.baseURL + '/_view/foo'}, function(error, data) {
  viewModel.rows = ko.observableArray();
  $(data.rows).each(function(i, row) {
    viewModel.rows.push(observable(row.value));
  })

  viewModel.rows.subscribe(save);

  ko.applyBindings(viewModel);


  var input = document.getElementById('new');
  var title = document.getElementById('title');
  var list = document.getElementById('list');
  var about = document.getElementById('about');
  var create = document.getElementById('create');
  var header = document.querySelector('header');
  var footer = document.querySelector('footer');
  var hash = window.location.hash;

  header.style.display = 'block';
  footer.style.visibility = 'visible'
});


