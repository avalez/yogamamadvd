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
            add(prefix, a[prefix]);
        }
    }
    return s.join("&");

    function add(key, value) {
        value = jQuery.isFunction(value) ? value() : value;
        if ($.inArray(key, ["key", "startkey", "endkey"]) >= 0) {
          value = JSON.stringify(value);
        }
        s[ s.length ] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
    }
}

function nil() {}

var m = document.location.pathname.match(/.+\//);
var baseUrl = m ? '' : 'api/dummy/dummy/';
var app = {baseURL: baseUrl};

var cache = [];

app.uuid = function (callback) {
    if (cache.length > 0) {
        callback(cache.pop());
    } else {
        return request({url: app.baseURL + '../../../_uuids?count=2'}, function(error, data) {
            Array.prototype.push.apply(cache, data.uuids);
            callback(cache.pop());
        });
    }
}

app.view = function (view_id, params, callback) {
  request({url: '_view/' + view_id + '?' + param(params)}, callback);
}

app.create = function(doc, callback) {
  if (typeof doc._id == 'undefined') {
    app.uuid(function(uuid) {
      doc._id = uuid;
      app.update(doc, function(error, data) {
        callback(error, doc)
      })
    })
  } else {
    app.update(doc, function(error, data) {
      callback(error, doc)
    })
  }
}

app.doCreate = function(doc, callback) {
  
}

app.read = function(doc_id, callback) {
  request({type: 'GET', url: app.baseURL + '../../' + doc_id}, callback);
}

app.update = function(doc, callback) {
  request({type: 'PUT', url: app.baseURL + '../../' + doc._id, data: doc}, function(error, data) {
    doc._rev = data.rev;
    callback(error, {});
  })
}

app.remove = function(doc_id, doc_rev, callback) {
  request({type: 'DELETE', url: app.baseURL + '../../' + doc_id + '?rev=' + doc_rev}, callback);
}

/**
 * @namespace
 * $.couch.db.changes provides an API for subscribing to the changes
 * feed
 * <pre><code>var $changes = $.couch.db("mydatabase").changes();
 *$changes.onChange = function (data) {
 *    ... process data ...
 * }
 * $changes.stop();
 * </code></pre>
 */
app.changes = function(since, options) {

  options = options || {};
  // set up the promise object within a closure for this handler
  var timeout = 100, active = true,
    listeners = [],
    promise = /** @lends $.couch.db.changes */ {
      /**
       * Add a listener callback
       * @see <a href="http://techzone.couchbase.com/sites/default/
       * files/uploads/all/documentation/couchbase-api-db.html#couch
       * base-api-db_db-changes_get">docs for /db/_changes</a>
       * @param {Function} fun Callback function to run when
       * notified of changes.
       */
    onChange : function(fun) {
      listeners.push(fun);
    },
      /**
       * Stop subscribing to the changes feed
       */
    stop : function() {
      active = false;
    }
  };
  // call each listener when there is a change
  function triggerListeners(resp) {
    $.each(listeners, function() {
      this(resp);
    });
  };
  // when there is a change, call any listeners, then check for
  // another change
  options.success = function(error, resp) {
    if (error) {
      options.error();
    } else {
      timeout = 100;
      if (active) {
        since = resp.last_seq;
        setTimeout(function() {
          triggerListeners(resp);
          getChangesSince();
        }, timeout);
      };
    };
  };
  options.error = function() {
    if (active) {
      setTimeout(getChangesSince, timeout);
      timeout = timeout * 2;
    }
  };
  // actually make the changes request
  function getChangesSince() {
    var opts = {
      heartbeat : 10 * 1000,
      feed : "longpoll",
      since : since
    }
    request(
      {url: app.baseURL + "../../_changes?" + param(opts)},
      options.success
    );
  }
  // start the first request
  if (since) {
    getChangesSince();
  } else {
    request({url: app.baseURL + '../../'}, function(error, info) {
      since = info.update_seq;
      getChangesSince();
    });
  }
  return promise;
}

///////////////////////////////////////////////////////////////////////////////

var editor;

// http://stackoverflow.com/questions/6987132/knockoutjs-html-binding
ko.bindingHandlers.htmlValue = {
  init: function(element, valueAccessor, allBindingsAccessor) {
      ko.utils.registerEventHandler(element, "click", function(event) {
        var t = document.elementFromPoint(event.clientX, event.clientY);
        if (!t || (t.nodeName != 'A' && element.contentEditable != 'true')) {
          element.contentEditable = 'true';
          element.focus();
          editor.enable(element);
        }
      });
      ko.utils.registerEventHandler(element, "blur", function() {
        if (!element.preventblur) {
          element.contentEditable = 'false';
          var htmlValue = valueAccessor();
          var elementValue = element.innerHTML;
          if (ko.isWriteableObservable(htmlValue)) {
              htmlValue(elementValue);
          }
          else { //handle non-observable one-way binding
              var allBindings = allBindingsAccessor();
              if (allBindings['_ko_property_writers'] && allBindings['_ko_property_writers'].htmlValue) allBindings['_ko_property_writers'].htmlValue(elementValue);
          }
          editor.enable(false);
        }
      });
      $(element).keypress(function(event) {
        if (event.keyCode == 27) {
          var value = valueAccessor();
          element.innerHTML = value();
          element.blur();
          event.preventDefault();
        }
      });
    },
    update: function(element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor()) || "";
        element.innerHTML = value;
    }
};

