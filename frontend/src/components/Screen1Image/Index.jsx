import React, { useEffect, useRef, useState } from "react";
import { Button, Upload, Table, Input, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { base_URL } from "../../utills/baseUrl";
import axios from "axios";
import { toast } from "react-toastify";
import TableSkeleton from "../../utills/TableSkeleton";

const Screen1Image = ({ title }) => {

  const [form] = Form.useForm();
  const [headlinesForm] = Form.useForm();
  const [headlineData, setHeadlineData] = useState(null);
  const [reFetchHeadlineData, setReFetchHeadlineData] = useState(false);
  const [onAddHeadlineLoading, setOnAddHeadlineLoading] = useState(false);
  const [onAddScreenLoading, setOnAddScreenLoading] = useState(false);
  const [editdata, setEditdata] = useState(null);
  const [screen1Data, setScreen1Data] = useState(null);
  const [reFetchScreen1Data, setReFetchScreen1Data] = useState(null);
  const heading = useRef(null);

  // console.log(screen1Data, "<<<<< screen1Data");
  // console.log(editdata, "......... edit data");


  const onHeadlinesSubmit = async (values) => {

    // console.log(`Form Values of headline:`, values);
    setOnAddHeadlineLoading(true)

    try {
      const res = await axios.post(`${base_URL}/api/headline/manage`, {
        action: "ADD",
        upperheadline: values.upperHeadline,
        lowerheadline: values.lowerHeadline
      });
      // console.log(res, `res of add headline data`)
      setReFetchHeadlineData(prev => !prev);
      toast.success(res?.data?.message)
      setOnAddHeadlineLoading(false)
      // headlinesForm.resetFields();
    }
    catch (err) {
      // console.log(err, `error in add headline data`);
      toast.error(err?.response?.data?.message);
      setOnAddHeadlineLoading(false);
    }

  };

  const headlineDeleteHandler = async () => {

    try {
      const res = await axios.post(`${base_URL}/api/headline/manage`, {
        action: "DELETE",
      });
      // console.log(res, `res of delete headline data`)
      setReFetchHeadlineData(prev => !prev);
      toast.success(res?.data?.message)
      headlinesForm.resetFields();
    }
    catch (err) {
      // console.log(err, `error in delete headline data`);
      toast.error(err?.response?.data?.message);
    }

  }

  const onFinish = async (values) => {
    // console.log(values, "... onfinish");

    const formData = new FormData();

    formData.append("status", values.order);
    formData.append("action", !editdata ? "ADD" : "EDIT");
    values.imageFile && formData.append("image", values.imageFile[0].originFileObj);
    editdata && formData.append("id", editdata?.ID);

    setOnAddScreenLoading(true)

    if (!editdata) {

      try {
        const res = await axios.post(`${base_URL}/api/screen1images/manage`, formData);
        // console.log(res, `res of add screen 1 data`)
        setReFetchScreen1Data(prev => !prev);
        toast.success(res?.data?.message)
        setOnAddScreenLoading(false)
        form.resetFields()
      }
      catch (err) {
        // console.log(err, `error in add screen 1 data`);
        toast.error(err?.response?.data?.message)
        setOnAddScreenLoading(false)
      }

    }
    else {

      try {
        const res = await axios.post(`${base_URL}/api/screen1images/manage`, formData);
        // console.log(res, `res of add screen 1 data`)
        setEditdata(null)
        setReFetchScreen1Data(prev => !prev);
        toast.success(res?.data?.message)
        setOnAddScreenLoading(false)
      }
      catch (err) {
        // console.log(err, `error in add screen 1 data`);
        toast.error(err?.response?.data?.message)
        setOnAddScreenLoading(false)
      }

    }

  };

  const screen1DeleteHandler = async (data) => {
    // setLoading(true)
    try {
      const res = await axios.post(`${base_URL}/api/screen1images/manage`, {
        id: data?.ID,
        action: "DELETE"
      });
      // console.log(res , "res of delete screen 2");
      // setLoading(false)
      setReFetchScreen1Data(prev => !prev);
      toast.success(res?.data?.message)

    }
    catch (err) {
      // console.log(err, "error in delete screen 2");
      // setLoading(false)
      toast.error(err?.response?.data?.message)
    }

  }

  const columns = [
    { title: "Id", dataIndex: "ID", key: "id" },
    {
      title: "Image",
      dataIndex: "IMAGE",
      key: "image",
      render: (src) => <img src={src} alt="preview" className="h-16" />,
    },
    { title: "Image Order", dataIndex: "STATUS", key: "order" },
    {
      title: "Action",
      key: "action",
      render: (cellValue, rowData, rowIndex) => (
        <div className="flex gap-2">
          <Button onClick={() => setEditdata(rowData)} type="primary">Edit</Button>
          <Button onClick={() => screen1DeleteHandler(rowData)} danger>Delete</Button>
        </div>
      ),
    },
  ];



  useEffect(() => {

    const foo = async () => {
      try {
        const res = await axios.get(`${base_URL}/api/headline/manage`);
        // console.log(res, "res of get headlines");
        setHeadlineData(res.data.data[0]);
      }
      catch (err) {
        // console.log(err, "error in get headlines");
        // toast.error(err?.message)
      }
    }
    foo()

  }, [reFetchHeadlineData])

  useEffect(() => {
    if (headlineData) {
      headlinesForm.setFieldsValue({
        upperHeadline: headlineData.UPPERHEADLINE,
        lowerHeadline: headlineData.LOWERHEADLINE,
      });
    }
  }, [headlineData]);

  useEffect(() => {

    const foo = async () => {
      try {
        const res = await axios.get(`${base_URL}/api/screen1images/manage`);
        // console.log(res, "res of get screen1Data");
        setScreen1Data(res.data.data);
      }
      catch (err) {
        // console.log(err, "error in get screen1Data");
        // toast.error(err?.message)
      }
    }
    foo()

  }, [reFetchScreen1Data])

  useEffect(() => {
    if (editdata) {

      form.setFieldsValue({
        order: editdata?.STATUS
      });

      setTimeout(() => {
        heading.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);

    } else {
      form.resetFields();
    }
  }, [editdata]);


  return (

    <div className="p-6 bg-white shadow-md rounded-md">
      {/* Title */}
      <h2 ref={heading} className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>

      <div className="border border-gray-300 rounded-md p-4 mb-5">

        {/* Upper Headline */}
        <Form form={headlinesForm} layout="vertical" onFinish={onHeadlinesSubmit}>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item
              name="upperHeadline"
              label="Upper Headline (Top Slider)"
              rules={[{ required: true, message: "Please enter upper headline!" }, {
                max: 140,
                message: "Description cannot exceed 140 characters",
              }]}
            >
              <Input.TextArea rows={3} placeholder="Upper Headline" />
            </Form.Item>

            {/* Lower Headline */}
            <Form.Item
              name="lowerHeadline"
              label="Lower Headline (Bottom Slider)"
              rules={[{ required: true, message: "Please enter lower headline!" }, {
                max: 140,
                message: "Description cannot exceed 140 characters",
              }]}
            >
              <Input.TextArea rows={3} placeholder="Lower Headline" />
            </Form.Item>
          </div>

          <div className="flex gap-4">
            <Button danger size="large" onClick={() => headlinesForm.resetFields()} >Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{ background: "green", borderColor: "green" }}
              loading={onAddHeadlineLoading}
            >
              Submit
            </Button>
            <Button
              type="primary"
              size="large"
              style={{ background: "red", borderColor: "red" }}
              onClick={headlineDeleteHandler}
            >
              Delete
            </Button>
          </div>

        </Form>

      </div>


      <div className="border border-gray-300 rounded-md p-4">

        <Form form={form} layout="vertical" onFinish={onFinish}>

          {/* Image Order */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item
              name="order"
              label="Image Order"
              rules={[{ required: true, message: "Please enter image order!" }]}
            >
              <Input placeholder="Image Order" />
            </Form.Item>


            {/* File Upload - Full Width */}
            <Form.Item
              name="imageFile"
              label="Select File"
              valuePropName="fileList"
              getValueFromEvent={(e) => e.fileList}
              rules={[{ required: !editdata ? true : false, message: "Please upload an image!" }]}
            >
              <Upload beforeUpload={() => false} maxCount={1}>
                <Button icon={<UploadOutlined />}>Choose File</Button>
              </Upload>
            </Form.Item>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <Button danger size="large" onClick={() => {
              form.resetFields()
              setEditdata(null)
            }
            } >Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{ background: "green", borderColor: "green" }}
              loading={onAddScreenLoading}
            >
              {editdata ? "Update" : "Submit"}
            </Button>
          </div>
        </Form>

      </div>

      {/* Table */}
      <div className="mt-6">
        {
          screen1Data ?
            <Table
              rowKey="ID"
              columns={columns}
              dataSource={screen1Data}
              pagination={false}
              bordered
              scroll={{ x: "max-content" }}
            // loading={!data}
            />
            : <TableSkeleton />
        }
      </div>
    </div>
  );
};

export default Screen1Image;