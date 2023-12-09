$(document).ready(function($) 
{

	//--->select/unselect all > start
	 function select_unselect_checkbox (this_el, select_el) 
	 {

		if(this_el.prop("checked"))
		{
			select_el.prop('checked', true);
		}
		else
		{ 
			select_el.prop('checked', false);				 
		}
	 };

	$(document).on('change', '.select_all_items', function(event) 
	{
		event.preventDefault();

		var ele = $(document).find('.item_id'); 

		select_unselect_checkbox($(this), ele); 
	});
	//--->select/unselect all > end

	//--->download function
	function downloadChecked( )
	{
		for( i = 0 ; i < document.downloadform.elements.length ; i++ )
		{
		foo = document.downloadform.elements[ i ] ;
		if( foo.type == "checkbox" && foo.checked == true )
		{
			document.location.href='somefile.do?command=download&fileid=' + foo.name ;
		}
		}
	}

});