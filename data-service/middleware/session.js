const checkSess = (req, res, next) => {
    console.log('req', req.session)
    //if (req.session.key) {
        next();
    //    res.end(req.session.key);
    //} else {
        //res.status(401).send('unauthorized');
    //}
};

module.exports = checkSess;