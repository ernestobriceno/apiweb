const checkFileSize = (req, res, next) => {
    try {
        // Assuming the base64 string is in req.body.base64String
        const base64String = req.body.data;

        if (!base64String) {
            throw new Error('Base64 string is missing');
        }

        // Remove the data URI prefix (e.g., "data:image/png;base64,") if present
        const base64Data = base64String.replace(/^data:[^;]+;base64,/, '');

        // Decode base64 string to binary
        const binaryData = Buffer.from(base64Data, 'base64');

        // Specify the maximum allowed size in bytes (e.g., 5 MB)
        const maxSizeBytes = 1024 * 5120; // 5 MB
       
        if (binaryData.length > maxSizeBytes) {
            throw new Error('File size exceeds the maximum allowed size');
        }

        // If the size is within the limit, continue to the next middleware
        next();
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

module.exports = checkFileSize;
