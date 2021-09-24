module.exports = (req, res, next) => {
    if (!req.session.isAuth){
        req.session.redirectTo =req.originalUrl
        return res.redirect("/account/login")
    }
    next()
}
