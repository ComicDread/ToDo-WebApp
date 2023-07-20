import './Login.css'
import Login from '../components/Login'
import { useNavigate } from 'react-router-dom';

export default function LoginPage(){
    const navigate = useNavigate();
    function NavigateTo(){
        navigate('/Register')
    }
    return(
        <main className='loginpage'>
            <div>
                <h1>Welcome back😺</h1>
                <h2>Enter your credentials🔓</h2>
                <Login />
            </div>
            <div>
                <h4 className='joinus'>Not registered yet? <a href="#" className='redirectRegister' onClick={NavigateTo}>Join us now!</a></h4>
            </div>
        </main>
    )
}
