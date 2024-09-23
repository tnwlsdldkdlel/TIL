import "./tweet.css";

export default function Tweet({ ...data }) {
  return (
    <div className="tweet">
      <div className="column">
        <span className="name">{data.username}</span>
        <p className="payload">{data.tweet}</p>
      </div>
      {data.photo ? <img className="photo" src={data.photo} /> : null}
    </div>
  );
}
