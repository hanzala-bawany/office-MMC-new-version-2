import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

import axios from "axios";
import { base_URL } from "../../utills/baseUrl";

const CSV = () => {

    const [csvLoading, setCsvLoading] = useState(false);
    const [csvFile, setCsvFile] = useState([]);
    const csvUploadProps = {
        beforeUpload: (file) => {
            const isCSV =
                file.type === "text/csv" ||
                file.name.toLowerCase().endsWith(".csv");

            if (!isCSV) {
                message.error("Only CSV files are allowed");
                return Upload.LIST_IGNORE;
            }

            setCsvFile([file]);
            return false; // stop auto upload
        },
        onRemove: () => setCsvFile([]),
        fileList: csvFile,
        maxCount: 1,
    };

    const uploadCSVHandler = async () => {
        if (!csvFile.length) {
            message.warning("Please select a CSV file first");
            return;
        }

        setCsvLoading(true);

        try {
            const formData = new FormData();
            formData.append("file", csvFile[0]);

            const res = await axios.post(
                `${base_URL}/api/doctor/upload-csv`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            toast.success(
                `${res.data.inserted} doctors added successfully`
            );

            if (res.data.failed?.length) {
                console.warn("Failed Rows:", res.data.failed);
                toast.warning(
                    `${res.data.failed.length} rows failed. Check console`
                );
            }

            setCsvFile([]);
            setReRendering((prev) => !prev); // refresh table
        } catch (err) {
            toast.error(
                err?.response?.data?.message || "CSV upload failed"
            );
        } finally {
            setCsvLoading(false);
        }
    };
    return (

        <div className="col-span-full mt-6 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
            <h3 className="text-[18px] font-[600] text-gray-700 mb-2">
                Bulk Doctor Upload (CSV)
            </h3>

            <p className="text-sm text-gray-500 mb-3">
                Upload CSV file to add multiple doctors at once
            </p>

            <div className="flex items-center gap-4">
                <Upload {...csvUploadProps}>
                    <Button icon={<UploadOutlined />}>
                        Select CSV File
                    </Button>
                </Upload>

                <Button
                    type="primary"
                    onClick={uploadCSVHandler}
                    loading={csvLoading}
                    disabled={!csvFile.length}
                    className="bg-blue-600 border-blue-600 hover:bg-blue-700"
                >
                    Upload CSV
                </Button>
            </div>

            {csvFile.length > 0 && (
                <p className="mt-2 text-green-600 text-sm">
                    Selected File: {csvFile[0].name}
                </p>
            )}
        </div>
    )
}

export default CSV