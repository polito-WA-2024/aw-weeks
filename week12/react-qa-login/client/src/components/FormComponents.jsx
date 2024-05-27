import { useState } from 'react';
import { Button, Form, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';

function FormRoute(props) {
    return (
        <Row>
            <Col>
                <AnswerForm addAnswer={props.addAnswer} editAnswer={props.editAnswer}
                  answerList={props.answerList} />
            </Col>
        </Row>
    );
}

function AnswerForm(props) {
    const navigate = useNavigate();
    
    /* If we have an answerId in the URL, we retrieve the answer to edit from the list.
    In a full-stack application, starting from the answerId, 
    we could query the back-end to retrieve all the answer data (updated to last value). */
   
    const { answerId } = useParams();
    //console.log(answerId);
    const objToEdit = answerId && props.answerList.find(e => e.id === parseInt(answerId));
    //console.log(objToEdit);

    const [date, setDate] = useState(objToEdit? objToEdit.date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'));  //string: dayjs object is created only on submit
    const [text, setText] = useState(objToEdit? objToEdit.text : '');
    //const [respondent, setRespondent] = useState(objToEdit? objToEdit.respondent : '');
    const [score, setScore] = useState(objToEdit? objToEdit.score : 0);

    const [errorMsg, setErrorMsg] = useState('');

    function handleSubmit(event) {
        event.preventDefault();
        //console.log('Submit was clicked');

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
                //respondent: respondent,
                score: parseInt(score),
                date: dayjs(date)
            }

            //console.log(e);
            //console.log(props.editObj);

            if (objToEdit) {  // decide if this is an edit or an add
                e.id = objToEdit.id;
                props.editAnswer(e);
navigate('/');
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
{/*
            <Form.Group>
                <Form.Label>Respondent</Form.Label>
                <Form.Control type="text" name="respondent" value={respondent} onChange={(event) => setRespondent(event.target.value)} />
            </Form.Group>
*/}
            <Form.Group>
                <Form.Label>Score</Form.Label>
                <Form.Control type="number" name="score" value={score} onChange={handleScore} />
            </Form.Group>

            <div className='my-2'>
                <Button type='submit' variant="primary">{objToEdit? 'Save' : 'Add'}</Button>
                <Button variant='warning' onClick={()=>{navigate('/')}}>Cancel</Button>
            </div>
        </Form>
        </>
    );

}

export { FormRoute };
