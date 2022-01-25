//Module d'authentification par token
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];//on récupère le header puis retourne un tableau dont on récupère le second élément (token)  du tableau
        const decodedToken = jwt.verify(token, process.env.TOKEN_SIGN_SECRET);//on vérifie le token avec la clé secrète
        const userId = decodedToken.userId;//on récupère l'id de l'utilisateur
        req.auth = { userId };
        if (req.body.userId && req.body.userId !== userId) {// Verifi si l'id de l'utilisateur dans le body est différent de celui du token
            throw 'Invalid user ID';
        } else {
            next();//si l'id est valide, on passe au middleware suivant
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};