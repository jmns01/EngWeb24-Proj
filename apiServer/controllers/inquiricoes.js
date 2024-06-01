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

module.exports.listByName = (name, limit, skip) => {
    return Inquiricao
        .find({UnitTitle: { $regex: `^${name}`, $options: 'i' }})
        .sort({UnitTitle: 1})
        .skip(skip)
        .limit(limit)
        .exec();
}

module.exports.listByLocal = (local, limit, skip) => {
    return Inquiricao
        .find({CountryCode: { $regex: `^${local}`, $options: 'i' }})
        .sort({UnitTitle: 1})
        .skip(skip)
        .limit(limit)
        .exec();
}

module.exports.listByDate = (date, limit, skip) => {
    return Inquiricao
        .find({UnitDateInitial: { $regex: `^${date}`, $options: 'i' }})
        .sort({UnitTitle: 1})
        .skip(skip)
        .limit(limit)
        .exec();
}