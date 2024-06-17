var retrieve_user_data = require("./retrieve_data.js");
var axios = require('axios')

// Usar em casos que só admin tem permissão.
module.exports.is_admin = function (req, res, next){

    // Não está autenticado
    if(!req.cookies.cookie_user_data) return res.redirect('/auth/login')

    const user = retrieve_user_data(req.cookies.cookie_user_data)

    if(user.level != 'Administrador') return res.status(500).render('error', {message: 'User is not Administrador'})

    axios.defaults.headers.common['Authorization'] = req.cookies.cookie_user_data.token

    next();
}

// Usar quando é preciso estar autenticado.
module.exports.is_admin = function (req, res, next){
    // Não está autenticado
    if(!req.cookies.cookie_user_data) return res.redirect('/auth/login')

    axios.defaults.headers.common['Authorization'] = req.cookies.cookie_user_data.token

    next();
}