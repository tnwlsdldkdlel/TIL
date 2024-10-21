import { storage, auth } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export async function setProfileImg(target) {
    const { files } = target;
    const loginedUser = auth.currentUser;
    const loginedUserUid = loginedUser.uid;

    if (files && files.length === 1) {
        const file = files[0];
        const locationRef = ref(storage, `avatars/${loginedUserUid}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);

        return url;
    }
}