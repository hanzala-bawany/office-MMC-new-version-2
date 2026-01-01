import React, { useEffect, useRef, useState } from "react";
import {
  Form, Input, Button, Select, Upload, TimePicker, Checkbox, Table, message,
  Typography,
  DatePicker,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { base_URL } from "../../utills/baseUrl";
import { toast } from "react-toastify";
import moment from "moment/moment";
import TableSkeleton from "../../utills/TableSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { updateDoctorsData } from "../../reduxToolKit/doctorSlice";
import CSV from "./CSV";


const { Option } = Select;

const DoctorTable = () => {

  const [form] = Form.useForm();
  const [timings, setTimings] = useState({});
  const [fileList, setFileList] = useState([]);
  const [facultyNames, setFacultyNames] = useState(null);
  const [doctorData, setDoctorData] = useState(null);
  const [reRendering, setReRendering] = useState(false);
  const [onSubmitLoading, setOnSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const dispatch = useDispatch();
  const headingRef = useRef(null);



  // console.log(editingDoctor, "edit doctor data");


  const deleteHandler = async (data) => {
    // console.log(data , "row data in delete handler");
    setDeleteLoading(data?.DOCTOR_ID)
    try {
      const res = await axios.post(`${base_URL}/api/doctor/manage`, {
        id: data?.DOCTOR_ID,
        action: "DELETE"
      });
      // console.log(res , "res of delete Doctor");
      setDeleteLoading(false)
      setReRendering(prev => !prev);
      // toast.success(res?.data?.message)
      toast.success("Doctor deleted successfully");

    }
    catch (err) {
      console.log(err, "error in delete Doctor");
      setDeleteLoading(false)
      toast.error(err?.message)
    }
  }

  const editHandler = (data) => {
    // full doctor object doctorData me se nikaal lo
    // console.log(data, "edit data ");

    const selectedDoctor = doctorData?.find(
      (doc) => doc.DOCTOR_ID === data.DOCTOR_ID
    );
    setSelectedDoctor(selectedDoctor)

    if (!selectedDoctor) {
      toast.error("Doctor data not found");
      return;
    }

    // Form fields me data set karo
    form.setFieldsValue({
      name: selectedDoctor.DOCTOR_NAME || "",
      contact: selectedDoctor.CONTACTNO || "",
      email: selectedDoctor.EMAIL || "",
      gender: selectedDoctor.GENDER || "",
      address: selectedDoctor.ADDRESS || "",
      description: selectedDoctor.DESCRIPTION || "",
      faculty: selectedDoctor.FKFACULTY_ID || "",
      fees: selectedDoctor.FEES || "",
      screens: selectedDoctor?.SCREENS
        ? selectedDoctor.SCREENS.split(",") // agar comma separated hain
        : [],
      roomname: selectedDoctor?.ROOMNAME || ""
    });


    const newTimings = {};
    if (selectedDoctor?.SCHEDULE_SUMMARY) {
      const days = selectedDoctor.SCHEDULE_SUMMARY.split(", ");
      days.forEach((d) => {
        const match = d.match(/(\w+)\((\d{2}:\d{2})-(\d{2}:\d{2})\)/);
        if (match) {
          const [, day, from, to] = match;
          newTimings[day] = { from, to };
        }
      });
    }
    // console.log(newTimings , "newTimings ...........");
    setTimings(newTimings);

    // SET FORM VALUES
    Object.keys(newTimings).forEach((day) => {
      form.setFieldValue(`${day}_from`, newTimings[day].from);
      form.setFieldValue(`${day}_to`, newTimings[day].to);
    });


    setEditingDoctor(selectedDoctor);

    setTimeout(() => {
      headingRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const columns = [
    { title: "Id", dataIndex: "DOCTOR_ID", key: "id", width: 80 },
    { title: "Name", dataIndex: "DOCTOR_NAME", key: "name", width: 150 },
    { title: "Faculty", dataIndex: "FACULTY_NAME", key: "faculty", width: 180 },
    { title: "Fees", dataIndex: "FEES", key: "fees", width: 100 },
    { title: "Gender", dataIndex: "GENDER", key: "gender", width: 100 },
    { title: "Description", dataIndex: "DESCRIPTION", key: "description", width: 350 },
    {
      title: "Image",
      dataIndex: "IMAGE",
      key: "image",
      width: 120,
      render: (_, row) => row?.IMAGE ? (
        <img src={`${base_URL}${row?.IMAGE}`} alt="doctor" className="h-12 w-12 sm:h-16 sm:w-16 object-cover" />
      ) : (
        <span className="text-gray-400">-</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 150,
      render: (cellValue, rowData, rowIndex) => (
        <div className="flex justify-center gap-2">
          <Button onClick={() => editHandler(rowData)} type="primary">Edit</Button>
          <Button onClick={() => deleteHandler(rowData)} loading={deleteLoading === rowData?.DOCTOR_ID} danger>Delete</Button>
        </div>
      ),
    },
  ];

  const onTimeChange = (day, type, time) => {
    setTimings((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: time ? time.format("HH:mm") : null,
      },
    }));
  };

  const onFinish = async (values) => {
    // console.log(values, "<<<<<<< onFinish values");
    // console.log(timings, "<<<<<<< onFinish timings");

    setOnSubmitLoading(true);

    const scheduleString = Object.entries(timings)
      .filter(([_, val]) => val.from && val.to)
      .map(([day, val]) => `${day}|${val.from}|${val.to}`)
      .join(",");

    // console.log(scheduleString, "<<<<<<< onFinish scheduleString");


    const formData = new FormData();
    formData.append("doctor_name", values.name);
    formData.append("contactno", values.contact);
    formData.append("email", values.email);
    formData.append("gender", values.gender);
    formData.append("address", values.address);
    formData.append("description", values.description);
    formData.append("fkfaculty_id", values.faculty);
    formData.append("fees", values.fees);
    formData.append("days", scheduleString);
    formData.append("createdby", "Admin");
    formData.append("status", "1");
    formData.append("roomname", values?.roomname);

    if (fileList[0]) {
      formData.append("image", fileList[0]);
    }
    else {
      if (!editingDoctor) {
        values?.gender === "Female"
          ? formData.append("image", `femaleDoctor.png`)
          : formData.append("image", "maleDoctor.png");
      }
    }

    try {
      let res;
      if (editingDoctor) {
        // --- UPDATE logic ---
        formData.append("action", "EDIT");
        formData.append("id", editingDoctor.DOCTOR_ID);
        res = await axios.post(`${base_URL}/api/doctor/manage`, formData);
        // console.log(res, " <<<< edit doctor");
        toast.success("Doctor updated successfully");

      } else {
        // --- ADD logic ---
        formData.append("action", "ADD");
        res = await axios.post(`${base_URL}/api/doctor/manage`, formData);
        // console.log(res, "<<<<<< add doctor");
        toast.success("Doctor added successfully");

      }

      setEditingDoctor(null);
      setFileList([]);
      setReRendering((prev) => !prev);
      form.resetFields();
      setTimings({});
    }
    catch (err) {
      toast.error(err?.response?.data?.message);
    }
    finally {
      setOnSubmitLoading(false);
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      setFileList([file]);
      return false; // prevent auto upload
    },
    onRemove: () => setFileList([]),
    fileList,
    maxCount: 1,
  };

  useEffect(() => {
    const getFaculty = async () => {
      try {
        const res = await axios.get(`${base_URL}/api/faculty/get`);
        // console.log(res, "res of get faculty");
        setFacultyNames(res?.data?.data);
      }
      catch (err) {
        // console.log(err, "error in get faculty");
        // toast.error(err?.message)
      }
    }
    getFaculty()

  }, []);


  useEffect(() => {

    const getDoctorsInfo = async () => {
      try {
        const res = await axios.get(`${base_URL}/api/doctor/list`);
        console.log(res, "res of get Doctor info");
        setDoctorData(res?.data?.data);
        // editingDoctor && dispatch(updateDoctorsData(res.data.data));
      }
      catch (err) {
        // console.log(err, "error in get Doctor info");
        // toast.error(err?.message)
      }
    }
    getDoctorsInfo()

  }, [reRendering]);





  return (

    <div className="p-0">
      {/* ---- Doctor Form ---- */}
      <div className="">
        <h3 ref={headingRef} className="text-xl font-[700] text-gray-700 mb-6">
          Doctor Management
        </h3>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Doctor Name */}
          <Form.Item
            name="name"
            label="Doctor Name"
            rules={[{ required: true, message: "Please enter doctor name" }]}
          >
            <Input placeholder="Enter doctor name" size="large" />
          </Form.Item>

          {/* Contact */}
          <Form.Item
            name="contact"
            label="Contact No"
            rules={[{
              max: 11,
              message: "Contact cannot exceed 11 digits",
            }, { message: "Please enter contact no" }]}
          >
            <Input placeholder="Enter contact" size="large" type="number" />
          </Form.Item>

          {/* Faculty */}
          <Form.Item
            name="faculty"
            label="Consultant"
            rules={[{ required: true, message: "Please select consultant" }]}
          >
            <Select placeholder="Select Consultant" size="large">
              {
                facultyNames ? facultyNames?.map((item) => <Option key={item?.ID} value={item?.ID} > {item?.NAME} </Option>) : "No Faculty Assign"
              }
            </Select>
          </Form.Item>

          {/* Email */}
          <Form.Item name="email" label="Email">
            <Input placeholder="Enter email" size="large" type="email" />
          </Form.Item>

          {/* Gender */}
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: "Please select gender" }]}
          >
            <Select placeholder="Select gender" size="large">
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
          </Form.Item>

          {/* Address */}
          <Form.Item name="address" label="Address" rules={[{
            max: 50,
            message: "Address cannot exceed 50 characters",
          },]}>
            <Input placeholder="Enter address" size="large" />
          </Form.Item>

          {/* Fees */}
          <Form.Item
            name="fees"
            label="Fees"
          >
            <Input placeholder="Enter fees" size="large" type="number" />
          </Form.Item>


          {/* Address */}
          <Form.Item name="roomname" label="Room Name" rules={[{
            max: 30,
            message: "Room Name cannot exceed 30 characters",
          },]} >
            <Input placeholder="Enter Room Name" size="large" />
          </Form.Item>

          {/* Description */}
          <Form.Item name="description" label="Description" className="col-span-2" rules={[{
            max: 500,
            message: "Description cannot exceed 120 characters",
          },]}>
            <Input.TextArea showCount maxLength={500} placeholder="Enter description" rows={3} />
          </Form.Item>

          {/* Timings Section */}
          <div className="col-span-full mt-6">
            <h3 className="font-[700] text-gray-700 text-[20px] mb-3">Timings:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {weekDays.map((day) => (
                <div className="" key={day}>

                  <label className="block text-gray-1000 font-[500] mb-1 text-[18px]">{day}</label>

                  <div className="flex  gap-4 border-gray-400">

                    <Form.Item
                      name={`${day}_from`}
                      label="From"
                      className="w-[40%]"
                    >
                      <Input
                        type="time"
                        style={{ width: "100%" }}
                        onChange={(e) => {
                          const val = e.target.value;
                          onTimeChange(day, "from", val ? moment(val, "HH:mm") : null);
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      name={`${day}_to`}
                      label="To"
                      className="w-[40%]"
                    >
                      <Input
                        type="time"
                        style={{ width: "100%" }}
                        onChange={(e) => {
                          const val = e.target.value;
                          onTimeChange(day, "to", val ? moment(val, "HH:mm") : null);
                        }}
                      />

                    </Form.Item>

                  </div>

                </div>
              ))}
            </div>
          </div>


          {/* File Upload */}
          <Form.Item
            label="Doctor Image"
            className="col-span-full"
          // valuePropName="fileList"
          // getValueFromEvent={(e) => e.fileList}
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>

          {/* Buttons */}
          <div className="col-span-full flex justify-end gap-4 mt-4">
            {/* <span>
      <CSV/>
     </span> */}


            <Button onClick={() => {
              form.resetFields();
              setTimings({});
              setEditingDoctor(null);
              setFileList([]);
            }
            } danger size="large">
              Reset
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="bg-green-600 border-green-600 hover:bg-green-700"
              loading={onSubmitLoading}
            >
              {editingDoctor ? "Update" : "Submit"}
            </Button>
          </div>
        </Form>

      </div>

      {/* ---- Table Section ---- */}
      <div className="mt-6 overflow-x-auto bg-white p-4 rounded-xl shadow">
        {
          doctorData ?
            <Table
              rowKey="DOCTOR_ID"
              columns={columns}
              dataSource={doctorData}
              pagination={false}
              bordered
              scroll={{ x: 1000 }}
            />
            : <TableSkeleton />
        }
      </div>
    </div>

  );
};

export default DoctorTable;
