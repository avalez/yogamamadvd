$(function() {

  $('a').live('click.history-yogamamadvd', function(e) {
    // TODO: pushstate!
    e.preventDefault();
    var $url = this.toString() + '?partial';
    $.ajax({url:$url, type: 'get',
      success: function(html) {
        $('div#content').html(html);
      },
      error: function(jqXHR, textStatus) {
        $('div.checkout-warning').show().delay(3000).fadeOut('slow');            
      }
    })
    return false;
  });

  $('form').live('submit.yogamamadvd', function(e) {
    e.preventDefault();
    var $url = this.action + '?partial'; // DOES NOT WORK, redirects!
    $.ajax({url:$url, type: 'post', data: {email: 'test', password: 'test'},
      success: function(html) {
        $('div#content').html(html);
      },
      error: function(jqXHR, textStatus) {
        $('div.checkout-warning').show().delay(3000).fadeOut('slow');            
      }
    });
    return false;
  });

});