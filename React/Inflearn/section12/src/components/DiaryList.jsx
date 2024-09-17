import { useState } from "react";
import Button from "./Button";
import DiaryItem from "./DiaryItem";
import "./DiaryList.css";
import { useNavigate } from "react-router-dom";

const DiaryList = ({ data }) => {
  const nav = useNavigate();
  const [sortType, setSortType] = useState("latest");

  const onChangeSort = (e) => {
    setSortType(e.target.value);
    getSortedData();
  };

  const getSortedData = () => {
    switch (sortType) {
      case "latest":
        data.sort((a, b) => b.id - a.id);
        break;

      case "oldest":
        data.sort((a, b) => a.id - b.id);
        break;
    }
  };

  return (
    <div className="DiaryList">
      <div className="menu_bar">
        <select onChange={onChangeSort}>
          <option value={"latest"}>최신순</option>
          <option value={"oldest"}>오래된 순</option>
        </select>
        <Button
          text={"새 일기 쓰기"}
          type={"POSITIVE"}
          onClick={() => nav("/new")}
        />
      </div>
      <div className="list_wrapper">
        {data.map((item) => (
          <DiaryItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};

export default DiaryList;
