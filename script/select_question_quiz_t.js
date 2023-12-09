// seleziona tipo di domanda
$(document).ready(function() {
    $(document).on('change', '.questiontype', function() {

        var tiposelezionato = $(this).val();
        var section = $(this).parent().parent().parent()

        if(tiposelezionato == 'radioquestion') {
            section.children('#saq').css("display", "block");
            section.children('#maq').css("display", "none");
            section.children('#oq').css("display", "none");
        }
        else if(tiposelezionato == 'checkboxquestion') {
            section.children('#saq').css("display", "none");
            section.children('#maq').css("display", "block");
            section.children('#oq').css("display", "none");
        }
        else if(tiposelezionato == 'rispaperta') {
            section.children('#saq').css("display", "none");
            section.children('#maq').css("display", "none");
            section.children('#oq').css("display", "block");
        }

    });
});

// mette tante opzioni radio quanto è il numero selezionato
$(document).ready(function() {
    $(document).on('change', '.nanswerssaq', function() {
        var numerosaq = $(this).val();
        var section = $(this).parent().parent().parent();
        var numdomanda = section.prop("id").charAt(1);
        var vanswers = section.children('#saq').children('.vanswers');

        if (vanswers.children().length > 0){
            vanswers.empty();

            var table = document.createElement('table');
            var tr = document.createElement('tr');
            var td1 = document.createElement('td');
            var td2 = document.createElement('td');
            var td3 = document.createElement('td');
            var p = document.createElement('p');
            p.innerHTML='Correct answer';
            td2.appendChild(p);
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            table.appendChild(tr);

            for (var i = 0; i < numerosaq; i++){
                var tr = document.createElement('tr');

                var td1 = document.createElement('td');
                var td2 = document.createElement('td');
                var td3 = document.createElement('td');

                var inputanswer = document.createElement('input');
                inputanswer.type = "text";
                inputanswer.className = "textarea";
                inputanswer.placeholder = "Enter the " + (i+1) + getOrdinal(i+1) + " answer";
                inputanswer.name = "answer";
                inputanswer.id = "answer"+(i+1);
                inputanswer.required = true;

                var inputradio = document.createElement('input');
                inputradio.type = "radio";
                inputradio.id = "check"+(i+1);
                inputradio.className = "radioscelte";
                inputradio.name = "answergroup"+numdomanda;

                var inputwrong = document.createElement('input');
                inputwrong.type = "text";
                inputwrong.className = "textarea";
                inputwrong.placeholder = "This answer is wrong because...";
                inputwrong.name = "explain";
                inputwrong.id = "explain"+(i+1);
                inputwrong.required = true;

                td1.appendChild(inputanswer);
                td2.appendChild(inputradio);
                td3.appendChild(inputwrong);

                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);

                table.appendChild(tr);
            }

            vanswers.append(table);
        }
        else{
            var table = document.createElement('table');
            var tr = document.createElement('tr');
            var td1 = document.createElement('td');
            var td2 = document.createElement('td');
            var td3 = document.createElement('td');
            var p = document.createElement('p');
            p.innerHTML='Correct answer';
            td2.appendChild(p);
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            table.appendChild(tr);

            for (var i = 0; i < numerosaq; i++){
                var tr = document.createElement('tr');

                var td1 = document.createElement('td');
                var td2 = document.createElement('td');
                var td3 = document.createElement('td');

                var inputanswer = document.createElement('input');
                inputanswer.type = "text";
                inputanswer.className = "textarea";
                inputanswer.placeholder = "Enter the " + (i+1) + getOrdinal(i+1) + " answer";
                inputanswer.name = "answer";
                inputanswer.id = "answer"+(i+1);
                inputanswer.required = true;

                var inputradio = document.createElement('input');
                inputradio.type = "radio";
                inputradio.id = "check"+(i+1);
                inputradio.className = "radioscelte";
                inputradio.name = "answergroup"+numdomanda;

                var inputwrong = document.createElement('input');
                inputwrong.type = "text";
                inputwrong.className = "textarea";
                inputwrong.placeholder = "This answer is wrong because...";
                inputwrong.name = "explain";
                inputwrong.id = "explain"+(i+1);
                inputwrong.required = true;

                td1.appendChild(inputanswer);
                td2.appendChild(inputradio);
                td3.appendChild(inputwrong);

                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);

                table.appendChild(tr);
            }

            vanswers.append(table);
        }
    });
});


