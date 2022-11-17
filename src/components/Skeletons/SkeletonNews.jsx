import { Skeleton } from "antd";
function SkeletonNews(props) {
  let elements = [];
  for (let i = 0; i < 50; i++) {
    elements.push(
      <div style={{ marginTop: "1em" }} key={i}>
        <Skeleton round={true} paragraph={{rows: 3}} active />
      </div>
    );
  }
  return <div className="SkeletonNews component">{elements}</div>;
}
export default SkeletonNews;
