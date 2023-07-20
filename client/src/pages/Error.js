


import './Login.css'
import { useNavigate } from 'react-router-dom';



export default function LoginPage(){
    const navigate = useNavigate();
    function NavigateTo(){
        navigate('/Login')
    }
    return (
        <main className='errpage'>
          <div>
            <h1>🧐Mhh...</h1>
            <h2>This account seems to be registered already</h2>
            <h2>Move to <a href="#" className='redirectRegister' onClick={NavigateTo}>Login Page!</a></h2>
          </div>
        </main>
      );
}