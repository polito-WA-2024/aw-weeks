import { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

function AnswerForm(props) {
    const navigate = useNavigate();
    
    const [date, setDate] = useState(props.editObj? props.editObj.date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'));  //string: dayjs object is created only on submit
    const [text, setText] = useState(props.editObj? props.editObj.text : '');
    const [respondent, setRespondent] = useState(props.editObj? props.editObj.respondent : '');
    const [score, setScore] = useState(props.editObj? props.editObj.score : 0);

    const [errorMsg, setErrorMsg] = useState('');

    function handleSubmit(event) {
        console.log('Submit was clicked');

        // Form validation
        if (date === '')
            setErrorMsg('Invalid date');
        else if (isNaN(parseInt(score)))
            setErrorMsg('Invalid score');
        else if (parseInt(score) < 0) {
            setErrorMsg('Negative scores are invalid');
        } else {

            const e = {
                text: text,
                respondent: respondent,
                score: parseInt(score),
                date: dayjs(date)
            }

            console.log(e);
            console.log(props.editObj);

            if (props.editObj) {  // decide if this is an edit or an add
                e.id = props.editObj.id;
                props.saveExistingAnswer(e);
            } else {
                props.addAnswer(e);
                navigate('/');
            }

        }
    }

    function handleScore(event) {
        setScore(event.target.value); // Cannot do parseInt here otherwise the single minus sign cannot be written
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
            <Button variant='warning' onClick={()=>{navigate('/')}}>Cancel</Button>
        </Form>
        </>
    );

}

export { AnswerForm };