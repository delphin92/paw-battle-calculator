import React from 'react';
import './App.css';
import Header from "Header";
import { Switch, Route } from 'react-router-dom';
import CalcPage from "pages/Calc/CalcPage";
import {Container} from "react-bootstrap";

function App() {
  return (
    <div className="App">
        <Header/>

        <Container>
            <Switch>
                <Route path="/calc" component={CalcPage}/>
            </Switch>
        </Container>
    </div>
  );
}

export default App;
