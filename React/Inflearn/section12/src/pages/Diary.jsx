import { useParams } from "react-router-dom";

const Diary = () => {
  const params = useParams();
  console.log(params);

  return (
    <div>
      <div>Diary</div>
      <div>{params.id}</div>
    </div>
  );
};

export default Diary;
