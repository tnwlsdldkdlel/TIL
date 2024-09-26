export const timeAgo = (timestamp) => {
    const now = new Date();
    const seconds = Math.floor((now - new Date(timestamp)) / 1000);

    if (seconds < 60) return `${seconds}초`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}분`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간`;
    return new Date(timestamp).toLocaleDateString();
};
