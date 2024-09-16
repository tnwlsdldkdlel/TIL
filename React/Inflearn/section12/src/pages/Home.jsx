import Header from "../components/Header";
import Button from "../components/Button";
import DiaryList from "../components/DiaryList";

const Home = () => {
  return (
    <div>
      <Header
        title={"2024년 09월"}
        leftChild={<Button text={"<"} />}
        rightChild={<Button text={">"} />}
      />
      <DiaryList></DiaryList>
    </div>
  );
};

export default Home;
