import { useState } from 'react'
import { MyButton, Welcome } from './Components';
import LanguageContext from './LanguageContext';

function App() {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    setLanguage( (oldLang) => oldLang === 'en' ? 'it' : 'en' );
  }

  return (
    <div className="App">
      <LanguageContext.Provider value={{lang: language, toggleLanguage: toggleLanguage}}>
        <Welcome />
        <MyButton />
      </LanguageContext.Provider>
    </div>
  );
}

export default App
