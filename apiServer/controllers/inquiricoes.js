var Inquiricao = require('../models/inquiricao');

module.exports.list = () => {
    return Inquiricao
        .find()
        .sort({_id: 1})
        .exec();
}