edit = function(object, event) {
  $('.editable', event.target.parentNode.parentNode).click();
}


///////////////////////////////////////////////////////////////////////////////

var myChanges = [];

// append array
ko.observableArray.fn.pushAll = function(array) {
  var underlyingArray = this();
  this.valueWillMutate();
  var methodCallResult = Array.prototype.push.apply(underlyingArray, array);
  this.valueHasMutated();
  return methodCallResult;
};

// The view model is an abstract description of the state of the UI, but without any knowledge of the UI technology (HTML)
var viewModel = {
    root: observable({name: ''}),
    newItem: ko.observable(''),
    notes: ko.observableArray(),
    children: ko.observableArray()
}

viewModel.newItem.subscribe(function(newValue) {
    if ($.trim(newValue) == '') {
        return;
    }
    var parent_id = viewModel.children()[0] ? viewModel.children()[0]._id : 'root';
    viewModel.create({parent_id: parent_id, name: newValue, type: 'note', order: 0}, function(error, doc) {
        viewModel.notes.push(doc);
        viewModel.newItem(''); // clear
    })
});

viewModel.reset = function() {
  viewModel.children.splice(0, viewModel.children().length);
  viewModel.notes.splice(0, viewModel.notes().length);
}

viewModel.create = function(doc, callback) {
  var doc_to_save = ko.toJS(doc);
  delete doc_to_save['index'];
  app.create(doc_to_save, function(error, doc) {
    if (!error) {
      myChanges.push(doc._id);
      /*
      changes = myChanges[data.id] || [];
      changes.push(data.rev);
      myChanges[data.id] = changes;
      */
    
      callback(error, doc);
    }
  });
}

viewModel.read = function(doc_id, callback) {
  app.read(doc_id, function(error, data) {
    callback(data);
  })
}

viewModel.save = function (doc, callback) {
    var doc_to_save = ko.toJS(doc);
    delete doc_to_save['index'];
    app.update(doc_to_save, function(error, data) {
      if (!error) {
        doc._rev = data.rev;
        myChanges.push(data.id);
        /*
        changes = myChanges[data.id] || [];
        changes.push(data.rev);
        myChanges[data.id] = changes;
        */
      } else if (data.error == 'conflict') {
        // TODO: alert
        doc.load();
      }
      callback(error, data);
    })
}

viewModel.remove = function(doc_id, doc_rev) {
    app.remove(doc_id, doc_rev, function(error, data) {
      myChanges.push(data.id);
      /*
        changes = myChanges[data.id] || [];
        changes.push(data.rev);
        myChanges[data.id] = changes;
      */
    })
    // cascade
    app.view('children', {key: doc_id}, function(error, data) {
        $(data.rows).each(function(i, row) {
            viewModel.remove(row.id, row.value); // recurse
        })
    })
}

// rather belong to doc, but to both new and existing, so bind it to viewModel
viewModel.add = function($data) {
  viewModel.children.splice($data.index() + 1, 0,
    observableNewItem(getOrder(viewModel.children, $data.index())));
}

