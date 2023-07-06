
const sendSuccessRes = (res, data) => {
    res.status(200);
    res.setHeader("Content-Type", "application/json");
    res.json(data);
    res.end();
};
const sendFailedRes = (res, err) => {
    res.status(400);
    res.setHeader("Content-Type", "application/json");
    res.json(err.message);
    res.end();
};

module.exports = { sendSuccessRes, sendFailedRes };