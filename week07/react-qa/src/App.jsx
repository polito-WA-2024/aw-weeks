import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Col, Container, Row, Button, Table, Navbar } from 'react-bootstrap';
import './App.css';

import { Question } from './QAModels.js';

const question = new Question(1, 'Best way of enumerating an array in JS?', 'Enrico', '2024-03-01');
question.init();
const answerList = question.getAnswers();

function MyFooter(props) {
  return (
    <footer>
      <p>&copy; Web Applications</p>
      <div id="time"></div>
    </footer>
  );
}

function MyHeader(props) {
  return (
    <Navbar bg="primary" variant="dark">
      <Navbar.Brand className="mx-2">
        <i className="bi bi-collection-play" />
        {props.appName || "HeapOverrun"}
      </Navbar.Brand>
    </Navbar>
  );
}

function AnswerRow(props) {
  const e = props.answer;
  return (
    <tr>
      <td>{e.date.format("YYYY-MM-DD")}</td>
      <td>{e.text}</td>
      <td>{e.respondent}</td>
      <td>{e.score}</td>
      <td><Button variant="primary">Vote</Button></td>
    </tr>
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
      <Row>
        <Col xs={9}>
          <p className="question">Best way of enumerating an array in JS?</p>
        </Col>
        <Col xs={3}>
          <p className="question">Author: Enrico</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <h2>Current Answers</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Text</th>
                <th>Author</th>
                <th>Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              { answerList.map((e, index) => <AnswerRow key={index} answer={e} /> ) }
            </tbody>
          </Table>
        </Col>
      </Row>

      <Row>
        <Col>
          <MyFooter />
        </Col>
      </Row>
    </Container>
  )
}

export default App
