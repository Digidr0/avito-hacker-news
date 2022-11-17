import { Col, Row, Statistic, Tag, Layout } from "antd";
import { CaretUpOutlined } from "@ant-design/icons";
import { fromUnixTime, formatRelative } from "date-fns";
import { Link } from "react-router-dom";

// import "./NewsElement.css";

function NewsElement(props) {
  const style = { fontSize: "1em", opacity: 0.6 };
  return (
    <Link to={`/news/:id${props.object.id}`}>
      <Layout className="NewsElement component">
        <Row className="newsElement-title" style={{display: "flex", gap:"1em"}}>
          <span className="newsElement-marker">{props.id + 1}.</span>
          <h4>{props.object.title}</h4>
          <span>({props.object.host})</span>
        </Row>
        <Row gutter={16} className="newsElement-description">
          <Col span={2.5}>
            <Statistic
              groupSeparator="|"
              value={props.object.score}
              valueStyle={style}
              prefix={<CaretUpOutlined />}
              suffix="points"
            />
          </Col>
          <Col span={2.5}>
            <Statistic
              valueStyle={style}
              value={props.object.by}
              prefix="by "
            />
          </Col>
          <Col>
            <Statistic
              valueStyle={style}
              value={formatRelative(
                fromUnixTime(props.object.time),
                new Date()
              )}
            />
          </Col>
          <Col>
            <Tag
              color={props.object.type === "story" ? "blue" : "orange"}
              style={{ borderRadius: "0.3em" }}
            >
              {props.object.type}
            </Tag>
          </Col>
        </Row>
      </Layout>
    </Link>
  );
}
export default NewsElement;