// mette tante opzioni check quanto è il numero selezionato
$(document).ready(function() {
    $(document).on('change', '.nanswersmaq', function() {
        var numeromaq = $(this).val();
        var section = $(this).parent().parent().parent();
        var numdomanda = section.prop("id").charAt(1);
        var vanswers = section.children('#maq').children('.vanswers');

        if (vanswers.children().length > 0){
            vanswers.empty();

            var table = document.createElement('table');
            var tr = document.createElement('tr');
            var td1 = document.createElement('td');
            var td2 = document.createElement('td');
            var td3 = document.createElement('td');
            var p = document.createElement('p');
            p.innerHTML='Correct answer';
            td2.appendChild(p);
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            table.appendChild(tr);

            for (var i = 0; i < numeromaq; i++){
                var tr = document.createElement('tr');

                var td1 = document.createElement('td');
                var td2 = document.createElement('td');
                var td3 = document.createElement('td');

                var inputanswer = document.createElement('input');
                inputanswer.type = "text";
                inputanswer.className = "textarea";
                inputanswer.placeholder = "Enter the " + (i+1) + getOrdinal(i+1) + " answer";
                inputanswer.name = "answer";
                inputanswer.id = "answer"+(i+1);
                inputanswer.required = true;

                var inputcheck = document.createElement('input');
                inputcheck.type = "checkbox";
                inputcheck.id = "check"+(i+1);
                inputcheck.className = "checkscelte";
                inputcheck.name = "answergroup"+numdomanda;


                var inputwrong = document.createElement('input');
                inputwrong.type = "text";
                inputwrong.className = "textarea";
                inputwrong.placeholder = "This answer is wrong because...";
                inputwrong.name = "explain";
                inputwrong.id = "explain"+(i+1);
                inputwrong.required = true;

                td1.appendChild(inputanswer);
                td2.appendChild(inputcheck);
                td3.appendChild(inputwrong);

                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);

                table.appendChild(tr);
            }

            vanswers.append(table);

        }
        else{
            var table = document.createElement('table');
            var tr = document.createElement('tr');
            var td1 = document.createElement('td');
            var td2 = document.createElement('td');
            var td3 = document.createElement('td');
            var p = document.createElement('p');
            p.innerHTML='Correct answer';
            td2.appendChild(p);
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            table.appendChild(tr);

            for (var i = 0; i < numeromaq; i++){
                var tr = document.createElement('tr');

                var td1 = document.createElement('td');
                var td2 = document.createElement('td');
                var td3 = document.createElement('td');

                var inputanswer = document.createElement('input');
                inputanswer.type = "text";
                inputanswer.className = "textarea";
                inputanswer.placeholder = "Enter the " + (i+1) + getOrdinal(i+1) + " answer";
                inputanswer.name = "answer";
                inputanswer.id = "answer"+(i+1);
                inputanswer.required = true;

                var inputcheck = document.createElement('input');
                inputcheck.type = "checkbox";
                inputcheck.id = "check"+(i+1);
                inputcheck.className = "checkscelte";
                inputcheck.name = "answergroup"+numdomanda;

                var inputwrong = document.createElement('input');
                inputwrong.type = "text";
                inputwrong.className = "textarea";
                inputwrong.placeholder = "This answer is wrong because...";
                inputwrong.name = "explain";
                inputwrong.id = "explain"+(i+1);
                inputwrong.required = true;

                td1.appendChild(inputanswer);
                td2.appendChild(inputcheck);
                td3.appendChild(inputwrong);

                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);

                table.appendChild(tr);
            }

            vanswers.append(table);
        }

    });
});

// aggiunge pedice per la stampa dei numeri ordinali
function getOrdinal(n) {
    let ord = 'th';

    if (n % 10 == 1 && n % 100 != 11)
    {
      ord = 'st';
    }
    else if (n % 10 == 2 && n % 100 != 12)
    {
      ord = 'nd';
    }
    else if (n % 10 == 3 && n % 100 != 13)
    {
      ord = 'rd';
    }

    return ord;
}

