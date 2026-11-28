const jwt=require('jsonwebtoken')

function gerartoken(id){
    return jwt.sign(
        {id:id},
        process.env.JWT_SECRET,
        {expiresIn:'1hr'}
    )
}
module.exports=gerartoken