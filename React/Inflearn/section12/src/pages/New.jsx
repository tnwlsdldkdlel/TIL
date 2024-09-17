import Button from "../components/Button";
import Header from "../components/Header";
import Edit from "./Edit";

const New = () => {
  return (
    <div>
      <Header
        title={"새 일기 쓰기"}
        leftChild={<Button text={"< 뒤로 가기"} />}
      />
      <Edit />
    </div>
  );
};

export default New;
