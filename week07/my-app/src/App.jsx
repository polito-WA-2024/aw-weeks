import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from "react-bootstrap";
import { useState } from "react";

function MyButton(props) {
	let [buttonLang, setButtonLang] = useState(props.lang) ;
	if (buttonLang === 'it')
		return <Button variant="secondary" onClick={()=>setButtonLang('en')}>Ciao!</Button>;
	else
		return <Button onClick={()=>setButtonLang('it')}>Hello!</Button>;
}


function App() {
	return (
		<p>
		Press here: <MyButton lang='en' />

		</p>
	);
}

export default App