// aggiunge una nuova domanda
$(document).ready(function() {
    $("#addQuestion").on('click', function() {
        var sections = document.querySelectorAll("section[id^='d']");

        if (sections.length == "0") {
            var section = document.createElement('section');
            section.id = "d1"

            var h2 = document.createElement('h2');
            h2.innerHTML = "Question 1"

            var frst = document.createElement("div");
            frst.className = "first2";

            var wrp1 = document.createElement("div");
            wrp1.className = "wrapper";
            wrp1.setAttribute('id','wrapper1');
            var wrp2 = document.createElement("div");
            wrp2.className = "wrapper";
            wrp2.setAttribute('id','wrapper2');
            var wrp3 = document.createElement("div");
            wrp3.className = "wrapper";
            var wrp4 = document.createElement("div");
            wrp4.className = "wrapper";

            var p1 = document.createElement("p");
            p1.innerHTML = "Question:"
            var p2 = document.createElement("p");
            p2.innerHTML = "Question type:"
            var p3 = document.createElement("p");
            p3.innerHTML = "Number of answers:";
            var p4 = document.createElement("p");
            p4.innerHTML = "Number of answers:";

            var input1 = document.createElement("input");
            input1.type = "text";
            input1.className = "textarea";
            input1.placeholder = "Enter the question";
            input1.name = "question";
            input1.id = "question";
            input1.required = true;

            var input2 = document.createElement("input");
            input2.type = "text";
            input2.className = "textarea";
            input2.placeholder = "Enter the correct answer and its explanation";
            input2.name = "explainopen";
            input2.id = "explain1";
            input2.required = true;

            var answ1 = document.createElement("div");
            answ1.className = "answers";
            answ1.id = "saq";
            var answ2 = document.createElement("div");
            answ2.className = "answers";
            answ2.id = "maq";
            var answ3 = document.createElement("div");
            answ3.className = "answers";
            answ3.id = "oq";
            var vansw1 = document.createElement("div");
            vansw1.className = "vanswers";
            var vansw2 = document.createElement("div");
            vansw2.className = "vanswers";
            var explainopn = document.createElement("div");
            explainopn.className = "explainopen";

            var select1 = document.createElement("select");
            select1.name = "questiontype";
            select1.id = "questiontype";
            select1.className = "questiontype";
            select1.required = true;

            var select2 = document.createElement("select");
            select2.name = "nanswers";
            select2.id = "nanswerssaq";
            select2.className = "nanswerssaq";
            select2.required = true;

            var select3 = document.createElement("select");
            select3.name = "nanswers";
            select3.id = "nanswersmaq";
            select3.className = "nanswersmaq";
            select3.required = true;
            select3.op

            for (var i = 0; i<=10; i++){
                var opt = document.createElement("option");
                if (i == 0) {
                    opt.value = i;
                    opt.disabled = true;
                    opt.selected = true;
                    opt.innerHTML = i;
                    select2.appendChild(opt);
                } else {
                    opt.value = i;
                    opt.innerHTML = i;
                    select2.appendChild(opt);
                }
            }

            for (var i = 0; i<=10; i++){
                var opt = document.createElement("option");
                if (i == 0) {
                    opt.value = i;
                    opt.disabled = true;
                    opt.selected = true;
                    opt.innerHTML = i;
                    select3.appendChild(opt);
                } else {
                    opt.value = i;
                    opt.innerHTML = i;
                    select3.appendChild(opt);
                }
            }

            for (var i = 0; i<=3; i++){
                var opt = document.createElement("option");
                if (i == 0) {
                    opt.value = "introquestiontype";
                    opt.disabled = true;
                    opt.selected = true;
                    opt.innerHTML = "Select question type";
                    select1.appendChild(opt);
                } else if (i == 1) {
                    opt.value = "radioquestion";
                    opt.innerHTML = "Single answer question";
                    select1.appendChild(opt);
                } else if (i == 2) {
                    opt.value = "checkboxquestion";
                    opt.innerHTML = "Multiple answers question";
                    select1.appendChild(opt);
                } else {
                    opt.value = "rispaperta";
                    opt.innerHTML = "Open-ended question";
                    select1.appendChild(opt);
                }
            }

            wrp1.appendChild(p1);
            wrp1.appendChild(input1);
            wrp2.appendChild(p2);
            wrp2.appendChild(select1);
            frst.appendChild(wrp1);
            frst.appendChild(wrp2);

            wrp3.appendChild(p3);
            wrp3.appendChild(select2);
            answ1.appendChild(wrp3);
            answ1.appendChild(vansw1);

            wrp4.appendChild(p4);
            wrp4.appendChild(select3);
            answ2.appendChild(wrp4);
            answ2.appendChild(vansw2);

            explainopn.appendChild(input2);
            answ3.appendChild(explainopn);

            section.appendChild(h2);
            section.appendChild(frst);
            section.appendChild(answ1);
            section.appendChild(answ2);
            section.appendChild(answ3);

            var add_btn = document.getElementById("addQuestion")
            var par_e = add_btn.parentNode
            par_e.before(section);
        }
        else {
            var last_section_num = sections[sections.length - 1].id.charAt(1);
            var new_num = Number(last_section_num) + 1

            var section = document.createElement('section');
            section.id = "d"+new_num

            var h2 = document.createElement('h2');
            h2.innerHTML = "Question "+new_num

            var rmvdiv = document.createElement("div");
            rmvdiv.className = "button-container";
            var rmvbtn = document.createElement("button");
            rmvbtn.className = "removeQuestion";
            rmvbtn.id = "removeQuestion";
            var i_rmv = document.createElement("i");
            i_rmv.className = "uil uil-minus-circle";
            i_rmv.innerHTML = " Remove Question";

            var frst = document.createElement("div");
            frst.className = "first2";

            var wrp1 = document.createElement("div");
            wrp1.className = "wrapper";
            wrp1.setAttribute('id', 'wrapper1');
            var wrp2 = document.createElement("div");
            wrp2.className = "wrapper";
            wrp2.setAttribute('id', 'wrapper2');
            var wrp3 = document.createElement("div");
            wrp3.className = "wrapper";
            var wrp4 = document.createElement("div");
            wrp4.className = "wrapper";

            var p1 = document.createElement("p");
            p1.innerHTML = "Question:"
            var p2 = document.createElement("p");
            p2.innerHTML = "Question type:"
            var p3 = document.createElement("p");
            p3.innerHTML = "Number of answers:";
            var p4 = document.createElement("p");
            p4.innerHTML = "Number of answers:";

            var input1 = document.createElement("input");
            input1.type = "text";
            input1.className = "textarea";
            input1.placeholder = "Enter the question";
            input1.name = "question";
            input1.id = "question";
            input1.required = true;

            var input2 = document.createElement("input");
            input2.type = "text";
            input2.className = "textarea";
            input2.placeholder = "Enter the correct answer and its explanation";
            input2.name = "explainopen";
            input2.id = "explain1";
            input2.required = true;

            var answ1 = document.createElement("div");
            answ1.className = "answers";
            answ1.id = "saq";
            var answ2 = document.createElement("div");
            answ2.className = "answers";
            answ2.id = "maq";
            var answ3 = document.createElement("div");
            answ3.className = "answers";
            answ3.id = "oq";
            var vansw1 = document.createElement("div");
            vansw1.className = "vanswers";
            var vansw2 = document.createElement("div");
            vansw2.className = "vanswers";
            var explainopn = document.createElement("div");
            explainopn.className = "explainopen";

            var select1 = document.createElement("select");
            select1.name = "questiontype";
            select1.id = "questiontype";
            select1.className = "questiontype";
            select1.required = true;

            var select2 = document.createElement("select");
            select2.name = "nanswers";
            select2.id = "nanswerssaq";
            select2.className = "nanswerssaq";
            select2.required = true;

            var select3 = document.createElement("select");
            select3.name = "nanswers";
            select3.id = "nanswersmaq";
            select3.className = "nanswersmaq";
            select3.required = true;
            select3.op

            for (var i = 0; i<=10; i++){
                var opt = document.createElement("option");
                if (i == 0) {
                    opt.value = i;
                    opt.disabled = true;
                    opt.selected = true;
                    opt.innerHTML = i;
                    select2.appendChild(opt);
                } else {
                    opt.value = i;
                    opt.innerHTML = i;
                    select2.appendChild(opt);
                }
            }

            for (var i = 0; i<=10; i++){
                var opt = document.createElement("option");
                if (i == 0) {
                    opt.value = i;
                    opt.disabled = true;
                    opt.selected = true;
                    opt.innerHTML = i;
                    select3.appendChild(opt);
                } else {
                    opt.value = i;
                    opt.innerHTML = i;
                    select3.appendChild(opt);
                }
            }

            for (var i = 0; i<=3; i++){
                var opt = document.createElement("option");
                if (i == 0) {
                    opt.value = "introquestiontype";
                    opt.disabled = true;
                    opt.selected = true;
                    opt.innerHTML = "Select question type";
                    select1.appendChild(opt);
                } else if (i == 1) {
                    opt.value = "radioquestion";
                    opt.innerHTML = "Single answer question";
                    select1.appendChild(opt);
                } else if (i == 2) {
                    opt.value = "checkboxquestion";
                    opt.innerHTML = "Multiple answers question";
                    select1.appendChild(opt);
                } else {
                    opt.value = "rispaperta";
                    opt.innerHTML = "Open-ended question";
                    select1.appendChild(opt);
                }
            }

            rmvbtn.appendChild(i_rmv);
            rmvdiv.appendChild(rmvbtn);

            wrp1.appendChild(p1);
            wrp1.appendChild(input1);
            wrp2.appendChild(p2);
            wrp2.appendChild(select1);
            frst.appendChild(wrp1);
            frst.appendChild(wrp2);

            wrp3.appendChild(p3);
            wrp3.appendChild(select2);
            answ1.appendChild(wrp3);
            answ1.appendChild(vansw1);

            wrp4.appendChild(p4);
            wrp4.appendChild(select3);
            answ2.appendChild(wrp4);
            answ2.appendChild(vansw2);

            explainopn.appendChild(input2);
            answ3.appendChild(explainopn);

            section.appendChild(h2);
            section.appendChild(rmvdiv)
            section.appendChild(frst);
            section.appendChild(answ1);
            section.appendChild(answ2);
            section.appendChild(answ3);

            var prev_qst = sections[sections.length - 1];
            prev_qst.after(section);
        }
    });
});

