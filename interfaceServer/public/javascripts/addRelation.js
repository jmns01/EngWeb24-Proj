$(function() {
    //document.getElementById('addRelation').addEventListener('click', openAddrelationModal);
});

var axios = require('axios');


function openAddrelationModal(inquiricaoId) {
    var displayRelation = $('<div id="displayRelation"></div>');
    var idtextbox = $('<input type="text" id="idtextbox" placeholder="ID" />');
    var submitButton = $('<button id="submit">Aplicar</button>');
    var datepicker = $('<input type="text" id="datepicker" placeholder="Ano-Mês-Dia" style="display: none;" />');


    submitButton.on('click', function() {
        var id = idtextbox.val();
        console.log(`ID: ${id}`);
        if (id) {
            axios.get("http://localhost:7777/isIdValid/" + id)
            .then(response => {
                if(response.data.success){
                    axios.post("http://localhost:7777/addRelation/" + id + "/" + inquiricaoId)
                    .then(response => {
                        console.log(response.data);
                        window.location.href = "http://localhost:8888/editInquiricao/" + inquiricaoId;
                    })
                    .catch(error => {
                        console.log('Axios request failed: ', error);
                    });
                } else {
                    alert("ID inválido.");
                }
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
