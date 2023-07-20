import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import { useState, useEffect } from 'react';
import './components.css';
import { useNavigate } from 'react-router-dom';
import  {gql} from '@apollo/client'
import client from '../index'
import userimage from './icons/UserImg.svg'

const CHECK_USER = gql`
  query CheckUser($_id: ID! $password: String!) {
    CheckUser(_id: $_id password: $password) {
      _id
      userName
      email
    }
  }
`;

export default function Login() {
  const navigate = useNavigate();
  const [currentUserUid] = useState(null);
  const [isUserRegistered, setIsUserRegistered] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const userImg = userimage

  useEffect(() => {
    console.log('user:' + currentUserUid);
  },);

  const handleSuccess = async (credentialResponse) => {
    var decoded = jwt_decode(credentialResponse.credential);
      localStorage.setItem('currentUser', JSON.stringify(decoded.sub));
      localStorage.setItem('currentUserName', JSON.stringify(decoded.given_name));
      localStorage.setItem('currentUserImg', JSON.stringify(decoded.picture));
      localStorage.setItem('LoggedWithGoogle', JSON.stringify(true));
      setIsUserRegistered(true);
      navigate('/');
  };
  

  const handleUserData = async () => {
    const _id = email;
    try {
      const { data } = await client.query({
        query: CHECK_USER,
        variables: { _id, password }
      });
      if (!data.CheckUser) {
        setIsUserRegistered(false);
      } else {
        const userName = data.CheckUser.userName;
        localStorage.setItem('currentUser', JSON.stringify(_id));
        localStorage.setItem('LoggedWithLocal', JSON.stringify(true));
        localStorage.setItem('currentUserName', JSON.stringify(userName));
        localStorage.setItem('currentUserImg', JSON.stringify(userImg));
        setIsUserRegistered(true);
        navigate('/');
      }
    } catch (error) {
      setIsUserRegistered(false);
      console.error('Error fetching data:', error);
    }
  };
  
  
   
  const handleError = () => {
    console.log('Login Failed');
  };

  return (
    <div>
    <div className='input-container'>
      <label className='input-label'>Email</label>
      <input
      type='text'
      className='input-field'
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      />
    </div>
    <div className='input-container'>
      <label className='input-label'>Password</label>
      <input
        type='password'
        className='input-field'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
      <div className='button-container'>
      <button className='submit-button' onClick={handleUserData}>Submit</button>
      </div>
      <div className='center-text'>
        <label className='google-label'>O accedi con Google...</label>
      </div>
      <div id="signInButton" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {isUserRegistered === false && <p style={{ color: 'red', position: 'absolute', top: '9.15em' }}>User not registered</p>}
        <GoogleOAuthProvider clientId="abc">
          <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
  
  
  
}
