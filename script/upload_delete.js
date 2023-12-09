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


    $(document).on('click', '.btn_get_val', function(event) 
    {
        event.preventDefault();

        var ele = $(document).find('.item_id'); 

        var v1 = get_all_checked_val(ele, 'option_id');

        var v2 = ''
        +'<pre class="bg-secondary">' 
        +JSON.stringify(v1, null, 5)
        +'</pre>';

        $(document).find('.post_msg').html(v2);

    });		
    //--->get selected rows values > end

    //--->delete files
    function DeleteAll(){

        var answer = confirm("Do you really want to delete these selected files?")
    
        if (answer != 0) { 
    
            for(var i=0; i<3; i++){
    
                if( (document.form1.filecheck(i).checked == true) && (document.form1.filepath(i).value != "") ){
    
                    var fso = new ActiveXObject( "Scripting.FileSystemObject" );
    
                    fso.DeleteFile(document.form1.filepath(i).value, true);
                }
            }
        } 
    }
    
    //--->upload button
    function upload_btn() {
        document.getElementById('buttonid').addEventListener('click', openDialog);
        function openDialog() {
            document.getElementById('fileid').click();
        }
        document.getElementById('fileid').addEventListener('change', submitForm);
        function submitForm() {
            document.getElementById('formid').submit();
        }
    }

    const actualBtn = document.getElementById('actual-btn');

    const fileChosen = document.getElementById('file-chosen');

    actualBtn.addEventListener('change', function(){
        fileChosen.textContent = this.files[0].name
    })  

    actualBtn.addEventListener("click", function() {
        document.getElementById("uploadFile").click();
    })
});