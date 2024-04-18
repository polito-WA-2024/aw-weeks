'use strict';

// This file contains functions to call server APIs

import { Answer } from "./QAModels.js";

const URL = "http://localhost:3001/api";

async function getAllAnswers(questionId) {
    // call  /api/questions/:id/answers
    const response =  await fetch(URL+`/questions/${questionId}/answers`);
    const answers = await response.json();
if (response.ok) {
    return answers.map((e) => new Answer(e.id, e.text, e.respondent, e.score, e.date, e.questionId) );
} else {
   throw answers;  // expected to be an object (extracted by json) that provides info about the error
 }
}

export { getAllAnswers };