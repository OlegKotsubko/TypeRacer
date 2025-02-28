import React, {useCallback, useState} from "react";
import {useParams, useNavigate} from "react-router";

function Prompt() {
  const [userName, setUserName] = useState<string>('');
  const {roomId} = useParams()
  const navigate = useNavigate();

  const submitHandler = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    navigate(`/${roomId}/${userName}`)
    setUserName('')
  }, [userName])

  return (
    <div className="container">
      <h1>Please type your name</h1>
      <form onSubmit={submitHandler} action="">
        <div style={{
          display: "flex",
          gap: '32px'
        }}>
          <input
            className="input"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button type="submit">Setup Name</button>
        </div>
      </form>
    </div>
  );
}

export default Prompt;
