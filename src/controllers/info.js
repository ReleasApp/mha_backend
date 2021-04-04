const Info = require('../models/info');

// Create a new link
exports.addNewInfo = async (req, res) => {
    let newInfo = new Info(req.body);
    newInfo.category = req.body.category.toLowerCase();
    newInfo.link = req.body.link.toLowerCase();
    newInfo.author = req.user._id;
    await newInfo.save((err, info) => {
        if (err) {
            console.log(err)
            res.status(404).send(err);
        }
        res.status(201).json(info);
    });
};

// Return all information
exports.getInfos = (req, res) => {
    const categoryToSearch = req.params.category.toLowerCase();
    Info.find({category: categoryToSearch}, (err, infos) => {
        if (err) {
            res.status(404).send(err);
        }
        res.status(200).json(infos);
    }).populate('author');
};

// search by Doctor
exports.searchInfoByDoc = (req, res) => {
    Info.find({})
}

// Delete a Info
exports.deleteInfo = async (req, res) => {
    try {
        await Info.findByIdAndDelete({_id: req.params.infoId});
    } catch (error) {
        res.status(401).send(error.message);
    }
}