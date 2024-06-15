import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

function generate_token(data){
    return jwt.sign(data, process.env.JWT_SECRET_KEY, {expiresIn: '3000s'})
}

export default generate_token