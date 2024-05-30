import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState } from 'react';
import { Col, Container, Row, Navbar, Button, Spinner, Alert } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Outlet, Link, Navigate, useNavigate } from 'react-router-dom'; 
import './App.css';

import { AnswerTable } from './components/AnswerComponents.jsx';
import { QuestionDescription } from './components/QuestionComponents.jsx';
import { FormRoute } from './components/FormComponents.jsx';

import { Question } from './QAModels.js';
import API from './API.js';
import { LoginForm } from './components/AuthComponents.jsx';

function ExternalInfo(props) {
  const initialInfo = 'n/a (not available)';
  const [info, setInfo ] = useState(initialInfo);


  const loadInfo = (authToken) => {
    API.getSuggestion(authToken, props.question.text)
    .then((res) => setInfo(res.text))
    .catch((err) => {console.log(err); setInfo(initialInfo); props.renewToken(); })
  }
 
  useEffect( () => {
    if (props.authToken)
      loadInfo(props.authToken);
  }, [props.authToken]);

  return (

    <div>
      <h4 className='bg-light'>Suggestion:
        <i className='bi-arrow-clockwise mx-2' onClick={() => { loadInfo(props.authToken) }}></i>
        <span className='text-secondary fs-5'>{info}</span></h4>
    </div>
  );
}


function MyHeader(props) {
  const name = props.user && props.user.name;

	return (
		<Navbar bg="primary" variant="dark" className="d-flex justify-content-between">
      <Navbar.Brand className="mx-2">
        <i className="bi bi-collection-play" />
        {/* props.appName just in case you want to set a different app name */}
        {props.appName || "HeapOverrun"}
      </Navbar.Brand>
      {name ? <div>
        <Navbar.Text className='fs-5'>
          {"Signed in as: " + name}
        </Navbar.Text>
        <Button className='mx-2' variant='danger' onClick={props.logout}>Logout</Button>
      </div> :
        <Link to='/login'>
          <Button className='mx-2' variant='warning'>Login</Button>
        </Link>}
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

  const navigate = useNavigate();

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
        {props.authToken? 
        <ExternalInfo authToken={props.authToken} question={props.question} renewToken={props.renewToken} /> : null}
      </Col>
    </Row>
    <Row>
      <Col>
        <h2>Current Answers</h2>
      </Col>
    </Row>
    <Row>
      <Col>
        <AnswerTable listOfAnswers={props.answerList} vote={props.voteAnswer} delete={props.deleteAnswer}
             errorMsg={props.errorMsg} user={props.user} />
      </Col>
    </Row>
    <Row>
      <Col>
          <Button disabled={props.user? false: true} onClick={()=>navigate('/add')}>Add</Button> 
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

  const [ dirty, setDirty ] = useState(true);

  const [ errorMsg, setErrorMsg ] = useState('');

  const [user, setUser ] = useState(undefined);
  const [loggedIn, setLoggedIn] = useState(false);

  const [authToken, setAuthToken] = useState(null);

  function handleError(err) {
    console.log('handleError: ',err);
    let errMsg = 'Unkwnown error';
    if (err.errors) {
      if (err.errors[0].msg) {
        errMsg = err.errors[0].msg;
      }
    } else {
      if (err.error) {
        errMsg = err.error;
      }
    }
    setErrorMsg(errMsg);

    if (errMsg === 'Not authenticated')
      setTimeout(() => {  // do logout in the app state
        setUser(undefined); setLoggedIn(false); setDirty(true)
      }, 2000);
    else
      setTimeout(()=>setDirty(true), 2000);  // Fetch the current version from server, after a while
  }

  const renewToken = () => {
    API.getAuthToken()
      .then((resp) => setAuthToken(resp.token))
      .catch(()=>{});
  };


  useEffect(()=> {
    const checkAuth = async() => {
      try {
        // here you have the user info, if already logged in
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
        renewToken();
      } catch(err) {
        // NO need to do anything: user is simply not yet authenticated
        //handleError(err);
      }
    };
    checkAuth();
  }, []);


  useEffect( () => {
    const questionId = 1;
    API.getQuestion(questionId)
      .then((q) => setQuestion(q))
      .catch((err) => handleError(err));
}, []);

  useEffect(() => {
    if (question.id && dirty) {    
      // && dirty is inserted to avoid a second (useless) call to the get API when dirty is already false

      API.getAnswersByQuestionId(question.id)
        .then((answerList) => {
          setAnswers(answerList);
          setInitialLoading(false);
          setDirty(false);
        })
        .catch((err) => handleError(err));
    }
  }, [question.id, dirty]);

  
  function voteAnswer(id, delta) {
    setAnswers( answerList => 
      answerList.map(e => e.id === id ? Object.assign({}, e, {score: e.score+delta, status:'updated'}) : e)
    );
    API.voteAnswer(id, delta)
      .then(() => setDirty(true))
      .catch((err) => handleError(err));
  }

  function deleteAnswer(id) {
    // setAnswers( answerList => answerList.filter(e => e.id !== id) );
    setAnswers( answerList => 
      answerList.map(e => e.id === id ? Object.assign({}, e, {status:'deleted'}) : e)
    );
    API.deleteAnswer(id)
    .then(() => setDirty(true))
    .catch((err) => handleError(err));
}

  function addAnswer(answer) {
    setAnswers( answerList => {
      // NB: max does not take an array but a set of parameters
      const newId = Math.max(...answerList.map(e => e.id))+1;
      answer.questionId = question.id;   // Do not forget to add the question ID to which the answer is connected
      answer.id = newId;
      answer.respondent = user.name;
      answer.status = 'added';
      return [...answerList, answer];
    }
    );
    API.addAnswer(answer)
      .then(() => setDirty(true))
      .catch((err) => handleError(err));
  }

  function saveExistingAnswer(answer) {
    setAnswers( answerList => 
      answerList.map( e => e.id === answer.id ? { ...answer, respondent: user.name, status: 'updated'} : e)
    );
    API.updateAnswer(answer)
      .then(() => setDirty(true))
      .catch((err) => handleError(err));
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser(undefined);
    // setDirty ... ?
    /* set state to empty if appropriate */
    setAuthToken('');  // NB: this does not invalidate token, it just removes it from the app

  }

  const loginSuccessful = (user) => {
    setUser(user);
    setLoggedIn(true);
    setDirty(true);  // load latest version of data, if appropriate
    API.getAuthToken().then((resp) => setAuthToken(resp.token)).catch(()=>{});
  }




  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Layout user={user} loggedIn={loggedIn} logout={doLogOut} />}>
          <Route index element={ <AnswerRoute question={question} answerList={answers}
            voteAnswer={voteAnswer} deleteAnswer={deleteAnswer} initialLoading={initialLoading}
            errorMsg={errorMsg} setErrorMsg={setErrorMsg}
            authToken={authToken} renewToken={renewToken}
            user={user} /> } />
          <Route path='/add' element={ <FormRoute addAnswer={addAnswer} /> } />
          <Route path='/edit/:answerId' element={<FormRoute answerList={answers}
            addAnswer={addAnswer} editAnswer={saveExistingAnswer} />} />
      </Route>
      <Route path='/login' element={loggedIn? <Navigate replace to='/' />:  <LoginForm loginSuccessful={loginSuccessful} />} />
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
          <MyHeader user={props.user} loggedIn={props.loggedIn} logout={props.logout} />
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
