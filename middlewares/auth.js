const jwt=require("jsonwebtoken")

function auth(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/');
    }

    try {
        const verificarToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuario = verificarToken;

        next();

    } catch (error) {
        return res.redirect('/');
    }
}

module.exports = auth;