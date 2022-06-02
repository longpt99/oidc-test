import queryString from 'query-string';
import { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { AppConst } from './app.const';
import './App.css';
import Header from './components/Header/Header';
import User from './components/User/User';

function App() {
  const [data, setData] = useState({
    client_id: 'n43P5EYdEeRvlwJOzX23J',
    client_secret:
      'RL-pcYiH0ihZlv3qOZhSnXnlf_lzoo_xv6I_ALqL2fRY_qfBfktN3vGMeCpmMQWBaFwqiqFNaV303WGzY9NNNA',
    scope: 'openid',
    response_type: 'code',
    redirect_uri: `${window.location.protocol}//${window.location.host}/user`,
    logout_redirect_uri: `${window.location.protocol}//${window.location.host}`,
    trinsicTemplateId: 'urn:template:default:twilio-automatic',
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
    extraQueryParams: JSON.stringify({
      trinsicTemplateId: data.trinsicTemplateId,
    }),
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

  return (
    <div>
      {token ? (
        <Header logoutLink={logoutLink} loginLink={loginLink} />
      ) : (
        <div className="login-container">
          <div className="login-card">
            <h1>OIDC Client</h1>
            <form
              className="form"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <label>Client Id</label>
              <input
                required
                placeholder="Eg: cg219l13GsIcLvGUY-hJP"
                value={data.client_id}
                onChange={(e) => {
                  setData({ ...data, client_id: e.target.value });
                }}
              />
              <label>Client Secret</label>
              <input
                required
                placeholder="Eg: cg219l13GsIcLvGUY-hJPsdfsdafdafJKGHHJGVBJHGBhshjdgahjsgdjhas"
                value={data.client_secret}
                onChange={(e) => {
                  setData({ ...data, client_secret: e.target.value });
                }}
              />
              <input
                required
                placeholder="Eg: code"
                value={data.response_type}
                onChange={(e) => {
                  setData({ ...data, response_type: e.target.value });
                }}
                hidden
              />
              <label>Redirect Url</label>
              <input
                required
                placeholder="Eg: http://localhost:3000/user"
                value={data.redirect_uri}
                onChange={(e) => {
                  setData({ ...data, redirect_uri: e.target.value });
                }}
              />
              <label>Logout Redirect Url</label>
              <input
                required
                placeholder="Eg: http://localhost:3000"
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
                hidden
              />
              <label>Template Id</label>
              <input
                required
                value={data.trinsicTemplateId}
                onChange={(e) => {
                  setData({ ...data, trinsicTemplateId: e.target.value });
                }}
              />
              <div style={{ display: 'flex' }}>
                <button
                  class="btn-submit btn-logout"
                  onClick={() => handleSubmit(logoutLink)}
                >
                  Logout
                </button>
                <button
                  class="btn-submit"
                  onClick={() => handleSubmit(loginLink)}
                >
                  Grant Access
                </button>
              </div>
            </form>
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
