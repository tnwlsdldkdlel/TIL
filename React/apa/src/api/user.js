import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

export const join = async (input) => {
    const credentials = await createUserWithEmailAndPassword(
        auth,
        input.email,
        input.password
    );

    await updateProfile(credentials.user, { displayName: input.nickname });
}

export const login = async (input) => {
    const userCredential = await signInWithEmailAndPassword(auth, input.email, input.password);
    return userCredential.user;
}

export const logout = async () => {
    await auth.signOut();
}