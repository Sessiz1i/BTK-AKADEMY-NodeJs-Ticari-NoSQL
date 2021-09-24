module.exports = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken()
    res.locals.isAuth = req.session.isAuth
    res.locals.isAdmin = req.user ? req.user.isAdmin : false
    next()
}