function observable(doc) {
    var $save = function() {
      if (!doc.syncing) {
        viewModel.save(doc, nil);
      }
    }
    doc.name = ko.observable(doc.name);
    doc.name.subscribe($save);
    doc.remove = function() {
      viewModel.remove(doc._id, doc._rev);
      if (doc._id == viewModel.children()[0]._id) {
        if (window.location.hash == '#/' || !window.location.hash) {
          delete viewModel.children()[0]['_id']; // force reload
          load();
        } else {
          var id = (doc.parent_id == 'root' ? '' : doc.parent_id);
          window.location.hash = '#/' + id;
        }
      } else {
        viewModel.children.remove(doc);
      }
    }
    doc.load = function() { 
      viewModel.read(this._id, doc.set);
    }
    doc.set = function(data) {
      doc._id = data._id;
      doc._rev = data._rev;
      doc.parent_id = data.parent_id;
      doc.type = data.type;
      doc.order = data.order;
      doc.syncing = true; // prevent save
      doc.name(data.name);
      delete doc['syncing'];      
    }
    
    return doc;
}

function getOrder(array, index) {
  if (typeof array == 'function') {
    array = array();
  }
  if (typeof index == 'function') {
  	index = index();
  }
  var parent_id = index == 0 ? array[index]._id : array[index].parent_id;
  var prev_order = array[index].order;
  var next_order = index == array.length - 1 ? 9007199254740992 : array[index + 1].order;
  var new_order = Math.floor(Math.random() * (next_order - prev_order)) + prev_order;  
  return {parent_id: parent_id, order: new_order};
}

function observableNewItem(options) {
  var doc = {parent_id: options.parent_id, order: options.order};
  doc.name = ko.observable('');
  doc.type = 'section';
  doc.remove = function() {
    // just remove it
    viewModel.children.splice(this.index(), 1);
  };
  doc.name.subscribe(function(newValue) {
    if ($.trim(newValue) == '') {
        return;
    }

    viewModel.create(doc, function(error, new_doc) {
      // convert to existing observable inplace
      viewModel.children.splice(doc.index(), 1, observable(new_doc));
    });
  }, doc);
  return doc;
}

// attach index to items whenever array changes
// http://stackoverflow.com/questions/6047713/bind-template-item-to-the-index-of-the-array-in-knockoutjs
var indexMaintainance = function() {
    var children = this.children();
    for (var i = 0, j = children.length; i < j; i++) {
       var child = children[i];
        if (!child.index) {
           child.index = ko.observable(i);  
        } else {
           child.index(i);   
        }
    }
};

viewModel.children.subscribe(indexMaintainance, viewModel);

function observableArray(data) {
  var array = [];
  $(data.rows).each(function(i, row) {
      row.doc.index = ko.observable(i);
      if (typeof row.doc.order == 'undefined') {
        row.doc.order = i; // TODO: getOrder
      }
      array.push(observable(row.doc))      
  })  
  return array;
}

// check if change has any modification from outside,
// return false if not our change, true otherwize
function inChanges(change) {
  var myChange = myChanges[change.id];
  if (myChange) {
  	for (var i = 0, length = change.changes.length; i < length; i++ ) {
  	  var index = myChange.indexOf(change.changes[i].rev);
  	  console.log('index:', index);
  	  if (index == -1) {
  	    // clean up
  		  delete myChanges[change.id];
  		  // not our chnage
  			return false;
  	  } else {
  	    // clean up
  	    myChange.splice(index, 1);
  		}
		}
		// all change.revisions are ours
		if (myChange.length = 0) { // clean up
		  delete myChanges[change.id];
		}
		return true;
	}
  // not our change
  delete myChanges[change.id];
	return false;
}

/*
 * Handles any incoming real time changes from CouchDB, this will either
 * trigger a full page load if the design doc has changed, or update
 * the current list of tasks if needed
 */
