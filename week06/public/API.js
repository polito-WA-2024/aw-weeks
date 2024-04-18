'use strict';

import { Answer } from "./QAModels.js";

const URL = "http://localhost:3001/api";

async function getAllAnswers(id) {
    const response = await fetch(URL+`/questions/${id}/answers`);
    const answers = await response.json();

    return answers.map( e => new Answer(e.id, e.text, e.respondent, e.score, e.date, e.questionId ) );

}

export { getAllAnswers };