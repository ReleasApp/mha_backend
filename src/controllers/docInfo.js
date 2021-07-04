const DocInfo = require('../models/docInfo');
const cloudinary = require('../config/cloudinary');

// Create a new docInfo
exports.addNewDocInfo = async (req, res) => {
    let newDocInfo = new DocInfo(req.body);
    newDocInfo.title = newDocInfo.title.trim();
    newDocInfo.category = newDocInfo.category.toLowerCase();
    // const result = await cloudinary.uploader.upload(req.file.path, {quality: 60});
    const result = await cloudinary.uploader.upload("data:image/jpg;base64," + req.body.docInfoImage, {quality: 60});
    newDocInfo.infoImage = result.secure_url;
    newDocInfo.infoImageId = result.public_id;
    newDocInfo.author = req.user._id;

    await newDocInfo.save((err, info) => {
        if (err) {
            console.log(err)
            res.status(404).json({message: 'Failed to save the info'});
        }
        res.status(201).json({message: "Info saved successfuly", info });
    });
};

// Return all information
exports.getDocInfos = (req, res) => {
    const categoryToSearch = req.params.category.toLowerCase();
    DocInfo.find({category: categoryToSearch}, (err, docInfos) => {
        if (err) {
            res.status(404).json({message: 'Failed to find all info'});
        }
        res.status(200).json(docInfos);
    }).populate('author');
};

// search by Doctor
exports.searchDocInfoByDoc = (req, res) => {
    DocInfo.find({})
}

// Delete a Info
exports.deleteDocInfo = async (req, res) => {
    try {
        await DocInfo.findByIdAndDelete({_id: req.params.docInfoId});
    } catch (error) {
        res.status(401).json({message: error.message});
    }
}