// rimuove una domanda
$(document).ready(function() {
    $(document).on('click', '#removeQuestion', function() {
        var qst = $(this).parent().parent(); // domanda che si intende rimuovere
        var qstAll = $(this).parent().parent().parent().children(); // lista di tutti gli elementi contenuti nella classe "newquestions" (domande + pulsanti)
        var lastQst = qstAll[qstAll.length - 2]; // ultima domanda

        if (qst.prop('id') == lastQst.id) { // se la domanda che si intende rimuovere è proprio l'ultima domanda
            qst.remove();
        } else { // altrimenti, se la domanda che si intende rimuovere non è l'ultima
            for (var i = 0; i<=qstAll.length - 2; i++){ // loop che recupera l'indice della domanda che si intende rimuovere
                if (qstAll[i].id == qst.prop('id')) {
                    var index_qst = i;
                }
            }
            for (var i = index_qst; i<=qstAll.length - 2; i++) { // loop che itera su tutte le domande
                if (i == index_qst) { // se la domanda selezionata è quella che si intende rimuovere, viene rimossa
                    qst.remove();
                } else { // per tutte le domande che seguono quella appena rimossa, si aggiorna l'id relativo decrementandolo
                    qstAll[i].id = "d"+i;
                    qstAll[i].children[0].innerHTML = "Question "+i
                }
            }
        }
    });
});

