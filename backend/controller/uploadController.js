
async function uploadController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "No file uploaded. Please provide a file.",
            });
        }
        res.status(201).json({
            fileUrl: `/${req.file.path.replace(/\\/g, '/')}`, 
            success: true,
            error: false,
            message: "File uploaded successfully!",
        });
    } catch (error) {
        console.error("Error in uploadController:", error.message || error);

        res.status(500).json({
            success: false,
            error: true,
            message: "An error occurred while uploading the file.",
        });
    }
}

module.exports = uploadController;
