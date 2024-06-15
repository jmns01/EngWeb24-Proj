import bcrypt from 'bcrypt'

function encrypt_password(password){
    bcrypt.genSalt(10, (error, salt) => {
        if(error){
            console.log('Erro em genSalt: ' + error)
            return            
        }

        bcrypt.hash(password, salt, (error, hash) => {
            if(error){
                console.log('Erro em hash: ' + error)
                return            
            }

            return hash
        })
    })
}

export default encrypt_password