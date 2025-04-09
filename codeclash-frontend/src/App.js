import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import RoomList from './components/RoomList';
import Profile from './components/Profile';
import HomePage from './components/HomePage'
import Navbar from './components/Navbar';
import CreateRoom from './components/CreateRoom';
import WaitingRoom from './components/WaitingRoom';
import JoinPage from './components/JoinPage';
import WatingRoomForJoinPlayers from './components/WaitingRoomForJoinPlayers';



const App = () => {
    return (
        <div>
        <BrowserRouter>
            <div>
            <Routes>
                <Route path="/" element={<HomePage />}/>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/rooms" element={<RoomList />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/createroom" element={<CreateRoom/>}></Route>
                <Route path="/waitingroom/:roomCode" element ={<WaitingRoom/>}></Route>
                <Route path="/joinroom" element={<JoinPage/>}></Route>
                <Route path="/waitingroomjoin" element={<WatingRoomForJoinPlayers/>}></Route>
                <Route path="/waiting-room" element={<WaitingRoom />} />


            </Routes>
            </div>    
        </BrowserRouter>
            </div>
    );
};

export default App;