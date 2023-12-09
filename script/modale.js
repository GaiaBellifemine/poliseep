const toggleModal = () => {
    const {classList} = document.body;
    if(classList.contains("open")){
        classList.remove("open");
        classList.add("closed");
    }
    else{
        classList.remove("closed");
        classList.add("open");
    }
}

const toggleModal1 = () => {
    const {classList} = document.body;
    if(classList.contains("open1")){
        classList.remove("open1");
        classList.add("closed1");
    }
    else{
        classList.remove("closed1");
        classList.add("open1");
    }
}

function cbChange(obj) {
    var cbs = document.getElementsByClassName("cb");
    for (var i = 0; i < cbs.length; i++) {
        cbs[i].checked = false;
    }
    obj.checked = true;
}


// Sezione dedicata alla selezione di tutti gli elementi della lista pending requests
const selectAll = document.querySelector('.form-group.select-all input');
$(selectAll).click(function(){
    $('div#liststu input:checkbox').not(this).prop('checked', this.checked);
});
