import queryString from 'query-string';
import { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { AppConst } from './app.const';
import './App.css';
import Header from './components/Header/Header';
import User from './components/User/User';
import AuthImage from './images/index';

function App() {
  const [data, setData] = useState({
    client_id: 'r63RdsmM4Gifn5Gxm1ZFn',
    client_secret:
      'XJYeb3qtSvXOcHPL3cMo3QJgQs65ZmyJlwh2MoW7rqy_ScBP3K9Vm_hGfBaVnAPYwR8F4h5q_URpGEAll16rRA',
    scope: 'openid',
    response_type: 'code',
    redirect_uri: 'http://localhost:3000/user',
    logout_redirect_uri: 'http://localhost:3000',
  });
  const [token, setToken] = useState(() => {
    const token = localStorage.getItem('token');
    return token;
  });

  const stringifiedParams = queryString.stringify({
    client_id: data.client_id,
    scope: data.scope,
    response_type: data.response_type,
    redirect_uri: data.redirect_uri,
  });

  const setNewToken = (e) => {
    setToken(e);
  };

  const loginLink = `${AppConst.SERVER.API}/auth?${stringifiedParams}`;
  const logoutLink = `${AppConst.SERVER.API}/session/end?client_id=${data.client_id}&post_logout_redirect_uri=${data.logout_redirect_uri}`;

  const handleSubmit = (linkUrl) => {
    const link = document.createElement('a');
    link.href = linkUrl;
    document.body.appendChild(link);
    link.click();
    localStorage.setItem('inputData', JSON.stringify(data));
  };

  useEffect(() => {
    if (localStorage.getItem('inputData')) {
      setData(JSON.parse(localStorage.getItem('inputData')));
    }
  }, []);

  return (
    <div>
      {token ? (
        <Header logoutLink={logoutLink} loginLink={loginLink} />
      ) : (
        <div className="login-container">
          <div className="login-card">
            <div className="bodyTop">
              <a
                className="logoButton"
                href="https://www.dentity.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={AuthImage.logoBlueWeb}
                  alt={'dentity'}
                  className="logo"
                />
              </a>
            </div>
            <div className="body">
              <div className="titleOIDC">Configure OIDC Client</div>
              <form
                className="form"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <label className="label">Client ID</label>
                <input
                  required
                  placeholder="IbTmT2-URGaDIGgnI4vMh"
                  value={data.client_id}
                  onChange={(e) => {
                    setData({ ...data, client_id: e.target.value });
                  }}
                  className="input"
                />
                <label className="label">Client Secret</label>
                <input
                  required
                  placeholder="EoUHG3M3Eycg-9snrnlF9a9SDVrR1F2aPXsLIK9kE4dkZDbbT2MAX24hvHTafAEztD86fHoihBiVF6Tja2DUcg"
                  value={data.client_secret}
                  onChange={(e) => {
                    setData({ ...data, client_secret: e.target.value });
                  }}
                  className="input"
                />
                <input
                  required
                  placeholder="Eg: code"
                  value={data.response_type}
                  onChange={(e) => {
                    setData({ ...data, response_type: e.target.value });
                  }}
                  className="inputNone"
                  hidden
                />
                <label className="label">Redirect Link</label>
                <input
                  className="input"
                  required
                  placeholder={`${window.location.protocol}//${window.location.host}/user`}
                  value={data.redirect_uri}
                  onChange={(e) => {
                    setData({ ...data, redirect_uri: e.target.value });
                  }}
                />
                <label className="label">Logout Link</label>
                <input
                  className="input"
                  required
                  placeholder={`${window.location.protocol}//${window.location.host}`}
                  value={data.logout_redirect_uri}
                  onChange={(e) => {
                    setData({ ...data, logout_redirect_uri: e.target.value });
                  }}
                />
                <input
                  required
                  value={data.scope}
                  placeholder="Eg: openid"
                  onChange={(e) => {
                    setData({ ...data, scope: e.target.value });
                  }}
                  className="inputNone"
                  hidden
                />
                <div className="container_btn" style={{ display: 'flex' }}>
                  <button
                    class="btn-submit btn-logout"
                    onClick={() => handleSubmit(logoutLink)}
                  >
                    Logout
                  </button>
                  <button
                    class="btn-submit"
                    onClick={() => handleSubmit(loginLink)}
                    disabled={
                      data.client_id === '' ||
                      data.client_secret === '' ||
                      data.redirect_uri === '' ||
                      data.logout_redirect_uri === ''
                    }
                  >
                    Grant Access
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Switch>
        <Route path="/user">
          <User setToken={setNewToken} />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
