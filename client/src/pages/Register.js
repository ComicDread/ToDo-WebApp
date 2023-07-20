import './Login.css'
import Register from '../components/Register.js'
import { useNavigate } from 'react-router-dom';

export default function RegisterPage(){
    const navigate = useNavigate();
    function NavigateTo() {
        navigate('/login');
    }
    return(
        <main className='registerpage'>
            <div>
                <h1>Nice to meet you!😺</h1>
                <h2>Register now 👻</h2>
                <Register/>
                <div>
                <h4 className='joinus'>Go back to<a href="#" className='redirectRegister' onClick={NavigateTo}> Login Page</a></h4>
            </div>
            </div>
        </main>

    )
}