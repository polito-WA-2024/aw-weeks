import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState } from 'react';
import { Col, Container, Row, Navbar, Button, Spinner } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Outlet, Link } from 'react-router-dom'; 
import './App.css';

import { AnswerTable } from './components/AnswerComponents.jsx';
import { QuestionDescription } from './components/QuestionComponents.jsx';
import { FormRoute } from './components/FormComponents.jsx';

import { Question } from './QAModels.js';
import API from './API.js';

//const initialQuestion = new Question(1, 'Best way of enumerating an array in JS?', 'Enrico', '2024-03-01');
//initialQuestion.init();
//const initialAnswerList = initialQuestion.getAnswers();


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


function AnswerRoute(props) { 

  return (<>
    <input type='text' value={props.questionId} onChange={
       (ev)=>{ const newId = ev.target.value;
        API.getQuestion(newId)
          .then((q) => props.setQuestion(q));
        props.setQuestionId(newId);
       }
      } />
    <Row>
      <QuestionDescription question={props.question} />
    </Row>
    <Row>
      <Col>
        <h2>Current Answers</h2>
      </Col>
    </Row>
    {props.loading?  <Spinner /> : 
    <Row>
      <Col>
        <AnswerTable listOfAnswers={props.answerList} vote={props.voteAnswer} delete={props.deleteAnswer} />
      </Col>
    </Row>
}
    <Row>
      <Col>
        <Link to='/add'> 
          <Button>Add</Button> 
        </Link>
      </Col>
    </Row>
  </>
  );
}

function DefaultRoute(props) {
  return (
    <Container fluid>
      <p className="my-2">No data here: This is not a valid page!</p>
      <Link to='/'>Please go back to main page</Link>
    </Container>
  );
}

function App() {
  const [ questionId, setQuestionId ] = useState(1);

  // state moved up into App
  const [ question, setQuestion ] = useState({});
  const [ answers, setAnswers ] = useState([]);

  const [ loading, setLoading ] = useState(true);

  useEffect( () => {
    API.getQuestion(questionId)
      .then((q) => setQuestion(q))
      .catch((err) => console.log(err));

    API.getAnswersByQuestionId(questionId)
      .then((answerList) => {
        setAnswers(answerList);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);



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
  //setShowForm(false);
  }

  function saveExistingAnswer(answer) {
    setAnswers( answerList => 
      answerList.map( e => e.id === answer.id ? answer : e)
    );
    //setShowForm(false);
    //setEditObj(undefined);
  }

/*
  function setEditAnswer(id) {
    setEditObj( answers.find( e => e.id === id) );
    setShowForm(true);
  }
*/

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Layout />}>
          <Route index element={ <AnswerRoute question={question} answerList={answers}
            voteAnswer={voteAnswer} deleteAnswer={deleteAnswer}
            setQuestionId={setQuestionId} questionId={questionId}
            setQuestion={setQuestion}
            loading={loading}
            /> } />
          <Route path='/add' element={ <FormRoute addAnswer={addAnswer} /> } />
          <Route path='/edit/:answerId' element={<FormRoute answerList={answers}
            addAnswer={addAnswer} editAnswer={saveExistingAnswer} />} />
      </Route>
      <Route path='/*' element={<DefaultRoute />} />
    </Routes>
  </BrowserRouter>
  );
}

function Layout(props) {
return (
<Container fluid>
      <Row>
        <Col>
          <MyHeader />
        </Col>
      </Row>
      <Outlet />
      <Row>
        <Col>
          <MyFooter />
        </Col>
      </Row>
    </Container>
  )
}

export default App
