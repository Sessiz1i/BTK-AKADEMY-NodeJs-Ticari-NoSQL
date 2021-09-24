// Express ve body-parser ile server dinleme
// Imports
const csrf = require("csurf")
const express = require("express")
const app = express();
const bodyParser = require("body-parser")
const path = require("path")
const $ = require("jquery");
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const MongoDBStore = require("connect-mongodb-session")(session)
const connectionString = "mongodb+srv://sessiz1i:aA1190358*@sessiz1i.gv2vx.mongodb.net/node-app?retryWrites=true&w=majority"
const store = new MongoDBStore({uri: connectionString, collection: 'mySessions'})
 const multer = require("multer")
// // TODO "MULTER STORAGE" dosya kayıt ayarları
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //     cb(null, "./public/img/");
        // },
        // filename: function (req, file, cb) {
        //     cb(null, `${file.fieldname}-${new Date(Date.now()).toLocaleString().replace(/\D+/mg,"")}${path.extname(file.originalname)}`)
        // }
    }
})
//Router Imports
const accountRouters = require("./routes/AccountRouter")
const adminRoutes = require("./routes/AdminRouters")
const homeRoutes = require("./routes/HomeRouters")

// Sets
app.set("view engine", "pug")
app.set("views", "./views")

// Modeller
const User = require("./models/user")

// Uses
// TODO bodyParser text dataları işler
app.use(bodyParser.urlencoded({extended: false}))
// TODO bodyParser file dataları işler
// TODO muler options ayarları
app.use(multer({storage: storage}).single('image'))
app.use(express.static(path.join(__dirname, "./public")))
app.use(cookieParser())
app.use(session({
    secret: 'secretkey',        // secret key
    resave: false,              // yeniden kayıt
    saveUninitialized: false,   // Otomatik sesion oluşturma
    store: store,
    cookie: {
        maxAge: 3600000 * 12,     // Max Yaşam süresi milisanie 12 saat
        secure: false           // Session gizleme
    }                           // cookie Options
}))
app.use(async (req, res, next) => {
    if (!req?.session.user) {
        return next()
    } else {
        req.user = await User.findById(req?.session.user._id, {password: 0})
        req.isAuth = true
        console.log(req.user.email)
        return next()
    }
})
app.use(csrf())

// Route Uses
app.use("/account", accountRouters)
app.use("/admin", adminRoutes)
app.use("/", homeRoutes)


// TODO 404 Sayfasına yönlenme
const ErrorsController = require("./controllers/error/ErrorController")
app.use(ErrorsController.get404Page)
// TODO 500 Sayfasına yönlenme
app.use((error, req, res, next) => {
    console.log(error)
    res.status(500).render("errors/500", {
        title: "Beklenmedik bir hata oluştu.<br>Lütfen yeniden deneyiniz.",
        url: req.headers.referer
    })
})

// Mongoose Connect
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => {
        console.log("http://localhost:3000")
        app.listen(3000)
    }).catch(err => console.error(err))



