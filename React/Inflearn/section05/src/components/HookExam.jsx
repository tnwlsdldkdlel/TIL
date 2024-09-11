import { useState } from "react";
import useInput1 from "./hooks/useInput1";

const HookExam = () => {
  const [input, onChange] = useInput1();
  return <div>hookexam</div>;
};

export default HookExam;
