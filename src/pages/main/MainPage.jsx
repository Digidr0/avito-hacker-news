import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Layout, Space, Radio } from "antd";
import { SyncOutlined, HeatMapOutlined } from "@ant-design/icons";

import SkeletonNews from "../../components/Skeletons/SkeletonNews";
import NewsElement from "../../components/NewsElement/NewsElement";
import { Footer } from "antd/lib/layout/layout";
function MainPage(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [newsElements, setNewsElements] = useState(<SkeletonNews />);
  const [numberOfItems, setNumberOfItems] = useState(100);
  const [filter, setFilter] = useState(0);
  const getNewsIDs = new Promise(function (resolve, reject) {
    //get top 500 news id's list
    axios
      .get("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty")
      .then((res) => {
        resolve(res.data.slice(0, numberOfItems));
      })
      .catch((err) => reject(err));
  });

  function getNewsItems(array) {
    return new Promise(async function (resolve, reject) {
      let arr = [];
      for (let i = 0; i < array.length; i++) {
        axios
          .get(
            `https://hacker-news.firebaseio.com/v0/item/${array[i]}.json?print=pretty`
          )
          .then((res) => {
            res.data.host = new URL(res.data.url, location).host;
            arr.push(res.data);
          })
          .catch((err) => reject(err));
      }
      setTimeout(() => {
        arr.sort(function (a, b) {
          switch (filter) {
            case 0:
              return b.time - a.time;
            case 1:
              return b.score - a.score;
            case 2:
              return a.type.localeCompare(b.type);
            default:
              return b.time - a.time;
          }
        });
        resolve(arr);
      }, 3000);
    });
  }
  function updateNewsElements(arr) {
    setNewsElements(
      arr.map((obj, index) => {
        return <NewsElement object={obj} key={obj.id} id={index} />;
      })
    );
    setIsLoading(false);
  }
  async function updateList() {
    setIsLoading(true);
    getNewsIDs
      .then((result) => getNewsItems(result))
      .then((result) => updateNewsElements(result));
  }

  useEffect(() => {
    updateList();
    setInterval(() => {
      console.count("List updated");
    }, 60000);
  }, []);

  useEffect(() => {
    updateList();
  }, [filter]);

  return (
    <Layout className="MainPage page">
      <div className="MainPage-header">
        <div>
          <HeatMapOutlined style={{ fontSize: "2em" }} />
          <h1 className="MainPage-title">Hacker news</h1>
        </div>
        <Space style={{ justifyContent: "center" }}>
          <Radio.Group
            onChange={(e) => {
              setFilter(e.target.value);
            }}
            defaultValue={0}
            buttonStyle="solid"
          >
            <Radio.Button value={0} disabled={isLoading}>
              sort by time
            </Radio.Button>
            <Radio.Button value={1} disabled={isLoading}>
              sort by points
            </Radio.Button>
            <Radio.Button value={2} disabled={isLoading}>
              sort by tag
            </Radio.Button>
          </Radio.Group>
        </Space>
        <Space>
          <span style={{ fontSize: "1.5em", margin: "1em" }}>Refresh news</span>
          <Button
            type="primary"
            shape="circle"
            disabled={isLoading}
            icon={
              <SyncOutlined spin={isLoading} style={{ fontSize: "1.3em" }} />
            }
            onClick={() => {
              updateList();
            }}
          ></Button>
        </Space>
      </div>
      <div className="news-items">{newsElements}</div>
      <Footer
        style={{
          width: "100%",
          backgroundColor: "#0001",
          borderTop:"2px solid #0002",
          padding:"0.5em",
          display: "flex",
          justifyContent: "center"
        }}
      >
        <a style={{ fontSize: "1.2em" }} href="https://github.com/Digidr0">
          Digidro 2022
        </a>
      </Footer>
    </Layout>
  );
}
export default MainPage;
