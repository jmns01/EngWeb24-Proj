import { retrieve_user_data } from "./retrieve_data.js";

// Usar em casos que só admin tem permissão.
export function is_admin(req, res, next){

    // Não está autenticado
    if(!req.cookies.cookie_user_data) return res.redirect('/auth/login')

    const user = retrieve_user_data(req.cookies.cookie_user_data)

    if(user.level != 'Administrador') return res.status(500).render('error', {message: 'User is not Administrador'})

    next();
}

// Usar quando é preciso estar autenticado.
export function is_logged(req, res, next){
    // Não está autenticado
    if(!req.cookies.cookie_user_data) return res.redirect('/auth/login')

    next();
}