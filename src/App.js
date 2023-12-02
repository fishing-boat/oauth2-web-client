import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const App = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [authStatus, setAuthStatus] = useState('pending'); // 인증 상태: 'pending', 'success', 'error'

  const [response, setResponse] = useState({
    token: {
      accessToken: '',
      refreshToken: '',
    },
    user: {
      id: '',
      email: '',
      displayName: '',
      role: '',
    },
  });

  const authenticate = async () => {
    const code = searchParams.get('code');
    axios
      .post('https://4ce2eof4f3.execute-api.ap-northeast-2.amazonaws.com/api/v1/auth', { code })
      .then((response) => {
        console.log('Server response:', response.data);
        setResponse(response.data);
        setAuthStatus('success'); // 인증 성공 시 상태를 'success'로 설정
      })
      .catch((error) => {
        console.error('Error sending code to the server:', error);
        setAuthStatus('error'); // 에러 발생 시 상태를 'error'로 설정
      });
  };

  useEffect(() => {
    authenticate();
  }, []);

  return (
    <div>
      {authStatus === 'pending' && <p>인증 중...</p>}
      {authStatus === 'success' && (
        <>
          <p>인증 성공!</p>
          <p>accessToken: {response.token.accessToken}</p>
          <p>refreshToken: {response.token.refreshToken}</p>
          <p>id: {response.user.id}</p>
          <p>email: {response.user.email}</p>
          <p>displayName: {response.user.displayName}</p>
          <p>role: {response.user.role}</p>
        </>
      )}
      {authStatus === 'error' && <p>인증 실패. 다시 시도해주세요.</p>}
    </div>
  );
};

export default App;
