const fs = require("fs");
const csv = require("csv-parser");

const importData = async (req, res) => {

    try {

        const { filePath, mapping } = req.body;

        if (!filePath) {

            return res.status(400).json({

                success: false,
                message: "File path missing"

            });

        }

        const rows = [];

        fs.createReadStream(filePath)

            .pipe(csv())

            .on("data", (row) => rows.push(row))

            .on("end", () => {

                const transformed = rows.map((row) => {

                    const obj = {};

                    Object.keys(mapping).forEach((crmField) => {

                        const csvColumn = mapping[crmField];

                        obj[crmField] = csvColumn
                            ? row[csvColumn]
                            : null;

                    });

                    return obj;

                });

                res.json({

                    success: true,

                    importedRows: transformed.length,

                    data: transformed

                });

            });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

module.exports = {

    importData

};