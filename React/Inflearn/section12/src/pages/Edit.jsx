import { useParams } from "react-router-dom";

const Edit = () => {
  const params = useParams();
  return <div>{params.id}번 일기입니당~</div>;
};

export default Edit;
