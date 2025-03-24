const jwt = require('jsonwebtoken')

async function authToken(req,res,next){
    try{
       const token = req.headers?.authorization;
        if(!token){
            return res.status(401).json({
                message : "Please Login...!",
                error : true,
                success : false
            })
        }

        jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
            console.log(err)
            
            if(err){
                console.log("error auth", err)
            }

            req.userId = decoded?._id

            next()
        });


    }catch(err){
        res.status(500).json({
            message : err.message || err,
            data : [],
            error : true,
            success : false
        })
    }
}


module.exports = authToken