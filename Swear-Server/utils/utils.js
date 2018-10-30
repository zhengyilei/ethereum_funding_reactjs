function getClientIp (req) {

    return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
        req.connection.remoteAddress || // 判断 connection 的远程 IP
        req.socket.remoteAddress || // 判断后端的 socket 的 IP
        req.connection.socket.remoteAddress;

    var ipAddress;
    var forwardIpStr = req.headers['x-forwarded-for'];
    if (forwardIpStr) {
        var forwardIp = forwardIpStr.split(',');
        ipAddress = forwardIp[0];
    }
    if (!ipAddress) {
        ipAddress = req.connection.remoteAdress;
    }
    if (!ipAddress) {
        ipAddress = req.socket.remoteAdress;
    }
    if (!ipAddress) {
        if (req.connection.socket) {
            ipAddress = req.connection.socket.remoteAdress;
        }
        else if (req.headers['remote_addr']) {
            ipAddress = req.headers['remote_addr'];
        }
        else if (req.headers['client_ip']) {
            ipAddress = req.headers['client_ip'];
        }
        else {
            ipAddress = req.ip;
        }

    }

    return ipAddress;
}
const intArr = length => [...Array(length).keys()];

function getSeed() {
    // f(x) = -(x-1)^4+1 , f(x) = -abs((x-1)^3)+1
    return - Math.pow((Math.random() - 1), 4) + 1;

    // return Math.sin(Math.random() * 90 * (2 * Math.PI / 360));
}

const randomNumbers = (length, limit) => {
    let nums = intArr(length), ranNums = [], i = nums.length, j = 0;

    while (i-- && ranNums.length < limit) {
        j = Math.floor(getSeed() * (i+1));
        ranNums.push(nums[j]);
        nums.splice(j,1);
    }
    return ranNums;
};

module.exports = {
    getClientIp,
    randomNumbers
};