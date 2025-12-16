import React, { useEffect, useMemo, useState } from "react";
import { ImageUploadPage } from "../Index";
import { Button } from "antd";
import axios from "axios";
import { base_URL } from "../../utills/baseUrl";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Faculty = () => {

  const [reRendering, setReRendering] = useState(false);
  const [data, setData] = useState(null);
  const [editdata, setEditdata] = useState(null);
  const memoizedEditdata = useMemo(() => editdata, [editdata]);


  const deleteHandler = async (data) => {
    // console.log(data , "row data in delete handler");
    try {
      const res = await axios.delete(`${base_URL}/api/faculty/${data?.ID}`);
      // console.log(res , "res of delete facul5ty");
      toast.success(res?.data?.message)
      setReRendering(prev => !prev);

    }
    catch (err) {
      // console.log(err, "error in delete faculty");
      toast.error(err?.response?.data?.message)
    }
  }


  const columns = [
    { title: "Id", dataIndex: "ID", key: "id" },
    { title: "Consultant Name", dataIndex: "NAME", key: "consultantName" },
    {
      title: "Action",
      key: "action",
      render: (cellValue, rowData, rowIndex) => (
        <div className="flex gap-2">
          <Button onClick={() => setEditdata(rowData)} type="primary">Edit</Button>
          <Button onClick={() => deleteHandler(rowData)} danger>Delete</Button>
        </div>
      ),
    },
  ];


  useEffect(() => {

    const foo = async () => {
      try {
        const res = await axios.get(`${base_URL}/api/faculty/get`);
        // console.log(res, "res of get faculty");
        setData(res.data.data);
      }
      catch (err) {
        // console.log(err, "error in get faculty");
        //  toast.error(err?.message)
      }
    }
    foo()

  }, [reRendering])


  return (

    <ImageUploadPage
      title="Add Consultant"
      inputLabel="Consultant Name"
      showUpload={false}
      columns={columns}
      data={data}
      editdata={memoizedEditdata}
      setEditdata={setEditdata}
      setReRendering={setReRendering}
      purpose="addFaculty"
      addRoute="api/faculty/add"
      editRoute="api/faculty/add"
    />
  );
};

export default Faculty;