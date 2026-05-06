import React, { useEffect, useState } from "react";
import { Select, Button, Card, Typography, Spin } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import { base_URL } from "../utills/baseUrl";
import { toggleRefreshPatients } from "../reduxToolKit/doctorSlice";
import { useDispatch } from "react-redux";

const { Option } = Select;
const { Title, Text } = Typography;

const RemoveDoctor = () => {

    const [doctors, setDoctors] = useState([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const dispatch = useDispatch();

    // ✅ Fetch doctors for dropdown
    const fetchDoctors = async () => {
        setFetchLoading(true);
        try {
            const res = await axios.get(`${base_URL}/api/opd/patients?patientStatus=2`);
            // console.log(res, "res");
            setDoctors(res?.data?.data || []);
        } catch (err) {
            toast.error("Failed to fetch doctors");
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    // ✅ Delete API Function
    const handleRemoveDoctor = async () => {

        console.log(selectedDoctorId, "selectedDoctorId ,,,,,,,,,,");

        if (!selectedDoctorId) {
            toast.warning("Please select a doctor first");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(
                `${base_URL}/api/opd/doctor/patient-cancel-all`,
                {
                    doctorId: selectedDoctorId,
                    receiptNo: null,
                },
            );
            // console.log(res, "res of handle Remove Doctor by id");
            dispatch(toggleRefreshPatients());

            toast.success("Doctor removed successfully");
            await fetchDoctors();
            setSelectedDoctorId(null);

        } catch (err) {
            toast.error(err || "Delete failed");
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="p-4 sm:p-6">

            <Card className="rounded-2xl shadow-md border-0">
                {/* Heading */}
                <Title level={3} className="!mb-2 !text-gray-700">
                    Remove Doctor From Screen
                </Title>
                <Text className="text-gray-500">
                    Select a doctor and remove them from the screen 5
                </Text>

                {/* Select Dropdown */}
                <div className="flex flex-col mt-6 gap-2">

                    <label className="mb-2 font-medium text-xl text-gray-600">
                        Select Doctor
                    </label>

                    <div className="flex w-full gap-5">

                        <Select
                            allowClear
                            loading={fetchLoading}
                            showSearch
                            placeholder="Search & select doctor"
                            size="large"
                            className="w-full"
                            value={selectedDoctorId}
                            onChange={(value) => setSelectedDoctorId(value)}
                            optionFilterProp="children"
                        >
                            {doctors?.map((doc) => (
                                <Option key={doc?.CONSULTANTID} value={doc?.CONSULTANTID}>
                                    {doc?.NAME}
                                </Option>
                            ))}
                        </Select>

                        {/* Selected Info */}

                        <div className=" flex px-4  items-center bg-gray-50 rounded-lg border text-md text-gray-600 w-full">
                            Selected Doctor ID :
                            <span className="ml-2 font-semibold text-gray-800">
                                {`  ${selectedDoctorId || "Not yet"}`}
                            </span>
                        </div>

                    </div>

                </div>

                {/* Button */}
                <div className="mt-6 flex justify-end">
                    <Button
                        danger
                        size="large"
                        className="px-6"
                        loading={loading}
                        onClick={handleRemoveDoctor}
                    >
                        Remove Doctor From Screen
                    </Button>
                </div>
            </Card>

        </div>
    );
};

export default RemoveDoctor;