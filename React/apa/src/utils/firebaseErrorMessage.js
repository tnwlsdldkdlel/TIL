export function FirebaseErrorMessage(error) {
    switch (error.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
            return "이메일 혹은 비밀번호가 유효하지 않습니다.";
        case "auth/email-already-in-use":
            return "이미 사용 중인 이메일입니다.";
        case "auth/weak-password":
            return "비밀번호는 6글자입니다.";
        case "auth/network-request-failed":
            return "네트워크 오류 입니다.";
        case "auth/invalid-email":
            return "잘못된 이메일 형식입니다.";
        case "auth/internal-error":
            return "잘못된 요청입니다.";
        default:
            return "로그인에 실패 했습니다.";
    }
}
