import React from 'react';
import './App.css';
import Header from "Header";
import { Switch, Route } from 'react-router-dom';
import CalcPage from "pages/Calc/CalcPage";
import {Container} from "react-bootstrap";
import BattleLogPage from "pages/BattlesLog/BattleLogPage";

function App() {
  return (
    <div className="App">
        <Header/>

        <Container>
            <Switch>
                <Route path="/calc/:battleIndex" component={CalcPage}/>
                <Route path="/log/:battleIndex" component={BattleLogPage}/>
            </Switch>
        </Container>
    </div>
  );
}

export default App;
