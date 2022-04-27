import queryString from 'query-string';
import { Route, Switch } from 'react-router-dom';
import { AppConst } from './app.const';
import './App.css';
import Login from './components/Login/Login';
import User from './components/User/User';

function App() {
  const stringifiedParams = queryString.stringify({
    client_id: AppConst.ODIC.CLIENT_ID,
    scope: ['openid', 'email', 'profile'].join(' '), // space separated string
    response_type: 'code',
    redirect_uri: 'http://localhost:3000/user',
  });

  const loginLink = `${AppConst.SERVER.API}/auth?${stringifiedParams}`;
  const logoutLink = `${AppConst.SERVER.API}/session/end?client_id=${AppConst.ODIC.CLIENT_ID}&post_logout_redirect_uri=http://localhost:3000`;

  return (
    <div className="">
      <header className="">
        <h1>ODIC Client Example</h1>
        <nav>
          <ul className="btn-list">
            <li>
              <a
                className="btn btn-primary"
                href={loginLink}
                rel="noopener noreferrer"
              >
                Login
              </a>
            </li>
            <li>
              <a
                className="btn btn-exit"
                href={logoutLink}
                rel="noopener noreferrer"
              >
                Logout
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/user">
          <User />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
