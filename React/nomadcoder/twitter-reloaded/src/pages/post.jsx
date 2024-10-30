import { useState } from "react";
import PostTweetForm from "../components/tweet/edit/post-tweet-form";
import { auth } from "../firebase";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./post.css";
import SnackBar from "../components/common/snack-bar";
import BackDrop from "../components/common/loading";
import ImageSlider from "../components/common/image-slider";
import { useNavigate } from "react-router-dom";
import { addTweet, addTweetImage } from "../api/tweetApi";
import { uploadTweetImage } from "../storage/tweetStorage";

export default function Post() {
  const [input, setInput] = useState({});
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    setLoading(true);

    e.preventDefault();
    const user = auth.currentUser;
    if (
      !user ||
      input.tweet === "" ||
      input.tweet.length > input.tweet.maxLength
    )
      return;

    try {
      const doc = await addTweet(input);

      if (images.length > 0) {
        await uploadTweetImage(images, doc.id).then((uploadImages) => {
          addTweetImage(doc, uploadImages);
        });
      }

      setInput({ tweet: "" });
      setImages([]);

      setResult("succeess");
      setMessage("포스팅 성공!");

      navigate("/");
    } catch (error) {
      console.log(error);
      setResult("fail");
      setMessage("내용을 다시 확인해 주세요!");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    if (name === "file") {
      setLoading(true);

      if (e.target.files.length > 0) {
        if (e.target.files.length <= 5) {
          for (let i = 0; i < e.target.files.length; i++) {
            const file = e.target.files[i];
            setImages((prev) => [...prev, file]);
          }
        } else {
          setResult("fail");
          setMessage("최대 5장까지만 업로드할 수 있어요!");
        }
      }

      setLoading(false);
    } else {
      setInput({ ...input, [name]: value });
    }
  };

  const clieckRemoveImage = (index) => {
    const newImages = images.filter((item, itemIndex) => itemIndex !== index);
    setImages(newImages);
  };

  return (
    <div className="post">
      {images.length > 0 ? (
        images.length > 1 ? (
          <ImageSlider
            images={images}
            clieckRemoveImage={clieckRemoveImage}
            isEdit={true}
          ></ImageSlider>
        ) : (
          <div className="single-image">
            <img src={URL.createObjectURL(images[0])} />
          </div>
        )
      ) : null}
      <PostTweetForm
        {...input}
        onChange={onChange}
        onSubmit={onSubmit}
      ></PostTweetForm>
      <SnackBar message={message} result={result}></SnackBar>
      <BackDrop isLoading={isLoading}></BackDrop>
    </div>
  );
}
