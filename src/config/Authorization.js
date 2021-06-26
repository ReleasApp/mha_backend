exports.loginRequired = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({ message: 'This resource required logging in!'});
    }
};

exports.checkDocValidate = (req, res, next) => {
    if(
        req.user && 
        req.user.role==="Doctor" && 
        req.user.isApproved==='Approved'
    ){
        next();
    } else {
        return res.status(401).json({ message: 'You need to be an Approved Doctor to access this resource!'});
    }
}

exports.checkAdmin = (req, res, next) => {
    if(
        req.user && 
        req.user.role==="Admin"
    ){
        next();
    } else {
        console.log(req)
        return res.status(401).json({ message: 'You need to be an Admin to access this resource!'});
    }
}