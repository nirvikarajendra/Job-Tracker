require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const mongoose = require("mongoose");

const authRoute = require("./routes/auth");
const repoRoute = require("./routes/repo");

const app = express();
const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGODB_CONNECTION)
.then(() => {console.log("Mongoose Connected!")}).catch((err) => {console.log(err)});

app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', 1);

app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 15 * 60 * 1000 } ,
    sameSite: 'lax'
  }));

app.set("view engine",'ejs');
app.set('views', path.resolve('./views'));

app.get('/', (req, res) => {
    return res.render("home", {
        user: req.session.user,
    })
})

app.use("/auth", authRoute)
app.use("/repo", repoRoute)

app.listen(PORT, () => {console.log(`Server started at PORT ${PORT}`)})
