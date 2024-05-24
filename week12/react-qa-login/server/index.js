'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const cors = require('cors');
const {check, validationResult} = require('express-validator'); // validation middleware

const passport = require('passport'); // auth middleware

//const LocalStrategy = require('passport-local').Strategy; // username and password for login
const LocalStrategy = require('passport-local'); // username and password for login
const session = require('express-session'); // enable sessions

const dao = require('./dao'); // module for accessing the DB.  NB: use ./ syntax for files in the same dir
const userDao = require('./dao-user'); // module for accessing the user info in the DB

const answerDelay = 500;  // To be put to 0 for the exam submission

// init express
const app = express();
const port = 3001;

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json()); // To automatically decode incoming json

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  function(username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username or password.' });
        
      return done(null, user);
    })
  }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize only the user id and store it in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});




// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated())
    return next();
  
  return res.status(401).json({ error: 'Not authenticated'});
}

// set up the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: 'wge8d239bwd93rkskb',   // change this random string, should be a secret value
  resave: false,
  saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());


/*** APIs ***/

// GET /api/questions
app.get('/api/questions', (req, res) => {
  dao.listQuestions()
    .then(questions => setTimeout(()=>res.json(questions), answerDelay))
    .catch((err) => {console.log(err); res.status(500).end()});
});

// GET /api/questions/<id>
app.get('/api/questions/:id', async (req, res) => {
  try {
    const result = await dao.getQuestion(req.params.id);
    if(result.error)
      res.status(404).json(result);
    else
      setTimeout(()=>res.json(result), answerDelay);
  } catch(err) {
    console.log(err);
    res.status(500).end();
  }
});

// GET /api/questions/<id>/answers
app.get('/api/questions/:id/answers', async (req, res) => {
  try {
    const resultQuestion = await dao.getQuestion(req.params.id);
    //console.log('Question: ' + JSON.stringify(resultQuestion));
    if (resultQuestion.error)
      res.status(404).json(resultQuestion);   // questionId does not exist
    else {
      const result = await dao.listAnswersByQuestion(req.params.id);
      //console.log("result: "+JSON.stringify(result));
      //console.log("length: "+result.length);
      if (result.error)
        res.status(404).json(result);
      else
        setTimeout(()=>res.json(result), answerDelay);  // NB: list of answers can also be an empty array
    }
  } catch(err) {
    console.log(err);
    res.status(500).end();
  }
});


// GET /api/answers
app.get('/api/answers', async (req, res) => {
  try {
    const answers = await dao.listAnswers();
    res.json(answers);
  } catch(err) {
    console.log(err);
    res.status(500).end();
  }
});

// GET /api/answers/<id>
app.get('/api/answers/:id', async (req, res) => {
  try {
    const result = await dao.getAnswer(req.params.id);
    if(result.error)
      res.status(404).json(result);
    else
      res.json(result);
  } catch(err) {
    console.log(err);
    res.status(500).end();
  }
});


// POST /api/answers
app.post('/api/answers', [
  check('score').isInt(),
  check('respondent').isLength({min: 1}),   // as an example
  check('date').isDate({format: 'YYYY-MM-DD', strictMode: true})
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  const questionId = req.body.questionId;
  const resultQuestion = await dao.getQuestion(questionId);  // db consistency: make sure questionId already exists
  if (resultQuestion.error)
    res.status(404).json(resultQuestion);   // questionId does not exist, please insert the question before the answer
  else {
    const answer = {
      questionId: questionId,
      score: req.body.score,
      date: req.body.date,
      text: req.body.text,
      respondentId: 1,      // It was:  req.body.respondent,
    };

    try {
      const newAnswer = await dao.createAnswer(answer);
      setTimeout(()=>res.status(201).json(newAnswer.id), answerDelay);
    } catch (err) {
      res.status(503).json({ error: `Database error during the creation of answer ${answer.text} by ${answer.respondent}.` });
    }
  }
});


// PUT /api/answers/<id>
app.put('/api/answers/:id', [
  check('score').isInt(),
  //check('respondent').isLength({min: 1}),   // as an example
  check('date').isDate({format: 'YYYY-MM-DD', strictMode: true}),
  check('respondentId').isInt(),
  check('id').isInt()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  const answer = req.body;
  // you can also check here if the id passed in the URL matches with the id in req.body,
  // and decide which one must prevail, or return an error
  answer.id = req.params.id;

  try {
    const numRowChanges = await dao.updateAnswer(answer);
    setTimeout(()=>res.json(numRowChanges), answerDelay);
    //res.status(200).end();
  } catch(err) {
    console.log(err);
    res.status(503).json({error: `Database error during the update of answer ${req.params.id}.`});
  }

});


// POST /api/answers/<id>/vote
// NOTE: this is a POST, not a PUT, since it is NOT idempotent
app.post('/api/answers/:id/vote', [
  check('id').isInt(),
  check('vote').isIn(['upvote','downvote'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  try {
    const numRowChanges = await dao.voteAnswer(req.params.id, req.body.vote);
    // number of changed rows is sent to client as an indicator of success
    setTimeout(()=>res.json(numRowChanges), answerDelay);
  } catch (err) {
    console.log(err);
    res.status(503).json({ error: `Database error while voting answer ${req.params.id}.` });
  }

});


// DELETE /api/answers/<id>
app.delete('/api/answers/:id', [
  check('id').isInt()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }
  try {
    const numRowChanges = await dao.deleteAnswer(req.params.id);  
    // NOTE: if there is no element with the specified id, the delete operation is considered successful
    // since the final status of the server is that the element with that id does not exist.
    // This is also consistent with the fact that DELETE should be idempotent.
    // However, for easier debugging, we send the number of affected (changed) rows to the client.
    setTimeout(()=>res.json(numRowChanges), answerDelay);
  } catch(err) {
    console.log(err);
    res.status(503).json({ error: `Database error during the deletion of answer ${req.params.id}.`});
  }
});


/*** Users APIs ***/

// POST /sessions 
// login
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        // this is coming from userDao.getUser()
        return res.json(req.user);
      });
  })(req, res, next);
});

// ALTERNATIVE: if we are not interested in sending error messages...
/*
app.post('/api/sessions', passport.authenticate('local'), (req,res) => {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  res.json(req.user);
});
*/

// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout( ()=> { res.end(); } );
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {  if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
  else
    res.status(401).json({error: 'Unauthenticated user!'});;
});


/*** Other express-related instructions ***/

// Activate the server
app.listen(port, () => {
  console.log(`qa-server listening at http://localhost:${port}`);
});
