import { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import dayjs from 'dayjs';

function AnswerForm(props) {
    
    const [date, setDate] = useState(props.editObj? props.editObj.date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'));  //string: dayjs object is created only on submit
    const [text, setText] = useState(props.editObj? props.editObj.text : '');
    const [respondent, setRespondent] = useState(props.editObj? props.editObj.respondent : '');
    const [score, setScore] = useState(props.editObj? props.editObj.score : 0);

    const [errorMsg, setErrorMsg] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
        //console.log('Submit was clicked');

        if (score < 0) {
            // deal with the error
            setErrorMsg('Negative scores are invalid');
        } else {

        const e = {
            text: text,
            respondent: respondent,
            score: score,
            date: dayjs(date)
        }

        if (props.editObj) {
            e.id = props.editObj.id;
            props.saveExistingAnswer(e);
        } else {
            props.addAnswer(e);
            props.closeForm();
        }

        }
    }

    function handleScore(event) {
        setScore(parseInt(event.target.value));
    }

    return (
        <>
        {errorMsg? <Alert variant='danger' dismissible onClose={()=>setErrorMsg('')}>{errorMsg}</Alert> : false}
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control type="date" name="date" value={date} onChange={(event)=> setDate(event.target.value)} />
            </Form.Group>

            <Form.Group>
                <Form.Label>Text</Form.Label>
                <Form.Control type="text" name="text" value={text} onChange={(event)=> setText(event.target.value)} />
            </Form.Group>

            <Form.Group>
                <Form.Label>Respondent</Form.Label>
                <Form.Control type="text" name="respondent" value={respondent} onChange={(event) => setRespondent(event.target.value)} />
            </Form.Group>

            <Form.Group>
                <Form.Label>Score</Form.Label>
                <Form.Control type="number" name="score" value={score} onChange={handleScore} />
            </Form.Group>

            <Button type='submit' variant="primary">{props.editObj? 'Save' : 'Add'}</Button>
            <Button variant='warning' onClick={props.closeForm}>Cancel</Button>
        </Form>
        </>
    );

}

export { AnswerForm };