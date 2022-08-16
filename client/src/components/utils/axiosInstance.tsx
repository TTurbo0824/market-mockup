import axios from 'axios';
import jwt_decode from 'jwt-decode';
import dayjs from 'dayjs';

const baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;

let authTokens: any = null;

if (localStorage.getItem('UserStore')) {
  authTokens = localStorage.getItem('UserStore');
  authTokens = JSON.parse(authTokens);
  authTokens = authTokens.userInfo;
}

const axiosInstance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(async (req) => {
  if (authTokens.token) {
    let { token } = authTokens;
    const { refreshToken } = authTokens;

    const access: any = jwt_decode(token);
    const isExpired = dayjs.unix(access.exp).diff(dayjs()) < 1;

    const refresh: any = jwt_decode(refreshToken);
    const isExpiredR = dayjs.unix(refresh.exp).diff(dayjs()) < 1;

    if (isExpired && !isExpiredR) {
      const response = await axios.post(`${baseURL}/refresh-token`, {
        refreshToken,
      });

      if (response.data.data) {
        localStorage.setItem(
          'UserStore',
          JSON.stringify({
            userType: response.data.data.isAdmin ? 'admin' : 'user',
            userInfo: response.data.data,
          }),
        );
        token = response.data.data.token;
      }
      window.location.reload();
    }

    req.headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    return req;
  }

  return req;
});

export default axiosInstance;
