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

$.expr[":"].exactly = function(obj, index, meta, stack) {
    return ($(obj).text() == meta[3])
}

var param = function(a) {
    // Query param builder from jQuery, had to copy out to remove conversion of spaces to +
    // This is important when converting datastructures to querystrings to send to CouchDB.
    var s = [];
    if (jQuery.isArray(a) || a.jquery) {
        jQuery.each(a, function() {
            add(this.name, this.value);
        });
    } else {
        for (var prefix in a) {
            buildParams(prefix, a[prefix]);
        }
    }
    return s.join("&");
    function buildParams(prefix, obj) {
        if (jQuery.isArray(obj)) {
            jQuery.each(obj, function(i, v) {
                if (/\[\]$/.test(prefix)) {
                    add(prefix, v);
                } else {
                    buildParams(prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "") + "]", v)
                }
            });
        } else if (obj != null && typeof obj === "object") {
            jQuery.each(obj, function(k, v) {
                buildParams(prefix + "[" + k + "]", v);
            });
        } else {
            add(prefix, obj);
        }
    }

    function add(key, value) {
        value = jQuery.isFunction(value) ? value() : value;
        s[ s.length ] = encodeURIComponent(key) + '="' + encodeURIComponent(value) + '"';
    }
}

var app = {baseURL: window.location.pathname};

var cache = [];

app.uuid = function (callback) {
    if (cache.length > 0) {
        callback(cache.pop());
    } else {
        request({url: app.baseURL + '_uuids?count=2'}, function(error, data) {
            Array.prototype.push.apply(cache, data.uuids);
            callback(cache.pop());
        });
    }
};

ko.bindingHandlers.editing = {
    init: function(element, valueAccessor, allBindingsAccessor) {
        $(element).focus(function() {
            var value = valueAccessor();
            value(true);
        });
        $(element).blur(function() {
            var value = valueAccessor();
            value(false);
        });
        $(element).keypress(function(event) {
            if (event.which == 13) {
                element.blur();
            } else if (event.keyCode == 27) {
                var allBindings = allBindingsAccessor();
                var oldValue = allBindings.value();
                element.value = oldValue;
                element.blur();
            }
        });
    },
    update: function(element, valueAccessor) {
        var value = valueAccessor();
        if (ko.utils.unwrapObservable(value)) {
            element.focus();
            // position cursor to text end
            var $tmp = element.value;
            element.value = '';
            element.value = $tmp;
        } else {
            element.blur();
        }
    }
};

// The view model is an abstract description of the state of the UI, but without any knowledge of the UI technology (HTML)
var viewModel = {
    title: ko.observable('Test'),
    editingTitle: ko.observable(false),
    newItem: ko.observable(''),
    editingNewItem: ko.observable(false),
    about: ko.observable(false),
    rows: ko.observableArray(),
    roomNotAvailable: ko.observable(false)
};

viewModel.newItem.subscribe(function(newValue) {
    if ($.trim(newValue) == '') {
        return;
    }
    var doc = {
        room_id: viewModel.room._id,
        name: newValue,
        type: 'todo',
        completed: false
    };
    app.uuid(function(uuid) {
        doc._id = uuid;
        viewModel.save(ko.toJS(doc), function(error, data) {
            doc._rev = data.rev;
            viewModel.rows.push(observable(doc));
            viewModel.newItem(''); // clear
        })
    })
});

viewModel.save = function (doc, callback) {
    request({type: 'PUT', url: app.baseURL + 'api/' + doc._id, data: doc}, callback)
};

viewModel.delete = function(doc) {
    request({type: 'DELETE', url: app.baseURL + 'api/' + doc._id + '?rev=' + doc._rev}, function(error, data) {
        viewModel.rows.remove(doc);
    })
}

var observable = function(doc) {
    var $save = function() {
        viewModel.save(ko.toJS(doc), function(error, data) {
            doc._rev = data.rev;
        })
    };
    doc.name = ko.observable(doc.name);
    doc.name.subscribe($save);
    doc.completed = ko.observable(doc.completed);
    doc.completed.subscribe($save);
    doc.editing = ko.observable(false);
    return doc;
};

app.init = function(context) {
  app.uuid(function(uuid) {
    var doc = {
      _id: uuid,
      type: 'room',
      name: 'Test' 
    };
    viewModel.save(doc, function(error, data) {
      doc._rev = data.rev;
      viewModel.room = doc;
      context.redirect('#/' + doc._id);
    })
  })
  
}

app.index = function() {
  var url = app.s.getLocation();
  var room_id = url.substring(url.lastIndexOf('/') + 1);
  if (typeof viewModel.room == 'undefined' || viewModel.room._id != room_id) { // returning user
    request({url: app.baseURL + '_view/room?' + param({key: room_id})}, function(error, data) {
      if (data.rows.length) {
        viewModel.roomNotAvailable(false);
        viewModel.room = data.rows[0].value;
        viewModel.title(viewModel.room.name); 
        request({url: app.baseURL + '_view/todo?' + param({key: viewModel.room._id})}, function(error, data) {
          $(data.rows).each(function(i, row) {
            viewModel.rows.push(observable(row.value));
          })
        })
      } else {
        viewModel.roomNotAvailable(true);
        delete viewModel['room'];
        viewModel.rows.splice(0, viewModel.rows().length);
      }
    });  
  }
  ko.applyBindings(viewModel);

  $('footer').show();
};

$(function () { 
  app.s = $.sammy(function () {
    // Index of all databases
    this.get('#?/', app.init);
    this.get(/#\/[\w\d]+$/, app.index);
  })
  app.s.run();
});

