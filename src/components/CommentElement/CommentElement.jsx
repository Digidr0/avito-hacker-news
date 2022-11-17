import parse from "react-html-parser";
import axios from "axios";
import { Comment, Skeleton } from "antd";
import { useState } from "react";
import { fromUnixTime, formatRelative } from "date-fns";
import { UserOutlined } from "@ant-design/icons";
import { Button } from "antd";

function CommentElement(props) {
  const [children, setChildren] = useState(null);
  const actions = [
    <Button
      key="comment-basic-reply-to"
      type="secondary"
      
      onClick={() => {
        getChildren(props.object.kids);
      }}
    >
      see replies
    </Button>,
  ];

  function getChildren(data) {
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
      setChildren(
        arr.map((object, index) => {
          return (
            <Comment
              key={index}
              style={{ width: "100%", padding: "0.5em" }}
              author={<a>{object.by}</a>}
              content={<div>{parse(object.text)}</div>}
              datetime={formatRelative(fromUnixTime(object.time), new Date())}
            ></Comment>
          );
        })
      );
    }, 500);
  }

  return (
    <Comment
      style={{
        width: "100%",
        marginTop: "0.5em",
        padding: "0.5em",
        boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
        borderRadius: "0.5em",
      }}
      avatar={
        <UserOutlined
          style={{
            border: "1px solid black",
            borderRadius: "50%",
            overflow: "hidden",
            opacity:0.5
          }}
        />
      }
      author={<a>{props.object.by}</a>}
      content={<div>{parse(props.object.text)}</div>}
      datetime={formatRelative(fromUnixTime(props.object.time), new Date())}
      actions={props.object.kids ? actions : []}
    >
      {children}
    </Comment>
  );
}
export default CommentElement;
