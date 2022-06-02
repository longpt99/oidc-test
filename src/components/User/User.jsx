import queryString from 'query-string';
import { Fragment, useEffect } from 'react';
import axios from 'axios';
import { AppConst } from '../../app.const';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

function User(props) {
  const [userData, setUserData] = useState({});
  const [data, setData] = useState(
    JSON.parse(localStorage.getItem('inputData') || '')
  );
  let history = useHistory();

  const atLink = `${AppConst.SERVER.API}/token`;

  async function getSource() {
    try {
      const { code } = queryString.parse(window.location.search);
      const reposneAT = await axios({
        method: 'post',
        url: atLink,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: queryString.stringify({
          client_id: data.client_id,
          client_secret: data.client_secret,
          redirect_uri: data.redirect_uri,
          grant_type: 'authorization_code',
          code: code,
        }),
      });
      props.setToken(reposneAT.data.access_token);
      localStorage.setItem('token', reposneAT.data.access_token);
      const userProfile = await axios({
        method: 'get',
        url: `${AppConst.SERVER.API}/me?${queryString.stringify({
          access_token: reposneAT.data.access_token,
        })}`,
      });

      Object.assign(userProfile.data, {
        credential: JSON.parse(userProfile.data.credential),
      });
      setUserData({
        id_token: reposneAT.data.id_token,
        scope: reposneAT.data.scope,
        profile: userProfile.data,
      });
    } catch (error) {
      console.log(error);
      localStorage.removeItem('token');
      history.push('/');
    }
  }

  useEffect(() => {
    getSource();
  }, []);
  return (
    <div className="info-user">
      <h2>User Info</h2>
      <section className="list-info-user">
        <div className="content">
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </div>
      </section>
    </div>
  );
}
export default User;
