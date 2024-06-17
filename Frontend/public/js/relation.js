$(function() {
    //document.getElementById('addRelation').addEventListener('click', openAddrelationModal);
});

import axios from 'axios';

function openAddrelationModal(inquiricaoId) {
    var displayRelation = $('<div id="displayRelation"></div>');
    var idtextbox = $('<input type="text" id="idtextbox" placeholder="ID" />');
    var submitButton = $('<button id="submit">Aplicar</button>');
    var datepicker = $('<input type="text" id="datepicker" placeholder="Ano-Mês-Dia" style="display: none;" />');


    submitButton.on('click', function() {
        var id = idtextbox.val();
        if (id) {
            axios.post("http://localhost:7777/inquiries/" + inquiricaoId + "/relations/" + id)
            .then(response => {
                console.log(response.data);
                window.location.href = "http://localhost:8888/inquiries/" + inquiricaoId + "/edit";
            })
            .catch(error => {
                console.log('Axios request failed: ', error);
            });
        }
    });

    displayRelation.append(idtextbox, submitButton, datepicker);
    $("body").append(displayRelation);
    displayRelation.modal('show');
}