function showBottomPanel()
{
  $('#showBottomPanel').animate({'bottom':'-48'}, 500, function(){
         $('#bottomPanel').animate({'bottom':'0'}, 500);
         $.cookie('bottomPanelHide', null);
  })    
}

// see also home.tpl for initial panel showing

$(function (){ 

    $('#showBottomPanel').live('click', function(){
            showBottomPanel();
    })

	$('#closeBottomPanel').live('click', function(){
	   $('#bottomPanel').animate({'bottom':'-90'}, 500, function(){
           $('#showBottomPanel').animate({'bottom':'0'})
           $.cookie('bottomPanelHide', 1);
	   })
	});
});