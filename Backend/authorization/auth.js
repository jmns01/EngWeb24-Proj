function verify_jwt(req, res, next){
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({message: 'No token provided.'});

    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if (err) return res.status(500).json({message: 'Failed to authenticate token.'});
        req.data = decoded;
        next();
    });
}

function verify_admin(req, res, next){
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({message: 'No token provided.'});

    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if (err) return res.status(500).json({message: 'Failed to authenticate token.'});
        req.data = decoded;
        if(req.data.level != 'Administrador') return res.status(500).json({message: 'User level is not "Administrador".'});
        next();
    });
}


export default {verify_jwt, verify_admin}