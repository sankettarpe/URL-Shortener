const url = require('../models/Url');
const { nanoid } = require('nanoid');

const createShortUrl = async (req, res) =>{ 
    try{
        const { originalUrl} = req.body;
        if(!originalUrl){
            return res.status(400).json({message : "Please provide the original URL"});
        }
        try{
            new URL(originalUrl); //
        } catch(error){
            return res.status(400).json({message : "Invalid URL"});
        }

        let shortUrl = nanoid(8);
        let exists = true
        while(exists){
            const existingUrl = await url.findOne({ shortUrl });
            if(existingUrl){
                shortUrl = nanoid(8);
            } else {
                exists = false;
            }
        }
        const newUrl = await url.create({   // Create a new URL document in the database
            originalUrl,
            shortUrl,
            user : req.user._id,
        });
        res.status(201).json(newUrl); 
    }
    catch(error){
        res.status(500).json({message : error.message})
    }

}

const redirectToOriginalUrl = async (req, res) =>{
    try{
        const {shortUrl} = req.params;
        const Url = await url.findOne({shortUrl});
        if(!Url || Url.isDeleted){
            return res.status(404).json({message : "URL not found"});
        }
        Url.clicks += 1;
        await Url.save();
        return res.redirect(Url.originalUrl); 
    } 
    catch(error){
        return res.status(500).json({message : error.message});
    }
}

const getUserUrls = async (req, res) =>{
    try{
        const urls = await url.find({ user: req.user._id, isDeleted: false }).sort({ createdAt: -1 });
        res.status(200).json(urls);
    } catch(error){
        res.status(500).json({message : error.message});
    }
}

const deleteUrl = async (req, res) => {
    try {
        const { linkId } = req.params;
        const existingUrl = await url.findOne({ _id: linkId, user: req.user._id });//

        if (!existingUrl || existingUrl.isDeleted) {
            return res.status(404).json({ message: "URL not found" });
        }

        existingUrl.isDeleted = true;
        await existingUrl.save();

        res.status(200).json({ message: "URL deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createShortUrl,
    redirectToOriginalUrl,
    getUserUrls,
    deleteUrl
}

