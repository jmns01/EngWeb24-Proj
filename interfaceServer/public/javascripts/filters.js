function showImage() {

    var dropdown = $('<select id="dropdown"><option value="fNome">Filtrar por nome</option><option value="fData">Filtrar por data</option><option value="fLocal">Filtrar por localidade</option></select>');
    var textbox = $('<input type="text" id="textbox" style="display: none;" />');
    var datepicker = $('<input type="text" id="datepicker" style="display: none;" />');
    var submitButton = $('<button id="submit">Submit</button>');
    submitButton.on('click', function() {
        // Perform action when submit button is clicked
    });
    $("#display").append(submitButton);
    $("#display").empty();
    $("#display").append(dropdown, textbox, datepicker, submitButton);
    $("#display").modal();

    dropdown.on('change', function() {
        var selectedOption = $(this).val();
        
        if (selectedOption === 'fNome' || selectedOption === 'fLocal') {
            textbox.show();
            
        } else if (selectedOption === 'fData'){
            datepicker.show();
            datepicker.datepicker();
            datepicker.on('change', function() {
                var selectedDate = $(this).val();
                // Perform filtering based on selected date
            });
        }
    });
}