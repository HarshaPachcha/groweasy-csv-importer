const fs = require("fs");
const csv = require("csv-parser");

const { detectCRMFields } = require("../services/geminiService");

const uploadCSV = (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No CSV uploaded"
        });
    }

    const results = [];

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (row) => {
            results.push(row);
        })
        .on("end", async () => {

            try {

                const preview = results.slice(0, 5);

                const aiMapping = await detectCRMFields(preview);

                res.json({
                    success: true,
                    totalRows: results.length,
                    preview: preview,
                    aiMapping,
                    file: req.file.filename
                });

            } catch (error) {

                console.error(error);

                res.status(500).json({
                    success: false,
                    message: error.message
                });

            }

        });

};

module.exports = {
    uploadCSV
};