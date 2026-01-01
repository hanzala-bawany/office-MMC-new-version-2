import React, { useEffect, useMemo, useState } from "react";
import { ImageUploadPage } from "../Index";
import { Button } from "antd";
import { toast } from "react-toastify";
import axios from "axios";
import { base_URL } from "../../utills/baseUrl";
import { useDispatch, useSelector } from "react-redux";
import { setScreenData } from "../../reduxToolKit/screensSlice";

const Screen3 = () => {

  const [reRendering, setReRendering] = useState(false);
  // const [data, setData] = useState(null);
  const [editdata, setEditdata] = useState(null);
  const memoizedEditdata = useMemo(() => editdata, [editdata]);
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();
  const data = useSelector((state) => state?.screensSlice?.screen3);

  // console.log(data , "screen 3 data");
  

  const deleteHandler = async (data) => {
    // console.log(data , "row data in delete handler");
    setLoading(true)
    try {
      const res = await axios.post(`${base_URL}/api/screen3images/manage`, {
        id: data?.ID,
        action: "DELETE"
      });
      // console.log(res , "res of delete screen 2");
      setLoading(false)
      setReRendering(prev => !prev);
      toast.success(res?.data?.message)

    }
    catch (err) {
      // console.log(err, "error in delete screen 2");
      setLoading(false)
      toast.error(err?.response?.data?.message)
    }
  }

  const columns = [
    { title: "Id", dataIndex: "ID", key: "id" },
    { title: "Image Order", dataIndex: "STATUS", key: "order" },
    {
      title: "Image",
      dataIndex: "IMAGE",
      key: "image",
      render: (src) => <img src={src} alt="preview" className="h-16" />,
    },
    {
      title: "Action",
      key: "action",
      render: (cellValue, rowData, rowIndex) => (
        <div className="flex gap-2">
          <Button onClick={() => setEditdata(rowData)} type="primary">Edit</Button>
          <Button onClick={() => deleteHandler(rowData)} loading={loading} danger>Delete</Button>
        </div>
      ),
    },
  ];


  useEffect(() => {

    const foo = async () => {
      try {
        const res = await axios.get(`${base_URL}/api/screen3images/manage`);
        // console.log(res, "res of get screen 3");
        // setData(res?.data?.data);
        dispatch(setScreenData({ screen: "screen3", data: res.data.data }));
      }
      catch (err) {
        // console.log(err, "error in get screen 3");
        toast.error(err?.message)
      }
    }
    foo()

  }, [reRendering])

  return (
    <ImageUploadPage
      title="Screen 3 Images"
      inputLabel="Image Order"
      showUpload={true}
      columns={columns}
      data={data}
      setReRendering={setReRendering}
      purpose="screen3Images"
      addRoute="api/screen3images/manage"
      editRoute="api/screen3images/manage"
      editdata={memoizedEditdata}
      setEditdata={setEditdata}
    />
  )
}
export default Screen3;