// controllo checkbox per risposta corretta
$(document).ready(function() {
    $(document).on('click', '.checkscelte', function() {
        var t = $(this).parent().parent().children();
        if ($(this).is(':checked')) {
            t[t.length - 1].children[0].style = "display : none";
            t[t.length - 1].children[0].value = "";
        } else {
            t[t.length - 1].children[0].style = "display : block";
        }
    });
});

// controllo radio button per risposta corretta
$(document).ready(function() {
    $(document).on('click', '.radioscelte', function() {
        var real_id = $(this).prop('id'); // id del radio selezionato
        var tab = $(this).parent().parent().parent().children(); // tabella contenente l'elenco degli elementi tr (righe contenenti: risposta, radio e spiegazione)

        for (var i = 1; i<=tab.length - 1; i++){ // loop che itera per tutte le righe della tabella esclusa la prima che funge da "titolo" (Correct answer)
            var chk = tab[i].children[1].children[0]; // selezione del radio button per ogni riga
            var txt = tab[i].children[2].children[0]; // selezione del'area testuale della risposta per ogni riga
            if (chk.id != real_id) { // se l'id del radio button corrente non corrisponde a quello del radio attualmente selezionato
                txt.style = "display : block"; // l'area testuale della risposta viene mostrata
            } else { // altrimenti:
                txt.value = "";
                txt.style = "display : none"; // l'area testuale della risposta viene nascosta
            }
        }
    });
});