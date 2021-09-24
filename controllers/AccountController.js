/*---------------------------------------------*/
const User = require("../models/user")
const bcrypt = require("bcrypt")
const sgMail = require("@sendgrid/mail")
const crypto = require("crypto")
const {error, log} = require("webpack-cli/lib/utils/logger");
const {hash} = require("bcrypt");

sgMail.setApiKey('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')

/*-----------------------------------------------*/

// Login index
exports.getLogin = (req, res, next) => {
    const resData = {title: "Login"}
    req?.session?.feedback ? resData.feedback = req.session.feedback : null
    delete req.session.feedback
    res.render("./account/login", resData)

}
// Login post
exports.postLogin = async (req, res, next) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (user) {
                bcrypt.compare(req.body.password, user.password)
                    .then(async result => {

                        if (result) {
                            req.session.user = await User.findOne({email: req.body.email}, {password: 0})
                            req.session.isAuth = true
                            return req.session.save(err => {
                                err ? console.log(err) : null
                                const url = req.session.redirectTo || "/"
                                delete req.session.redirectTo;
                                res.redirect(url)
                            })
                        } else {
                            req.session.feedback = {status: "error", message: "Şifre Hatalı"}
                            return req.session.save(err => {
                                err ? console.log(err) : null
                                const url = "./login"
                                res.redirect(url)
                            })
                        }
                    }).catch(err => console.error(err))
            } else {
                console.log("Hatalı giriş veya Kulanıcı yok")
                res.redirect("./login")
            }
        })
}

// Register index
exports.getRegister = (req, res, next) => {
    const resData = {title: "Register"}
    res.render("./account/register", resData)
}
// Register Post
exports.postRegister = (req, res, next) => {
    User.findOne({email: req.body.email})
        .then(async user => {
            if (user) {
                console.log(user.name, "Bu kulanıcı sistemde kayıtlı")
                return res.redirect("./register")
            } else {
                await User.create({
                    ...req.body,
                    password: await bcrypt.hash(req.body.password, 10)
                })
            }
            return res.redirect("./login")
            const msg = {
                to: req.body.email,
                from: 'info@sessiz.com',
                subject: 'Hesap Oluşturuldu',
                html: '<h1><strong>Hesabınız Başarılı birşekilde oluşturulmuştur</strong></h1>',
            }
            sgMail.send(msg)
                .then(res => console.log(res))
                .catch(err => console.error(err))
        }).catch(err => {
        const errors = []
        if (err.name === "ValidationError") {
            for (const [index, error] of Object.entries(err.errors)) {
                errors.push({name: index, message: error.message})
            }
        }
        console.log(errors)
    })
}
// Reset Password index
exports.getResetPassword = (req, res, next) => {
    const resData = {title: "Reset Password"}
    req?.session?.feedback ? resData.feedback = req.session.feedback : null
    delete req.session.feedback
    res.render("./account/reset-password", resData)
}
// Reset Password Post
exports.postResetPassword = (req, res, next) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                req.session.feedback = {error: "Kulanıcı Kayıdı Bulunamadı."}
                req.session.save(err => {
                    console.error(err)
                    return res.redirect("./reset-password")
                })
            } else {
                crypto.randomBytes(32, (err, buffer) => {
                    if (err) {
                        console.error(err)
                        return res.redirect("/reset-password")
                    }
                    const token = buffer.toString('hex')
                    user.token.resetToken = token
                    user.token.resetTokenExpiration = Date.now() + 3600000
                    user.save()
                    const msg = {
                        to: req.body.email,
                        from: 'omer.olgn@gmail.com',
                        subject: 'Reset Password',
                        html: `<h1><strong>Parolanızı Resetlemek için aşağıdaki linke tıklayınız</strong></h1>
                        <p>
                            <a href="http://localhost:3000/account/reset-password/${token}">Reset Password...</a>
                        </p>`,
                    }
                    sgMail.send(msg)
                        .then(() => {
                            console.log('Email sent')
                        })
                        .catch((error) => {
                            console.error(error)
                        })

                })
            }
        }).catch(err => console.error(err))
    res.redirect("./login")
}
exports.getNewPassword = (req, res, next) => {
    const resData = {title: "New Password", ...req.params}
    res.render("account/new-password", resData)
}
// New Reset Password
exports.postNewPassword = (req, res, next) => {
    User.findOne({
        "token.resetToken": req.body.token,
        "token.resetTokenExpiration": {$gt: new Date()}
    }, {token: 1})
        .then(user => {
            if (!user) {
                req.session.feedback = {
                    status: "error",
                    message: "Süresi Geçmiş Reset Password İşlemi..."
                }
                req.session.save(err => {
                    err ? console.log("Session Save", err) : res.redirect("./reset-password")
                })
            } else {
                const hash = bcrypt.hashSync(req.body.password, 10)
                hash ? user.password = hash : console.log("bcrypt.hashSync de bir hata oluştu")
                user.token = undefined
                user.save().catch(err => console.error("User Kayıt Hata", err))
                req.session.feedback = {
                    status: "success",
                    message: "Reset Password Success"
                }
                req.session.save(err => {
                    err ? console.log("Session Save", err) : res.redirect("./login")
                })
            }
        }).catch(err => console.log(err))
}
// Logout
exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        err ? console.log(err) : null
        res.redirect("/")
    })
}
