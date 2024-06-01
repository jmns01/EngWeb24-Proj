$(function(){
    document.getElementById('advancedSearch').addEventListener('click', openFilterModal);
});


function openFilterModal() {
    var display = $('<div id="display"></div>');
    var dropdown = $('<select id="dropdown"><option value="fNome">Filtrar por nome</option><option value="fData">Filtrar por data</option><option value="fLocal">Filtrar por localidade</option></select>');
    var nametextbox = $('<input type="text" id="nametextbox" placeholder="Inquirição de genere de..." />');
    var localtextbox = $('<input type="text" id="localtextbox" placeholder="PT" style="display: none;" />');
    var datepicker = $('<input type="text" id="datepicker" placeholder="Ano-Mês-Dia" style="display: none;" />');
    var submitButton = $('<button id="submit">Aplicar</button>');

    dropdown.on('change', function() {
        var selectedOption = $(this).val();

        if (selectedOption === 'fNome') {
            localtextbox.hide();
            datepicker.hide();
            nametextbox.show();
        } else if(selectedOption === 'fLocal'){
            nametextbox.hide();
            datepicker.hide();
            localtextbox.show();
        }else if (selectedOption === 'fData'){
            localtextbox.hide();
            nametextbox.hide();
            datepicker.show();
        }
    });

    submitButton.on('click', function() {
        var selectedOption = dropdown.val();
        var name = nametextbox.val();
        var local = localtextbox.val();
        var dateValue = datepicker.val();

        if (selectedOption && (local || dateValue || name)) {
            if(selectedOption === 'fData') {
                // Redirect the user to a different page
                window.location.href = "http://localhost:8888/getInquiricoesList?filter=" + selectedOption + "&date=" + dateValue;
            }
            else if(selectedOption === 'fNome') {
                // Redirect the user to a different page
                window.location.href = "http://localhost:8888/getInquiricoesList?filter=" + selectedOption + "&name=" + name;
            }
            else if(selectedOption === 'fLocal') {
                // Redirect the user to a different page
                window.location.href = "http://localhost:8888/getInquiricoesList?filter=" + selectedOption + "&local=" + local;
            }
        }
    });
    /*
    $("#display").empty();
    $("#display").append(dropdown, textbox, datepicker, submitButton);
    $("#display").modal('show');*/
    display.append(dropdown, nametextbox, localtextbox, datepicker, submitButton);
    $("body").append(display);
    display.modal('show');
}