// import React, { useEffect, useState } from "react";
// import { Table } from "antd";
// import axios from "axios";
// import { base_URL } from "../../utills/baseUrl";
// import TableSkeleton from "../../utills/TableSkeleton";

// const Faculty = () => {
//   const [data, setData] = useState(null);

//   const columns = [
//     { title: "Id", dataIndex: "ID", key: "id" },
//     { title: "Consultant Name", dataIndex: "NAME", key: "consultantName" },
//   ];

//   useEffect(() => {
//     const fetchFaculties = async () => {
//       try {
//         const res = await axios.get(`${base_URL}/api/opd/hms-faculties`);
//         setData(res.data.data);
//       } catch (err) {
//         console.error("Error fetching faculties:", err);
//       }
//     };
//     fetchFaculties();
//   }, []);

//   return (
//     <div>
//       <h2 className="text-xl font-semibold text-gray-700 mb-4">Consultants</h2>
//       {data ? (
//         <Table
//           rowKey="ID"
//           columns={columns}
//           dataSource={data}
//           pagination={false}
//           bordered
//           scroll={{ x: "max-content" }}
//         />
//       ) : (
//         <TableSkeleton />
//       )}
//     </div>
//   );
// };

// export default Faculty;


import React, { useEffect, useState } from "react";
import { Table, Input } from "antd";
import axios from "axios";
import { base_URL } from "../../utills/baseUrl";
import TableSkeleton from "../../utills/TableSkeleton";
import { SearchOutlined } from "@ant-design/icons";

const Faculty = () => {
  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = data?.filter(r =>
    r.NAME.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { title: "Id", dataIndex: "ID", key: "id" },
    { title: "Faculty Name", dataIndex: "NAME", key: "facultyName" },
  ];

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const res = await axios.get(`${base_URL}/api/admin/hms-faculties`);
        setData(res.data.data);
      } catch (err) {
        console.error("Error fetching faculties:", err);
      }
    };
    fetchFaculties();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Faculty</h2>

      <Input
        prefix={<SearchOutlined className="text-gray-400" />}
        placeholder="Search faculty..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
        allowClear
        style={{ maxWidth: 300 }}
      />

      {data ? (
        <Table
          rowKey="ID"
          columns={columns}
          dataSource={filtered}
          pagination={false}
          bordered
          scroll={{ x: "max-content" }}
        />
      ) : (
        <TableSkeleton />
      )}
    </div>
  );
};

export default Faculty;