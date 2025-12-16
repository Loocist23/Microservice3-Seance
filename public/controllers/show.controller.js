import Show from '../model/show.js';

export const getAllShow = async (req, res) => {
    try {
        const shows = await Show.findAll();
        res.status(200).json(shows);
    } catch(error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }
}