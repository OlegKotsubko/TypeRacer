import {Socket} from "socket.io-client";
import {useState} from "react";

interface User {
  room: number;
  progress: number;
}

type Users = [string, User][];

function Diagrams({socket}:{socket: Socket}) {
  const [users, setUsers] = useState<Users>([]);

  socket.on("users-in-room", (data: Users) => setUsers(data))

  return (
    <div className="progress">
      <div className="progress__grid">
        {users.map(([name, {progress}], index) => (
          <div className="progress__item" key={index}>
            <div className="progress__copyright progress__copyright--start">Start</div>
            <div className="progress__user">{name}</div>
            <div className="progress__bar red" style={{width:`${progress}%`}}></div>
            <div className="progress__copyright progress__copyright--finish">Finish</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Diagrams
