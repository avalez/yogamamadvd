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
    title: ko.observable(),
    editingTitle: ko.observable(false),
    newItem: ko.observable(''),
    editingNewItem: ko.observable(false),
    children: ko.observableArray()
};
viewModel.title.subscribe(function(newValue) {
    if (typeof this.parent != 'undefined') {
        this.parent.name = newValue;
        viewModel.save(viewModel.parent, function(error, data) {
          viewModel.parent._rev = data.rev;
        })
    }
}, viewModel);

viewModel.newItem.subscribe(function(newValue) {
    if ($.trim(newValue) == '') {
        return;
    }
    var doc = {
        parent_id: viewModel.parent._id,
        name: newValue,
        completed: false
    };
    app.uuid(function(uuid) {
        doc._id = uuid;
        viewModel.save(ko.toJS(doc), function(error, data) {
            doc._rev = data.rev;
            viewModel.children.push(observable(doc));
            viewModel.newItem(''); // clear
        })
    })
});

viewModel.reset = function() {
  delete viewModel['parent']; // avoid save
  viewModel.children.splice(0, viewModel.children().length);
}

viewModel.create = function(callback) {
    app.uuid(function(uuid) {
        var doc = {
            _id: uuid,
            parent_id: 'root',
            name: 'Li',
        };
        viewModel.save(doc, function(error, data) {
            doc._rev = data.rev;
            viewModel.reset();
            viewModel.title(doc.name); // set title first to avoid save
            viewModel.parent = doc;
            window.location.hash = '#/' + doc._id;
            if (typeof callback == 'function') {
                callback();
            }
        })
    })
}

viewModel.save = function (doc, callback) {
    request({type: 'PUT', url: app.baseURL + 'api/' + doc._id, data: doc}, callback)
};

viewModel.delete = function(doc) {
    request({type: 'DELETE', url: app.baseURL + 'api/' + doc._id + '?rev=' + doc._rev}, function(error, data) {
        viewModel.children.remove(doc);
    })
    request({url: app.baseURL + '_view/children?' + param({key: doc._id})}, function(error, data) {
        $(data.rows).each(function(i, row) {
            viewModel.delete(row.value);
        })
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
    doc.remove = function() { viewModel.delete(this) };
    return doc;
};

var run = function() {
    ko.applyBindings(viewModel);
    $('footer').show();
}

var load = function(callback) {
    var parent_id = window.location.hash.substring(window.location.hash.lastIndexOf('/') + 1);
    if (typeof viewModel.parent == 'undefined' || viewModel.parent._id != parent_id) {
        request({url: app.baseURL + 'api/' + parent_id}, function(error, data) {
            if (!error) {
                $('div#not-found').hide();
                var $doc = data;
                viewModel.reset();
                viewModel.title($doc.name); // set title first to avoid save
                viewModel.parent = $doc;
                request({url: app.baseURL + '_view/children?' + param({key: parent_id})}, function(error, data) {
                    $(data.rows).each(function(i, row) {
                        viewModel.children.push(observable(row.value));
                    })
                    callback();
                })
            } else {
                $('div#not-found').show();
                viewModel.reset();
                callback();
            }
        })
    }
}

if (typeof $.sammy == 'function') {

    $(function () {
        app.s = $.sammy(function () {
            // Index of all databases
            this.get('#?/', function() {
                viewModel.create(function() {
                })
            });
            this.get(/#\/[\w\d]+$/, function() {
                load(function() {
                })
            })
        })
        app.s.run();
        run();
    });

} else {
    if (window.location.hash) {
        load(run);
    } else {
        viewModel.create(run);
    }
}

