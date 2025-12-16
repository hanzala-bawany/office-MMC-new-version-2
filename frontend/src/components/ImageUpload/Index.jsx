import React, { useEffect, useRef, useState } from "react";
import { Button, Upload, Table, Input, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { base_URL } from "../../utills/baseUrl";
import { toast } from "react-toastify";
import TableSkeleton from "../../utills/TableSkeleton";

const ImageUploadPage = ({ title, columns, data, showUpload = true, inputLabel, purpose, editdata, setEditdata, setReRendering, addRoute, editRoute }) => {

  // console.log(purpose, "<<< purpose");
  // console.log(editdata, "<<<<  editdata");
  // console.log(data, "<<<<  rows data");
  const [form] = Form.useForm();
  const [onSubmitLoading, setOnSubmitLoading] = useState(false)
  const heading = useRef(null)


  const cancelHandler = () => {
    form.resetFields();
    setEditdata(null)
  }

  const onFinish = async (values) => {
    // console.log(values, "onfinish");

    const formData = new FormData();

    if (!(purpose === "addFaculty")) {

      formData.append("status", values.mainInput);
      formData.append("action", !editdata ? "ADD" : "EDIT");
      values.imageFile && formData.append("image", values.imageFile[0].originFileObj);
      editdata && formData.append("id", editdata?.ID);

    }

    setOnSubmitLoading(true)
    // console.log(formData , "formData");

    if (!editdata) {

      try {
        const res = await axios.post(`${base_URL}/${addRoute}`, purpose === "addFaculty" ? { name: values.mainInput } : formData);
        // console.log(res, `res of ${purpose}`);
        setReRendering(prev => !prev);
        toast.success(res?.data?.message)
        setOnSubmitLoading(false)
      }
      catch (err) {
        // console.log(err, `error in ${purpose}`);
        toast.error(err?.response?.data?.message)
        setOnSubmitLoading(false)
      }

    }
    else {

      try {
        const res = await axios.post(`${base_URL}/${editRoute}`, purpose === "addFaculty" ? { name: values.mainInput, id: editdata?.ID } : formData);
        // console.log(res, `res of update of ${purpose}`)
        setEditdata(null)
        setReRendering(prev => !prev);
        toast.success(res?.data?.message)
        setOnSubmitLoading(false)
      }
      catch (err) {
        // console.log(err, `error in edit of ${purpose}`);
        toast.error(err?.response?.data?.message)
        setOnSubmitLoading(false)
      }

    }
    cancelHandler()
  };


  useEffect(() => {
    if (editdata) {

      form.setFieldsValue({
        mainInput: purpose === "addFaculty" ? editdata.NAME : editdata.STATUS
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

    <div className="">
      <h2 ref={heading} className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >

        <Form.Item
          name="mainInput"
          label={inputLabel}
          rules={[{ required: true, message: `Please enter ${inputLabel}!` }]}
        >
          <Input placeholder={inputLabel} />
        </Form.Item>


        {showUpload && (
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
        )}


        <div className="col-span-2 flex gap-4">
          <Button onClick={cancelHandler} danger size="large">
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            style={{ background: "green", borderColor: "green" }}
            loading={onSubmitLoading}
          >
            {editdata ? "Upadate" : "Submit"}
          </Button>
        </div>
      </Form>


      <div className="mt-6">
        {
          data ?
            <Table
              rowKey="ID"
              columns={columns}
              dataSource={data}
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

export default ImageUploadPage;