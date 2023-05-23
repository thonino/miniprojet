// Express :
// Express-session :
const express = require('express'); 
const session = require('express-session');
var app = express();
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// BodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false })); 

// EJS : (Embedded JavaScript)
app.set('view engine','ejs'); 

// npm i dotenv
require('dotenv').config();

// Mongodb et Mongoose :
var mongoose = require('mongoose');
const Chat = require('./models/Chat');
const User = require('./models/User');
const { log } = require('console');

const url = process.env.DATABASE_URL;
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected");
}).catch(err => {
  console.log(err);
});

// Method-override :
// [npm install method-override --save] instale module de dépendance method-override
// pour l'utilisation de put() ou delete() qui ne sont pas prise en charge de base.
const methodOverride = require('method-override')
app.use(methodOverride('_method'));

// bcrypt
const bcrypt = require('bcrypt');





// -------------- User ----------------
app.get('/new/user', function(req, res){
  res.render('SignupForm',);});

app.post('/api/signup', function(req, res){
  const Data = new User({
    pseudo: req.body.pseudo,
    email: req.body.email,
    role: req.body.role,
    password: bcrypt.hashSync(req.body.password,10),
    statut: req.body.statut,
    role: req.body.role
  })
  Data.save()
  .then(()=>{ res.redirect('/login')})
  .catch((err)=>{console.log(err); 
});
});

app.get('/login',(req,res)=>{res.render('LoginForm')});

// Login
app.post('/api/login', (req, res) => {
  User.findOne({ username: req.body.username }).then(user => {
      if (!user) {res.send('Invalid username');}
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        res.send('Invalid password');}
      req.session.user = user;
      res.render("Userpage", { data: user });})
    .catch(err => console.log(err));
});

// user page 
app.get('/userpage', function(req, res){
  Chat.find()
  .then(data =>{res.render('Userpage', {data:data})})
  .catch(err => console.log(err))
});

// logout
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {console.log(err); } else {
      res.redirect('/login'); 
    }
  });
});

// -------------  Chat -------------
// [CREATE CHAT] 
app.get('/new/message', function(req, res){
  res.render('ChatForm');});
  app.post('/submit-chat', function(req, res){
    const Data = new Chat({
    expediteur: req.body.expediteur,
    destinataire: req.body.destinataire,
    message: req.body.message,
  })
  Data.save().then(()=>{ 
    res.redirect('/'); // redirection => home
    console.log("Data saved success"); 
  }).catch(err => { console.log(err); }); // si erreur
  });

// [READ chat] 
app.get('/', function(req, res){
  Chat.find()
  .then(data =>{res.render('Chat', {data:data})})
  .catch(err => console.log(err))
});

// [EDIT chat] 
  app.get('/chat/:id', function(req, res){
    Chat.findOne({_id: req.params.id})
      .then(data => {res.render('EditChat', { data: data });})
      .catch(err => console.log(err));
  });
  app.put('/chat/edit/:id', function(req, res){
    const Data = {
      expediteur: req.body.expediteur,
      destinataire: req.body.destinataire,
      message: req.body.message,
    }
    Chat.updateOne({_id: req.params.id}, {$set: Data})
    .then(console.log("Data updated"), res.redirect('/'))
    .catch(err => console.log(err));
  });

// [DELETE Chat] 
app.delete('/delete/:id', function(req, res){
  Chat.findOneAndDelete({_id: req.params.id})
  .then( res.redirect('/'))
  .catch(err => console.log(err));
});

// Nodemon 
var server = express(); app.listen(5000, function () {
  console.log("server listening : http://localhost:5000");
});
