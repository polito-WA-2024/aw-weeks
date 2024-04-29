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

    }

    return (
        <>
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control type="date" name="date" value={date} onChange={()=> undefined} />
            </Form.Group>

            <Form.Group>
                <Form.Label>Text</Form.Label>
                <Form.Control type="text" name="text" value={text} onChange={()=> undefined} />
            </Form.Group>

            <Form.Group>
                <Form.Label>Respondent</Form.Label>
                <Form.Control type="text" name="respondent" value={respondent} onChange={()=> undefined} />
            </Form.Group>

            <Form.Group>
                <Form.Label>Score</Form.Label>
                <Form.Control type="number" name="score" value={score} onChange={()=> undefined} />
            </Form.Group>

            <Button type='submit' variant="primary">{'Add'}</Button>
            <Button variant='warning' onClick={()=> undefined}>Cancel</Button>
        </Form>
        </>
    );

}

export { AnswerForm };