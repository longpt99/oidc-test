import queryString from 'query-string';
import { useEffect } from 'react';
import axios from 'axios';
import { AppConst } from '../../app.const';
import { useState } from 'react';

function User() {
  const { code } = queryString.parse(window.location.search);
  const [userData, setUserData] = useState({});
  const [tokenData, setTokenData] = useState({});

  async function getSource() {
    try {
      console.log(1);

      const data = await axios({
        method: 'post',
        url: `${AppConst.SERVER.API}/token`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: queryString.stringify({
          client_id: AppConst.ODIC.CLIENT_ID,
          client_secret: AppConst.ODIC.CLIENT_SECRET,
          redirect_uri: 'http://localhost:3000/user',
          grant_type: 'authorization_code',
          code: code,
        }),
      });
      const userProfile = await axios({
        method: 'get',
        url: `${AppConst.SERVER.API}/me?${queryString.stringify({
          access_token: data.data.access_token,
          // fields: ['id', 'email'].join(','),
        })}`,
      });

      setTokenData(data.data);
      setUserData(userProfile.data);
    } catch (error) {
      console.log(error.response);
    }
  }

  useEffect(() => {
    getSource();
    // { access_token, expires_in, token_type, refresh_token }
    // return data.access_token;
  }, []);

  return (
    <>
      <h1>User Info</h1>
      <section>
        <h2>Token</h2>
        <div>{JSON.stringify(tokenData, null, 2)}</div>
      </section>
      <section>
        <h2>User Profile</h2>
        <div>{JSON.stringify(userData, null, 2)}</div>
      </section>
    </>
  );
}
export default User;
