import "./Header.css";

const Header = () => {
  const today = new Date();

  return (
    <div className="header">
      <h3>오늘은 📅</h3>
      <h1>{today.toDateString()}</h1>
    </div>
  );
};

export default Header;
