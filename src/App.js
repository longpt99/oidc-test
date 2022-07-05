import queryString from "query-string";
import { useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import { AppConst } from "./app.const";
import "./App.css";
import Header from "./components/Header/Header";
import User from "./components/User/User";
import AuthImage from "./images/index";

const options = [
  {
    label: "Development",
    value: "https://oidc.dev.dentity.com/oidc",
  },
  {
    label: "Production",
    value: "https://oidc.dentity.com/oidc",
  },
];

function App() {
  const [data, setData] = useState({
    client_id: "",
    client_secret: "",
    scope: "openid",
    response_type: "code",
    redirect_uri: "",
    logout_redirect_uri: "",
  });

  const [token, setToken] = useState(() => {
    const token = localStorage.getItem("token");
    return token;
  });
  const [valueEnvironment, setValueEnvironment] = useState(null);

  let history = useHistory();
  const stringifiedParams = queryString.stringify({
    client_id: data.client_id,
    scope: data.scope,
    response_type: data.response_type,
    redirect_uri: data.redirect_uri,
  });
  const setNewToken = (e) => {
    setToken(e);
  };
  const loginLink = `${
    localStorage.getItem("serverApi")
      ? localStorage.getItem("serverApi")
      : AppConst.SERVER.API
  }/auth?${stringifiedParams}`;
  const logoutLink = `${
    localStorage.getItem("serverApi")
      ? localStorage.getItem("serverApi")
      : AppConst.SERVER.API
  }/session/end?client_id=${data.client_id}&post_logout_redirect_uri=${
    data.logout_redirect_uri
  }`;
  const handleSubmit = (linkUrl) => {
    const link = document.createElement("a");
    link.href = linkUrl;
    document.body.appendChild(link);
    link.click();
    localStorage.setItem("inputData", JSON.stringify(data));
  };
  if (history.location.pathname === "/user") {
    return (
      <>
        <Header logoutLink={logoutLink} loginLink={loginLink} />
        <Switch>
          <Route path="/user">
            <User setToken={setNewToken} />
          </Route>
        </Switch>
      </>
    );
  }
  if (!token && history.location.pathname === "/") {
    return (
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
                alt={"dentity"}
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
              <label className="label">Environment</label>
              <select
                className="input select"
                onChange={(e) => {
                  localStorage.setItem("serverApi", e.target.value);
                }}
              >
                {options.map((option) => (
                  <option value={option.value}>{option.label}</option>
                ))}
              </select>
              <label className="label">Client ID</label>
              <input
                required
                value={data.client_id}
                onChange={(e) => {
                  setData({ ...data, client_id: e.target.value });
                }}
                className="input"
              />
              <label className="label">Client Secret</label>
              <input
                required
                value={data.client_secret}
                onChange={(e) => {
                  setData({ ...data, client_secret: e.target.value });
                }}
                className="input"
              />
              <input
                required
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
                value={data.redirect_uri}
                onChange={(e) => {
                  setData({ ...data, redirect_uri: e.target.value });
                }}
              />
              <label className="label">Logout Link</label>
              <input
                className="input"
                required
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
              <div className="container_btn" style={{ display: "flex" }}>
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
                    data.client_id === "" ||
                    data.client_secret === "" ||
                    data.redirect_uri === "" ||
                    data.logout_redirect_uri === ""
                  }
                >
                  Grant Access
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
export default App;
