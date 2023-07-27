const authorization = (requiredRoles) =>{
    return async (req, res, next)=>{
        if(!req.user) return res.status(401).send({status: "error", error: "Unauthorized"})
        const userRole = req.user.role;
        if (!requiredRoles.includes(userRole)) {
          return res.status(403).send({ status: "error", error: "Not authorized" });
        }
        /* if(req.user.role !== role) return res.status(403).send({status: 'error', error:' not permission'}) */
        next()
    }
}

module.exports = {
    authorization
}