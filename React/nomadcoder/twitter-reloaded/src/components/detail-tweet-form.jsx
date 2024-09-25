import "./detail-tweet-form.css";

export default function DetailTweetForm({ ...data }) {
  return (
    <div className="detail-tweet-form scrollable">
      {data.photo ? <img className="img" src={data.photo} /> : null}
      <div className="content">{data.tweet}</div>
    </div>
  );
}
