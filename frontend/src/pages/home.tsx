import reactLogo from "../assets/react.svg";
import {NavLink} from "react-router";

function Home() {
  return (
    <div className="main-page">
      <img src={reactLogo} className="logo" alt="React logo" />
      <div className="main-page__grid">
        <NavLink to="1" className="main-page__button">Room 1</NavLink>
        <NavLink to="2" className="main-page__button">Room 2</NavLink>
        <NavLink to="3" className="main-page__button">Room 3</NavLink>
        <NavLink to="4" className="main-page__button">Room 4</NavLink>
      </div>
    </div>
  );
}

export default Home;