function handleChanges() {

  $changes = app.changes();
  $changes.onChange(function(changes) {

    var doRefresh = false;

    $.each(changes.results, function(_, change) {

      // Full refresh if design doc changes
      doRefresh = doRefresh || /^_design/.test(change.id);

      // Otherwise check for changes that we didnt cause
      var changeIndex = $.inArray(change.id, myChanges);
      if (changeIndex == -1) {
        var index = -1, row;
        for (var i = 0, length = viewModel.children().length; i < length && index == -1; i++) {
          row = viewModel.children()[i];
          if (row._id == change.id) {
            index = i;
          }
        }
        if (change.deleted) {
          viewModel.children.splice(index, 1); // safe if index == -1
          // TODO: if change.id == viewModel.parent._id
        } else {
            if (index != -1)  {
              row.load();
            } else if (change.id == viewModel.children()[0]._id) {
              viewModel.children()[0].load();
            } else {
              app.read(change.id, function(error, doc) {
                if (doc.parent_id == viewModel.children()[0]._id) {
                  // TODO: section/note/update/push
                  viewModel.children.push(observable(doc));
                }
              })
            }
        }
      } else {
        myChanges.splice(changeIndex, 1);
        
      }
    });

    if (doRefresh) {
      document.location.reload();
    }

  });
}

// http://stackoverflow.com/questions/822452/strip-html-from-text-javascript
function stripHtml(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent||tmp.innerText;
}

var run = function() {
    ko.applyBindings(viewModel);
    editor = new TINY.editor.edit('editor',{
      el:$('#lock')[0],
      id:'input', // (required) ID of the textarea
      width:584, // (optional) width of the editor
      height:175, // (optional) heightof the editor
      cssclass:'te', // (optional) CSS class of the editor
      controlclass:'tecontrol', // (optional) CSS class of the buttons
      //rowclass:'teheader', // (optional) CSS class of the button rows
      dividerclass:'tedivider', // (optional) CSS class of the button diviers
      controls:['bold', 'italic', 'underline', 'strikethrough', '|', 'subscript', 'superscript', '|', 'orderedlist', 'unorderedlist', '|' ,'outdent' ,'indent', '|', 'leftalign', 'centeralign', 'rightalign', 'blockjustify', '|', 'unformat', '|', 'undo', 'redo', 'n', 'font', 'size', 'style', '|', 'image', 'hr', 'link', 'unlink', '|', 'cut', 'copy', 'paste', 'print', '|', 'source', 'done', 'delete'], // (required) options you want available, a '|' represents a divider and an 'n' represents a new row
      footer:false, // (optional) show the footer
      fonts:['Verdana','Arial','Georgia','Trebuchet MS'],  // (optional) array of fonts to display
      xhtml:true, // (optional) generate XHTML vs HTML
      cssfile:'style.css', // (optional) attach an external CSS file to the editor
      content:'starting content', // (optional) set the starting content else it will default to the textarea content
      css:'body{background-color:#ccc}', // (optional) attach CSS to the editor
      bodyid:'editor', // (optional) attach an ID to the editor body
      footerclass:'tefooter', // (optional) CSS class of the footer
      toggle:{text:'source',activetext:'wysiwyg',cssclass:'toggle'}, // (optional) toggle to markup view options
      resize:{cssclass:'resize'}, // (optional) display options for the editor resize
      done: function() {element.blur()}
    });
    $('footer').show();
    handleChanges();
    $(window).hashchange(load);
    load()
}

function setTitle(doc) {
  document.title = stripHtml(doc.name());
  doc.name.subscribe(function(newValue) {
    document.title = stripHtml(newValue);
  });
}

var load = function() {
    var parent_id = window.location.hash.substring(2) || 'root'; // strip '#/'
    if (viewModel.children().length == 0 || viewModel.children()[0]._id != parent_id) {
        viewModel.reset();
        app.view('note', {startkey: [parent_id], endkey: [parent_id, 9007199254740992], include_docs: true}, function(error, data) {
            if (!error && data.rows.length > 0) {
                $('div#not-found').hide();
                // TODO: assert first item is note
                viewModel.children.pushAll(observableArray(data, observable));
                setTitle(viewModel.children()[0]);
            } else {
                viewModel.root.set({_id: parent_id, name: 'Untitled', type: 'note', order: 0});
                if (parent_id != 'root') {
                  viewModel.root.parent_id = 'root';
                }
                $('div#not-found').show();
            }
        });
        app.view('childnotes', {key: parent_id}, function(error, data) {
            if (!error && data.rows.length > 0) {
                var array = [];
                $(data.rows).each(function(i, row) {
                    array.push({_id: row.id, name: row.value})      
                })  
                viewModel.notes.pushAll(array);
            }
        })
    }
}

$(run)
