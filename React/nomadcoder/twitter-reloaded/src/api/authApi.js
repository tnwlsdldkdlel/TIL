import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export async function checkSession() {
    const user = auth.currentUser;

    if (user) {
        const tokenResult = await user.getIdTokenResult();
        const expirationTime = new Date(tokenResult.expirationTime).getTime();
        const currentTime = new Date().getTime();

        // 토큰 만료 시간이 10분 이내로 남아있으면 갱신
        if (expirationTime - currentTime < 10 * 60 * 1000) {
            try {
                await user.getIdToken(true);
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        }

        return true;
    } else {
        return false;
    }
}

export async function userLogin(email, password) {
    await signInWithEmailAndPassword(auth, email, password);
}


export function authSessionCheck(func, onSessionInvalid) {
    return async (...args) => {
        const isSessionValid = await checkSession();
        if (!isSessionValid) {
            onSessionInvalid();
        } else {
            return func(...args);
        }
    };
}
