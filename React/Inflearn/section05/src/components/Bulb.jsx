import { useState } from "react";

const Bulb = () => {
  const [light, setLight] = useState("OFF");

  const onClickButton2 = () => {
    setLight(light == "OFF" ? "ON" : "OFF");
  };

  return (
    <div>
      {light == "ON" ? (
        <h1 style={{ backgroundColor: "orange" }}>ON</h1>
      ) : (
        <h1 style={{ backgroundColor: "gray" }}>OFF</h1>
      )}
      <h1>{light}</h1>
      <button onClick={onClickButton2}>전구 끄기/켜기</button>
    </div>
  );
};

export default Bulb;
