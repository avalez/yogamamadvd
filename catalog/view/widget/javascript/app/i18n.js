(function($) {

  var i18nMessages = {};

  // excerpt from play 1.2.x framework/templates/tags/i18n.tag
  i18n = function(code) {
      var message = i18nMessages && i18nMessages[code] || code;
      // Encode %% to handle it later
      message = message.replace(/%%/g, "\0%\0");
      if (arguments.length > 1) {
          // Explicit ordered parameters
          for (var i=1; i<arguments.length; i++) {
              var r = new RegExp("%" + i + "\\$\\w", "g");
              message = message.replace(r, arguments[i]);
          }
          // Standard ordered parameters
          for (var i=1; i<arguments.length; i++) {
              message = message.replace(/%s/, arguments[i]);
          }
      }
      // Decode encoded %% to single %
      message = message.replace("\0%\0", "%");
      // Imbricated messages
      var imbricated = message.match(/&\{.*?\}/g);
      if (imbricated) {
          for (var i=0; i<imbricated.length; i++) {
              var imbricated_code = imbricated[i].substring(2, imbricated[i].length-1).replace(/^\s*(.*?)\s*$/, "$1");
              message = message.replace(imbricated[i], i18nMessages[imbricated_code] || "");
          }
      }
      return message;
  };

  // TODO: for browser language   
  i18nLoad = function(callback) {
    $.ajax(messagesUrl('russian'), {
      success: function(data) {
        // excerpt form jquery-i18n-properties plugin
        var parameters = data.split( /\n/ );
        for(var i=0; i<parameters.length; i++ ) {
          parameters[i] = parameters[i].replace( /^\s\s*/, '' ).replace( /\s\s*$/, '' ); // trim
          if(parameters[i].length > 0 && parameters[i].match("^#")!="#") { // skip comments
            var pair = parameters[i].split('=');
            if(pair.length > 0) {
              /** Process key & value */
              var name = unescape(pair[0]).replace( /^\s\s*/, '' ).replace( /\s\s*$/, '' ); // trim
              var value = pair.length == 1 ? "" : pair[1];
              // process multi-line values
              while(value.match(/\\$/)=="\\") {
                value = value.substring(0, value.length - 1);
                value += parameters[++i].replace( /\s\s*$/, '' ); // right trim
              }
              // Put values with embedded '='s back together
              for(var s=2;s<pair.length;s++){ value +='=' + pair[s]; }
              value = value.replace( /^\s\s*/, '' ).replace( /\s\s*$/, '' ); // trim
              i18nMessages[name] = value;
            } // END: if(pair.length > 0)
          } // END: skip comments
        }
      },
      complete: callback
    })
  }

})(jQuery);
