import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Col, Container, Row, Button, Table, Navbar } from 'react-bootstrap';
import './App.css';

import { Question } from './QAModels.js';

const question = new Question;
question.init();
const answerList = question.getAnswers();


function App() {

  return (
    <Container fluid>
      <Row>
        <Col>
          <Navbar bg="primary" variant="dark">
            <Navbar.Brand className="mx-2">
              <i className="bi bi-collection-play" />
              HeapOverrun
            </Navbar.Brand>
          </Navbar>
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
          <table>
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
              <tr>
                <td>2024-03-07</td>
                <td>for of</td>
                <td>Alice</td>
                <td>3</td>
                <td><button className='btn btn-primary'>Vote</button></td>
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>

      <Row>
        <Col>
          <footer>
            <p>&copy; Web Applications</p>
            <div id="time"></div>
          </footer>
        </Col>
      </Row>
    </Container>
  )
}

export default App
