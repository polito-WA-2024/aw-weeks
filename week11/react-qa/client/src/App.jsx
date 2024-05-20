import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState } from 'react';
import { Col, Container, Row, Navbar, Button, Spinner, Alert } from 'react-bootstrap';
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

  return ( props.initialLoading? <Spinner className="m-2" />
    : 
    <>
    {props.errorMsg? <Row><Col><Alert className="m-2" 
      variant="danger" dismissible onClose={()=>props.setErrorMsg('')} >
      {props.errorMsg}</Alert></Col></Row>: null}
    <Row>
      <QuestionDescription question={props.question} />
    </Row>
    <Row>
      <Col>
        <h2>Current Answers</h2>
      </Col>
    </Row>
    <Row>
      <Col>
        <AnswerTable listOfAnswers={props.answerList} vote={props.voteAnswer} delete={props.deleteAnswer} />
      </Col>
    </Row>
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
  // state moved up into App
  const [ question, setQuestion ] = useState({});
  const [ answers, setAnswers ] = useState([]);
  const [ initialLoading, setInitialLoading ] = useState(true);
  const [dirty, setDirty ] = useState(true);

  const [ errorMsg, setErrorMsg ] = useState('');

  function handleError(err) {
    console.log(err);
    let errMsg = 'Unkwnown error';
    if (err.errors)
      if (err.errors[0].msg)
        errMsg = err.errors[0].msg;
    else if (err.error)
      errMsg = err.error;
        
    setErrorMsg(errMsg);

    setTimeout( ()=> setDirty(true), 2000);

  }

  useEffect( () => {
    const questionId = 1;
    API.getQuestion(questionId)
      .then((q) => setQuestion(q))
      .catch((err) => console.log(err));
  }, []);

  useEffect( () => {
    if (question.id && dirty) {
      API.getAnswersByQuestionId(question.id)
        .then((answerList) => {
          setAnswers(answerList);
          setInitialLoading(false);
          setDirty(false);
        })
        .catch((err) => console.log(err));
    }
  }, [question.id, dirty]);



  function voteAnswer(id, delta) {
    setAnswers( answerList => 
      answerList.map(e => e.id === id ? Object.assign({}, e, {score: e.score+delta}) : e)
    );
  }

  function deleteAnswer(id) {
    //setAnswers( answerList =>
    //  answerList.filter(e => e.id !== id)
    //);
    setAnswers( answerList =>
      answerList.map(e => e.id === id ?  Object.assign({}, e, {status:'deleted'}) : e)
    );
    try {
      const del = async () => {
        const res = await API.deleteAnswer(id);
        setDirty(true);
      }
      del();
    } catch (err) {
      handleError(err);
    }
  }

  function addAnswer(answer) {

    setAnswers( answerList => {
      // NB: max does not take an array but a set of parameters
      const newId = Math.max(...answerList.map(e => e.id))+1;
      answer.id = newId;
      answer.status = 'added';
      return [...answerList, answer];
    }
    );
    answer.questionId = question.id;
    API.addAnswer(answer)
      .then( ()=>{ setDirty(true); } )
      .catch( (err) => handleError(err));

  }

  function saveExistingAnswer(answer) {
    setAnswers( answerList => 
      answerList.map( e => e.id === answer.id ? {...answer, status: 'updated'} : e)
    );
    API.updateAnswer(answer)
      .then(()=> setDirty(true))
      .catch((err)=> handleError(err));


  }


  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Layout />}>
          <Route index element={ <AnswerRoute question={question} answerList={answers}
            voteAnswer={voteAnswer} deleteAnswer={deleteAnswer} initialLoading={initialLoading}
            errorMsg={errorMsg} setErrorMsg={setErrorMsg} /> } />
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
