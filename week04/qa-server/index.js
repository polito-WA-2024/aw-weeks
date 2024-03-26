'use strict';

const express = require('express');
const morgan = require('morgan');
const {check, validationResult} = require('express-validator');

const dao = require('./dao'); // module for accessing the DB.  NB: use ./ syntax for files in the same dir

const app = express();

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());  // To automatically decode incoming json

app.get('/', (req, res) => {
    res.send('Hello!');
});

/*** APIs ***/

// GET /api/questions
app.get('/api/questions', (req, res) => {
    dao.listQuestions()
      .then(questions => res.json(questions))
      .catch(() => res.status(500).end());
  });


// GET /api/questions/<id>/answers
app.get('/api/questions/:id/answers', async (req, res) => {
  try {
    const result = await dao.listAnswersByQuestion(req.params.id);
    //console.log("result: "+JSON.stringify(result));
    if (result.error)
      res.status(404).json(result);
    else
      res.json(result);  // NB: list of answers can also be an empty array
  } catch (err) {
    res.status(500).end();
  }
});

  
// POST /api/answers
app.post('/api/answers', async (req, res) => {

  /* Not yet working because getQuestion is not implemented yet
  const resultQuestion = await dao.getQuestion(req.body.questionId);
  if (resultQuestion.error) {
    return res.status(404).json({error: 'Question not found'});
  }
  */
 
  const answer = {
    questionId: req.body.questionId,
    score: req.body.score,
    date: req.body.date,
    text: req.body.text,
    respondent: req.body.respondent,
  };

  try {
    const newId = await dao.createAnswer(answer);
    res.status(201).json(newId);  // could also be the whole object including the newId
  } catch (err) {
    res.status(503).json({ error: `Database error during the creation of the answer` });
  }
}
);

// UPDATE /api/answers/<id>
app.put('/api/answers/:id', [
  check('id').isInt(),
  check('respondent').isLength({min: 2})
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }


  const answer = {
    questionId: req.body.questionId,
    score: req.body.score,
    date: req.body.date,
    text: req.body.text,
    respondent: req.body.respondent,
  };

  try {
    const numRowChanges = await dao.updateAnswer(answer);
    res.status(200).json(numRowChanges);  // could also be the whole object including the newId
  } catch (err) {
    res.status(503).json({ error: `Database error during the creation of the answer` });
  }
}
);



app.listen(3001, ()=>{console.log('Server ready');})