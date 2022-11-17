import { Button } from "antd";
import { Link } from "react-router-dom";

function NotFound(props) {
  return (
    <>
      <div
        className="NotFound component"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          translate: "-50% -50%",
          fontSize: "2em",
        }}
      >
        <h1>Page not found or incorrect news id</h1>
          <Link to="/">To main page</Link>
      </div>
    </>
  );
}
export default NotFound;
