import { useState } from 'react';
import { loginUser } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    const login = () => {

        if(!username || !password){
            alert("Please Enter All The Details");
            return;
        }

        fetch('http://localhost:8788/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data?.error){
                console.log("Error");
            } else {
                console.log(data)
                setToken(data.accessToken);
                setUsername(data.username);
                localStorage.setItem('Username', data.username);
                sessionStorage.setItem('Authtoken', data.accessToken);
                navigate('/');
            }
        })
        .catch(err => {
            console.log("Fetch error: ", err);
        });

    }



    return (
        <div>
        <Navbar/>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Login</h2>
                <div className="space-y-4">
                    <input 
                        type="username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        placeholder="username" 
                        className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none" 
                    />
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Password" 
                        className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 outline-none" 
                    />
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                        onClick={()=> {login()}}
                    >
                        Login
                    </button>
                </div>
                <p className="text-sm text-center text-gray-600 mt-4">
                    Don't have an account? 
                    <a href="/register" className="text-blue-600 hover:underline ml-1">Register</a>
                </p>
            </div>
        </div>
        </div>
    );
};

export default Login;