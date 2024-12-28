const jwt = require('jsonwebtoken');
const jwt_sec  = "Aniskhan1234"


const fetchuser = (req , res , next)=>{
    const token = req.header("token")
    if(!token){
        res.status(401).send({Error :"Please enter Valid token"})
    }
    try {
        const data = jwt.verify(token , jwt_sec);
        req.user = data.user
        next();
        
    } catch (error) {
        res.status(401).send({Error :"Please enter Valid token"})
        
    }
}

module.exports = fetchuser;