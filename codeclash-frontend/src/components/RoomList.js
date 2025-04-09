import { useEffect, useState } from 'react';
import { getAllRooms } from '../api/room';

const RoomList = () => {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            const data = await getAllRooms();
            setRooms(data);
        };
        fetchRooms();
    }, []);

    return (
        <div className="container">
            <h2>Available Rooms</h2>
            <ul>
                {rooms.map(room => (
                    <li key={room.id}>{room.name} - {room.code}</li>
                ))}
            </ul>
        </div>
    );
};

export default RoomList;