// 时间戳转义
const formatTime = (timestamp) => {
    let date = new Date(Number(timestamp));
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let fDate = [year, month, day,].map(formatNumber);
    return `${fDate[0]}年${fDate[1]}月${fDate[2]}日 `.concat([hour, minute, second].map(formatNumber).join(':'))
};
/** 小于10的数字前面加0 */
const formatNumber = (n) => {
    n = n.toString();
    return n[1] ? n : '0' + n
};

export {
    formatTime
};