import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState } from 'react';
import { Col, Container, Row, Navbar, Button } from 'react-bootstrap';
import './App.css';

import { AnswerTable } from './components/AnswerComponents.jsx';
import { QuestionDescription } from './components/QuestionComponents.jsx';
import { AnswerForm } from './components/FormComponents.jsx';

import { Question } from './QAModels.js';

const question = new Question(1, 'Best way of enumerating an array in JS?', 'Enrico', '2024-03-01');
question.init();
const initialAnswerList = question.getAnswers();


function MyHeader(props) {
	return (
		<Navbar bg="primary" variant="dark">
      <Navbar.Brand className="mx-2">
      <i className="bi bi-collection-play" />
      {/* props.appName just in case you want to set a different app name */}
			{props.appName || "HeapOverrun"}
      </Navbar.Brand>
		</Navbar>
	);
}


function MyFooter(props) {
  return (<footer>
    <p>&copy; Web Applications</p>
    <div id="time"></div>
  </footer>);
}



function Main(props) {

  const [ answers, setAnswers ] = useState(initialAnswerList);

  const [ showForm, setShowForm ] = useState(false);

  const [ editObj, setEditObj ] = useState(undefined);
  
  function voteAnswer(id, delta) {
    setAnswers( answerList => 
      answerList.map(e => e.id === id ? Object.assign({}, e, {score: e.score+delta}) : e)
    );
  }

  function deleteAnswer(id) {
    setAnswers( answerList =>
      answerList.filter(e => e.id !== id)
    );
  }

  function addAnswer(answer) {
    setAnswers( answerList => {
      // NB: max does not take an array but a set of parameters
      const newId = Math.max(...answerList.map(e => e.id))+1;
      answer.id = newId;
      return [...answerList, answer];
    }
    );
  setShowForm(false);
  }

  function saveExistingAnswer(answer) {
    setAnswers( answerList => 
      answerList.map( e => e.id === answer.id ? answer : e)
    );
    setShowForm(false);
    setEditObj(undefined);
  }

  function setEditAnswer(id) {
    setEditObj( answers.find( e => e.id === id) );
    setShowForm(true);
  }

  return (<>
    <Row>
      <QuestionDescription question={question} />
    </Row>
    <Row>
      <Col>
        <h2>Current Answers</h2>
      </Col>
    </Row>
    <Row>
      <Col>
        <AnswerTable listOfAnswers={answers} vote={voteAnswer} 
        delete={deleteAnswer}  edit={setEditAnswer} />
      </Col>
    </Row>
    <Row>
      <Col>
          {/* key in AnswerForm is needed to make React re-create the component when editObj.id changes,
            i.e., when the editing form is open and another edit button is pressed. */}
          {showForm? <AnswerForm closeForm={()=> setShowForm(false)}
            addAnswer={addAnswer} editObj={editObj}
            saveExistingAnswer={saveExistingAnswer}
            key={editObj ? editObj.id : -1}
           /> 
          : <Button onClick={()=>setShowForm(true)}>Add</Button>}
      </Col>
    </Row>
  </>
  );
}


function App() {

  return (
    <Container fluid>
      <Row>
        <Col>
          <MyHeader />
        </Col>
      </Row>
      <Main />
      <Row>
        <Col>
          <MyFooter />
        </Col>
      </Row>
    </Container>
  )
}

export default App
