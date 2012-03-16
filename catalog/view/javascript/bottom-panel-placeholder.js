$(function (){ 
	if($.browser.msie && $.browser.version < 10)
    {
        $.each($('.placeholder'), function(){
            var defaultValue = $(this).attr('placeholder');
            $(this).val(defaultValue); 
            $(this).focusin(function(){
    		    if (this.value == defaultValue){ 
    		    	this.value = '';
				}
				if(this.value != defaultValue){
	    			this.select();
	    		}                
            })
            $(this).focusout(function(){
    		    if ($.trim(this.value) == ''){
			    	this.value = (defaultValue ? defaultValue : '');
				}                
            });
        });
    }
    
});