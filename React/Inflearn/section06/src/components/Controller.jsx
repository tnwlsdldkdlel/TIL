const Controller = ({ setCount, count }) => {
  const onClickButton = (e) => {
    console.log(count);
    console.log(e.target.value);
    setCount(count + Number(e.target.value));
  };

  return (
    <div>
      <button onClick={onClickButton} value={-1}>
        -1
      </button>
      <button onClick={onClickButton} value={-10}>
        -10
      </button>
      <button onClick={onClickButton} value={-100}>
        -100
      </button>
      <button onClick={onClickButton} value={100}>
        +100
      </button>
      <button onClick={onClickButton} value={10}>
        +10
      </button>
      <button onClick={onClickButton} value={1}>
        +1
      </button>
    </div>
  );
};

export default Controller;
