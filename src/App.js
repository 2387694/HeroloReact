import './App.css';
import Nav from './components/nav'
import Home from './components/home'
import Favorites from './components/favorites';
import NotFound from './components/notFound';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';




function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Nav></Nav>
          <Switch>
            <Route path="/Favorites" component={Favorites}></Route>
            <Route path="/Home" component={Home}></Route>
            <Route path="/notFound" component={NotFound}></Route>
            <Redirect from="/" to="/Home" component={Home}></Redirect>
          </Switch>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
