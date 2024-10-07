export function FirebaseErrorMessage(error) {
    switch (error.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
            return "🙅‍♀️ 이메일 혹은 비밀번호를 다시 확인해주세요.";
        case "auth/email-already-in-use":
            return "🙅‍♀️ 이미 사용 중인 이메일이에요.";
        case "auth/weak-password":
            return "🙅‍♀️ 비밀번호는 6글자 이상으로 입력해주세요.";
        case "auth/network-request-failed":
            return "🙅‍♀️ 네트워크 연결이 안돼요.";
        case "auth/invalid-email":
            return "🙅‍♀️ 잘못된 이메일 형식이에요.";
        case "auth/internal-error":
            return "🙅‍♀️ 잘못된 요청이에요.";
        default:
            return "🙅‍♀️ 로그인에 실패 했어요.";
    }
}
