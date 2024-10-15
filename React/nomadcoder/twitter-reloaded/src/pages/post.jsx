import { useState } from "react";
import PostTweetForm from "../components/tweet/edit/post-tweet-form";
import { auth, db, storage } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./post.css";
import SnackBar from "../components/common/snack-bar";
import BackDrop from "../components/common/loading";
import ImageSlider from "../components/common/image-slider";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

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
      const doc = await addDoc(collection(db, "tweets"), {
        tweet: input.tweet,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        userId: user.uid,
      });

      if (images.length > 0) {
        images.forEach(async (image) => {
          // storage 추가
          const uuid = uuidv4();
          const locationRef = ref(storage, `tweets/${doc.id}/${uuid}`);
          const result = await uploadBytes(locationRef, image);
          const url = await getDownloadURL(result.ref);

          // db 추가
          await addDoc(collection(db, "images"), {
            tweetId: doc.id,
            url: url,
            createdAt: Date.now(),
          });
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
        <ImageSlider
          images={images}
          clieckRemoveImage={clieckRemoveImage}
          isEdit={true}
        ></ImageSlider>
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
