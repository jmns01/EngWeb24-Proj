import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export function verify_token(req, res, next){
    const token = req.headers['authorization'];

    if (!token) return res.status(401).json({message: 'No token provided.'});

    jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decoded) {
        if (err) return res.status(401).json({message: 'Failed to authenticate token: ' + err.message});

        req.data = decoded;

        next();
    });
}

export function is_admin(req, res, next){
    const token = req.headers['authorization'];

    if (!token) return res.status(401).json({message: 'No token provided.'});

    jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decoded) {
        if (err) return res.status(401).json({message: 'Failed to authenticate token.'});

        req.data = decoded;

        if(req.data.level != 'Administrador') return res.status(500).json({message: 'User level is not "Administrador".'});

        next();
    });
}