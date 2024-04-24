import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Button, Form, Table } from 'react-bootstrap';

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
  
  function AnswerTable(props) {
    return (
      <Table>
        {/* <Table striped bordered hover> */}
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
          {/* the key can also be the answer id, if unique */}
                  {props.listOfAnswers.map( (e,index) => 
                   <AnswerRow key={index} answer={e} /> )
          }
        </tbody>
      </Table>
    )
  }
  
  export { AnswerTable };