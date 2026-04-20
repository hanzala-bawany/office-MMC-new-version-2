
import { ImageUploadPage } from "../Index";
import { Button } from "antd";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { base_URL } from "../../utills/baseUrl";

const Screen2 = () => {

  const [reRendering, setReRendering] = useState(false);
  const [data, setData] = useState(null);
  const [editdata, setEditdata] = useState(null);
  const memoizedEditdata = useMemo(() => editdata, [editdata]);
  const [loading , setLoading] = useState(false)

  const deleteHandler = async (data) => {
    // console.log(data , "row data in delete handler");
    setLoading(true)
    try {
      const res = await axios.post(`${base_URL}/api/screen2images/manage`,{
        id : data?.ID ,
        action : "DELETE"
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
        const res = await axios.get(`${base_URL}/api/screen2images/manage`);
        // console.log(res, "res of get screen 2");
        setData(res.data.data);
      }
      catch (err) {
        // console.log(err, "error in get screen 2");
        // toast.error(err?.message)
      }
    }
    foo()

  }, [reRendering])

  return (
    <ImageUploadPage
      title="Screen 2 Images"
      inputLabel="Image Order"
      showUpload={true}
      columns={columns}
      data={data}
      setReRendering={setReRendering}
      purpose="screen2Images"
      addRoute="api/screen2images/manage"
      editRoute="api/screen2images/manage"
      editdata={memoizedEditdata}
      setEditdata={setEditdata}
    />
  );
};

export default Screen2;