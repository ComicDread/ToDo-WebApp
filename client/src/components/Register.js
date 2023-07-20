import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import { useState, useEffect } from 'react';
import './components.css';
import { useNavigate } from 'react-router-dom';
import  {gql,useMutation} from '@apollo/client'
import client from '../index'
import userimage from './icons/UserImg.svg'

const CHECK_USER = gql`
  query CheckUserRegistered($_id: ID!) {
    CheckUserRegistered(_id: $_id ){
      _id
    } 
  }
`;

const CHECK_USER_DATA = gql`
  query CheckUser($_id: ID! $password: String!) {
    CheckUser(_id: $_id password:$password) {
      _id
      userName
      email
    }
  }
`;

const CREATE_USER = gql`
  mutation newUser($_id: ID!, $userName: String!, $email:String!, $password:String!) {
    newUser(_id: $_id, userName: $userName, email:$email, password:$password){
      _id
      userName
      email
    }
  }
`;

export default function Login() {
    const navigate = useNavigate();
    const [addUserMutation] = useMutation(CREATE_USER);
    const [username, setUsername] = useState('');
    const [currentUserUid] = useState(null);
    const [currentUserName] = useState(null);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isRegistered, setIsRegistered] = useState(false); 
    const [loggedWithGoogle,setLoggedWithGoogle] = useState(false)
    const [loggedWithLocal,setLoggedWithLocal] = useState(false)
    const userImg = userimage

    useEffect(() => {
      if(currentUserUid !== null){
        console.log('user:' + currentUserUid);
      }else{
        console.log('user:' + currentUserName);
      }
    }, []);

    const handleSuccess = async (credentialResponse) => {
      var decoded = jwt_decode(credentialResponse.credential);      
        setLoggedWithGoogle(true)
        localStorage.setItem('LoggedWithGoogle', JSON.stringify(true));
        localStorage.setItem('currentUser', JSON.stringify(decoded.sub));
        localStorage.setItem('currentUserName', JSON.stringify(decoded.given_name));
        localStorage.setItem('currentUserImg', JSON.stringify(decoded.picture));
        setIsRegistered(true)
        navigate('/');
      
    };
    

    const handleUserData = async () => {
      const _id = email;
      try {
        const { data } = await client.query({
          query: CHECK_USER,
          variables: { _id: _id },
        });
        if (!data.CheckUserRegistered) {
          await addUserMutation({
            variables: {
              _id: _id,
              userName: username,
              email: email,
              password: password,
            },
            update(cache, { data }) {
              const newUserData = {
                _id: data.newUser._id,
                userName: data.newUser.userName,
                email: data.newUser.email,
              };
              const updated = {
                CheckUser: { ...newUserData },
              };
              client.writeQuery({
                query: CHECK_USER_DATA,
                variables: { _id: _id },
                data: updated,
              });
            },
          });
          setLoggedWithLocal(true);
          localStorage.setItem('currentUser', JSON.stringify(_id));
          localStorage.setItem('LoggedWithLocal', JSON.stringify(true));
          localStorage.setItem('currentUserName', JSON.stringify(username));
          localStorage.setItem('currentUserImg', JSON.stringify(userImg));
          navigate('/');
        } else {
          setIsRegistered(true);
        }
      } catch (error) {
        console.log('Error occurred:', error);
        setIsRegistered(true);
      }
    };
    
  
    if (isRegistered) {
      navigate('/Error');
    } else {
      return (
        <div>
          <div className='input-container'>
            <label className='input-label'>Username</label>
            <input
            type='text'
            className='input-field'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
          </div>
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
            <label className='google-label'>O registrati con Google...</label>
          </div>
          <div id="signInButton" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <GoogleOAuthProvider clientId="abc">
              <GoogleLogin onSuccess={handleSuccess} />
            </GoogleOAuthProvider>
          </div>
        </div>
      );
    }    
  }
  