import bcrypt from 'bcrypt'

async function encrypt_password(password){
    try{
        const salt = await bcrypt.genSalt(10)
        const hash = bcrypt.hash(password, salt)
        return hash
    }catch(error){
        console.log('Error: ' + error)
        throw error
    }
}

export default encrypt_password