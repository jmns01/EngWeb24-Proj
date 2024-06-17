export function retrieve_user_data(cookie_user_data){
    // Default user data
    var user = {
        id: 0,
        name: '',
        username: '',
        level: 'Não autenticado',
        is_logged: false
    }

    if(cookie_user_data){
        user.id = cookie_user_data.id
        user.name = cookie_user_data.name
        user.level = cookie_user_data.level
        user.username = cookie_user_data.username
        user.is_logged = true
    }

    return user
}