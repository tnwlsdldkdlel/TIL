import { memo, useState } from "react";
import "../edit/post-tweet-form.css";
import { auth, db, storage } from "../../../firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import ImageSlider from "../../common/image-slider";
import PostTweetForm from "./post-tweet-form";
import SnackBar from "../../common/snack-bar";
import BackDrop from "../../common/loading";
import { v4 as uuidv4 } from "uuid";

function EditTweetForm({ handleClose, tweet, prevImages, id }) {
  const [isLoading, setLoading] = useState(false);
  const [input, setInput] = useState(tweet);
  const [images, setImages] = useState(prevImages);
  const [removeImgages, setRemoveImages] = useState([]);
  const [addImages, setAddImages] = useState([]);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");

  const onChange = (e) => {
    const name = e.target.name;

    if (name === "file") {
      setLoading(true);

      if (e.target.files.length > 0) {
        if (e.target.files.length <= 5) {
          for (let i = 0; i < e.target.files.length; i++) {
            const file = e.target.files[i];
            setImages((prev) => [...prev, file]);
            setAddImages((prev) => [...prev, file]);
          }
        } else {
          setResult("fail");
          setMessage("최대 5장까지만 업로드할 수 있어요!");
        }
      }

      setLoading(false);
    } else {
      setInput(e.target.value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || input === "" || input.length > input.maxLength)
      return;

    try {
      setLoading(true);

      // 이미지 삭제
      if (removeImgages) {
        removeImgages.forEach(async (image) => {
          // storage 삭제
          const path = decodeURIComponent(image.split("/o/")[1].split("?")[0]);
          const photoRef = ref(storage, path);
          await deleteObject(photoRef);

          // db 삭제
          const imagesQuery = query(
            collection(db, `images`),
            where("tweetId", "==", id),
            where("url", "==", image)
          );

          const querySnapshot = await getDocs(imagesQuery);
          querySnapshot.forEach(async (snapshot) => {
            await deleteDoc(doc(db, "images", snapshot.id));
          });
        });
      }

      // 이미지 추가
      if (addImages) {
        addImages.forEach(async (image) => {
          // storage 추가
          const uuid = uuidv4();
          const locationRef = ref(storage, `tweets/${id}/${uuid}`);
          const result = await uploadBytes(locationRef, image);
          const url = await getDownloadURL(result.ref);

          // db 추가
          await addDoc(collection(db, "images"), {
            tweetId: id,
            url: url,
            createdAt: Date.now(),
          });
        });
      }

      // 내용 수정
      const docRef = doc(db, "tweets", id);
      await updateDoc(docRef, {
        tweet: input,
        updatedAt: Date.now(),
      });

      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const clieckRemoveImage = (index) => {
    // 이미 업로드된 사진만 담는다.
    if (typeof images[index] === "string") {
      setRemoveImages((prev) => [...prev, images[index]]);
    }

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
        tweet={input}
        onChange={onChange}
        onSubmit={onSubmit}
      ></PostTweetForm>
      <SnackBar message={message} result={result}></SnackBar>
      <BackDrop isLoading={isLoading}></BackDrop>
    </div>
  );
}

export default memo(EditTweetForm);
