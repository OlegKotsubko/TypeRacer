import {useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";
import {useParams} from "react-router";
import Form from '../components/Form/index'
import log from '../helpers/log'
import Diagrams from "../components/Diagrams";

const fetchText = async function(id: string) {
  const url = `http://localhost:3000/${id}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    return await response.json()
  } catch (error:any) {
    console.error(error.message);
  }
}

function Room() {
  const socket: Socket = io("ws://localhost:3000", { transports: ["websocket"] });

  const { roomId, userName } = useParams();
  const [text, setText] = useState<string>('');

  useEffect(() => {
    socket.connect();

    if (userName && roomId) {
      socket.emit('connect-to-room', {user: userName, room: Number(roomId)});
    }

    return () => {
      if (socket.connected) {
        socket.emit('disconnect-from-room', {user: userName, room: Number(roomId)});
        socket.disconnect();
      }
    }
  }, [userName, roomId])

  useEffect(() => {
    socket.on("connect", () => {
      log('socket.io is connected');
    });
    socket.on("disconnect", () => {
      log('socket.io is disconnected');
    });
  }, [])

  useEffect(() => {
    fetchText(String(roomId)).then((res) => setText(res))
  }, [roomId])


  return (
    <div className="container">
      <h1>Room</h1>
      <Diagrams socket={socket} />
      <Form socket={socket} fetchedText={text} />
    </div>
  );
}

export default Room;
