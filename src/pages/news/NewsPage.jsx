import axios from "axios";
import { HeatMapOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fromUnixTime, formatRelative } from "date-fns";
import { Alert, Col, Row, Statistic, Layout, Button } from "antd";

import CommentElement from "../../components/CommentElement/CommentElement";

function NewsPage(props) {
  const id = useParams().id.split(":id")[1];
  const [object, setObject] = useState({});
  const [commentsElements, setCommentsElements] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  function getComments(data) {
    setIsLoading(true);
    return new Promise(async function (resolve, reject) {
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        axios
          .get(
            `https://hacker-news.firebaseio.com/v0/item/${data[i]}.json?print=pretty`
          )
          .then((res) => arr.push(res.data))
          .catch((err) => reject(err));
      }
      setTimeout(() => {
        resolve(arr);
      }, 3000);
    });
  }
  function getObjects() {
    axios
      .get(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`)
      .then((res) => {
        setObject(res.data);
        setIsLoading(false);
        return res;
      })
      .then((res) => {
        setObject((prev) => ({
          ...prev,
          time: formatRelative(fromUnixTime(prev.time), new Date()),
        }));
        return res;
      })
      .then((res) => {
        if (res.data.kids) {
          getComments(res.data.kids).then((res) => {
            updateComments(res);
          });
        } else {
          setCommentsElements(
            <Alert
              message="No comments yet."
              type="error"
              style={{ margin: "1em" }}
            />
          );
        }
      })

      .catch((err) => {
        console.error(err);
        navigate("/404");
      });
  }
  function updateComments(arr) {
    setCommentsElements(
      arr.map((obj, index) => {
        return <CommentElement key={obj.id} object={obj} />;
      })
    );
    setIsLoading(false);
  }
  useEffect(() => {
    getObjects();
  }, []);

  const style = { fontSize: "2em", width: "max-content" };
  return (
    <Layout
      className="NewsPage page"
      style={{ display: "flex", alignItems: "center" }}
    >
      <div className="NewsPage-header">
        <div>
          <HeatMapOutlined style={{ fontSize: "2em" }} />
          <h1 className="MainPage-title">Hacker news</h1>
        </div>
        <Link to="/" style={{ color: "white", fontWeight: "600" }}>
          Back to main page
        </Link>
      </div>
      <h2>{object.title}</h2>
      <a href={object.url} style={{ fontWeight: 700, margin: "1em" }}>
        {object.url}
      </a>
      <Row justify="end" gutter={20}>
        <Col span={8}>
          <Statistic
            title="Score:"
            value={object.score}
            suffix="points"
            loading={isLoading}
            valueStyle={style}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Author:"
            value={object.by}
            loading={isLoading}
            valueStyle={style}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Published:"
            value={object.time}
            loading={isLoading}
            valueStyle={style}
          />
        </Col>
      </Row>
      <Button
        style={{ marginTop: "2em" }}
        type="primary"
        size="small"
        loading={isLoading}
        onClick={() => getObjects()}
      >
        Refresh
      </Button>
      <div
        className="comments-items"
        style={{ paddingRight: "1em", paddingLeft: "1em" }}
      >
        {commentsElements}
      </div>
    </Layout>
  );
}
export default NewsPage;
