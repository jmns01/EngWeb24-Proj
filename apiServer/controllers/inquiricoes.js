var Inquiricao = require('../models/inquiricao');

module.exports.list = () => {
    return Inquiricao
        .find()
        .sort({_id: 1})
        .exec();
}

module.exports.listPage = (limit, skip) => {
    return Inquiricao
        .find()
        .sort({UnitTitle: 1})
        .skip(skip)
        .limit(limit)
        .exec();
}
