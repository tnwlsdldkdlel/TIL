const Controller = ({ setCount, count }) => {
  const onClickButton = (e) => {
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
