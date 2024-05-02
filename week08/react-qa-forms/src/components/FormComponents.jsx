import { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import dayjs from 'dayjs';

function AnswerForm(props) {

    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));  //string: dayjs object is created only on submit
    const [text, setText] = useState('');
    const [respondent, setRespondent] = useState('');
    const [score, setScore] = useState(0);

    function handleSubmit(event) {
        event.preventDefault();
        //console.log('Submit was clicked');

        const e = {
            text: text,
            respondent: respondent,
            score: score,
            date: dayjs(date)
        }

        props.addAnswer(e);
        props.closeForm();

    }

    function handleScore(event) {
        setScore(parseInt(event.target.value));
    }

    return (
        <>
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

            <Button type='submit' variant="primary">{'Add'}</Button>
            <Button variant='warning' onClick={props.closeForm}>Cancel</Button>
        </Form>
        </>
    );

}

export { AnswerForm };