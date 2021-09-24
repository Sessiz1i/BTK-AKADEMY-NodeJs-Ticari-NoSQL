const router = require("express").Router()
const AccountController = require("../controllers/AccountController")
const csrf = require("../middleware/csrf")



router.get("/login",            csrf,AccountController.getLogin)
router.post("/login",           csrf,AccountController.postLogin)

router.get("/register",         csrf,AccountController.getRegister)
router.post("/register",        csrf,AccountController.postRegister)

router.get("/reset-password",   csrf,AccountController.getResetPassword)
router.post("/reset-password",  csrf,AccountController.postResetPassword)

router.get("/reset-password/:token",    csrf,AccountController.getNewPassword)
router.post("/new-password",            csrf,AccountController.postNewPassword)
router.get("/logout",                   csrf,AccountController.logout)

module.exports = router


