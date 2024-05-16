import dayjs from 'dayjs';

const URL = 'http://localhost:3001/api';

async function getQuestion(id) {
    // call API   /api/questions/<id>
    const response = await fetch(URL+`/questions/${id}`);
    const question = await response.json();
    if (response.ok) {
        const e = question;
        return {id: e.id, text: e.text, author: e.author, date: e.date};
    } else {
        throw question;
    }
}

async function getAnswersByQuestionId(id) {
    // GET /api/questions/<id>/answers
    const response = await fetch(URL+`/questions/${id}/answers`);
    const answers = await response.json();
    if (response.ok) {
        return answers.map( (e) =>
            ({id: e.id, text: e.text, respondent: e.respondent,
                score: e.score, date: dayjs(e.date), questionId: e.questionId})
        );
    } else {
        throw answers;
    }
}



const API = {getQuestion, getAnswersByQuestionId};

export default API;