import React, { useState } from 'react';
import {
  Table,
  Button,
  Select,
  Card,
  Space,
  Tag,
  Form
} from 'antd';
import {
  LockOutlined,
  PrinterOutlined,
  CheckCircleFilled,
  ClockCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { useSelector } from 'react-redux';
import useFetch from '../hooks/useFetch';
import axiosInstance from '../utills/axiosInstance';
import { toast } from 'react-toastify';

const { Option } = Select;

// ✅ STATIC DUMMY DATA (image ke pattern ke acc)
const staticSessionData = [
  {
    SESSIONID: 28802,
    FROM: '2026-08-06 12:52:03',
    TO: null,
    CLOSED: 0,
    SESSIONDATE: '2026-08-06',
    SHIFTNAME: 'OTHERS',
  },
  {
    SESSIONID: 33173,
    FROM: '2026-08-06 11:32:23',
    TO: '2026-08-06 12:45:36',
    CLOSED: 1,
    SESSIONDATE: '2026-08-06',
    SHIFTNAME: 'MORNING',
  },
  {
    SESSIONID: 33169,
    FROM: '2026-08-05 15:59:14',
    TO: '2026-08-05 16:40:10',
    CLOSED: 1,
    SESSIONDATE: '2026-08-05',
    SHIFTNAME: 'EVENING',
  },
  {
    SESSIONID: 28794,
    FROM: '2026-08-04 12:10:28',
    TO: '2026-08-04 14:20:00',
    CLOSED: 1,
    SESSIONDATE: '2026-08-04',
    SHIFTNAME: 'OTHERS',
  },
  {
    SESSIONID: 28793,
    FROM: '2026-08-03 11:52:37',
    TO: '2026-08-03 13:10:00',
    CLOSED: 1,
    SESSIONDATE: '2026-08-03',
    SHIFTNAME: 'MORNING',
  },
  {
    SESSIONID: 28792,
    FROM: '2026-08-03 11:38:11',
    TO: '2026-08-03 11:50:00',
    CLOSED: 1,
    SESSIONDATE: '2026-08-03',
    SHIFTNAME: 'MORNING',
  },
  {
    SESSIONID: 28791,
    FROM: '2026-08-03 11:25:09',
    TO: '2026-08-03 11:36:00',
    CLOSED: 1,
    SESSIONDATE: '2026-08-03',
    SHIFTNAME: 'MORNING',
  },
  {
    SESSIONID: 28790,
    FROM: '2026-07-31 16:11:36',
    TO: '2026-07-31 17:00:00',
    CLOSED: 1,
    SESSIONDATE: '2026-07-31',
    SHIFTNAME: 'EVENING',
  },
];

// ✅ STATIC USER LIST (dropdown ke liye)
const staticUsers = [
  { USERID: 1, USERNAME: 'Hanzala Ahmed' },
  { USERID: 2, USERNAME: 'Ayesha Khan' },
  { USERID: 3, USERNAME: 'Bilal Sheikh' },
  { USERID: 4, USERNAME: 'Front Desk 1' },
];

const UserSessionPage = () => {


  const [form] = Form.useForm();
  const [selectedUser, setSelectedUser] = useState(null);
  const [printLoading, setPrintLoading] = useState(false);
  const [closeLoading, setCloseLoading] = useState(false);
  const loginUserData = useSelector((state) => state?.authSlice?.loginUser);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [openSessionId, setOpenSessionId] = useState(null);
  const filteredData = staticSessionData;

  const { data: currentSessionHistoryData, loading: currentSessionHistoryDataLoading, error: currentSessionHistoryDataError, reFetchData: refetchcurrentSessionHistoryData }
    = useFetch(loginUserData?.username ? `/api/receptionist/getCurrentSessionHistory/${selectedUser || loginUserData?.username}` : null);   // loginUserData?.username = usernID 

  const { data: usersData, loading: usersLoading, error: usersError } = useFetch('/api/receptionist/users');

  

  const columns = [
    {
      title: 'Session ID',
      dataIndex: 'SESSIONID',
      key: 'SESSIONID',
      width: 110,
      render: (text) => <span className="font-semibold">{text}</span>,
    },
    {
      title: 'From',
      dataIndex: 'FROMDATE',
      key: 'FROMDATE',
      render: (date) => (
        <span>{moment(date).format('DD-MMM-YYYY hh:mm:ss A')}</span>
      ),
    },
    {
      title: 'To Date',
      dataIndex: 'TODATE',
      key: 'TODATE',
      render: (date) =>
        date ? (
          <span>{moment(date).format('DD-MMM-YYYY hh:mm:ss A')}</span>
        ) : (
          <span className="text-gray-400 italic">Active</span>
        ),
    },
    {
      title: 'Closed',
      dataIndex: 'STATUS',
      key: 'STATUS',
      width: 100,
      align: 'center',
      render: (cellCalue, recordData, index) => {
        if (cellCalue == 0) {  // status 0 means session is closed 
          return <CheckCircleFilled className="text-green-500! text-base!" />;
        } else {
          setOpenSessionId(recordData?.SESSIONID);
          return <ClockCircleOutlined className="text-orange-400! text-base!" />;
        }
      }
    },
    {
      title: 'Session Date',
      dataIndex: 'SESSIONDATE',
      key: 'SESSIONDATE',
      render: (date) => <span>{moment(date).format('DD-MMM-YYYY')}</span>,
    },
    {
      title: 'Shift Name',
      dataIndex: 'SHIFTNAME',
      key: 'SHIFTNAME',
      render: (shift) => {
        const color =
          shift === 'MORNING' ? 'blue' : shift === 'EVENING' ? 'purple' : 'default';
        return <Tag color={color} className="font-medium">{shift}</Tag>;
      },
    },
  ];

  const handleRowSelect = (record, isSelected) => {
    console.log("handleRowSelect chala he ");
    console.log(record, "record .........");   // <-- pura row data yahan milega
    console.log(isSelected, "checked ya unchecked .........");
  };

  const onOverAllSelectChange = (newSelectedRowKeys, selectedRows) => {
    console.log("onOverAllSelectChange chala he ");
    setSelectedRowKeys(newSelectedRowKeys);
    console.log(newSelectedRowKeys, "newSelectedRowKeys ..............");
    console.log(selectedRows, "selectedRows (poora data array) .........");
  };

  const handleSessionClosed = async () => {

    if (!openSessionId) {
      toast.warning("No open session found to close!");
      return;
    }

    setCloseLoading(true);

    try {
      const res = await axiosInstance.post(`/api/receptionist/closedUserSession/${openSessionId}`);
      toast.success(res?.data?.message)

      refetchcurrentSessionHistoryData();
      setOpenSessionId(null);

    } catch (error) {
      console.log(error, "err .............");
      toast.error(error?.response?.data?.message || "Failed to Closed Session");
    } finally {
      setCloseLoading(false);
    }

  };

  const handlePrint = () => {
    setPrintLoading(true);
    setTimeout(() => {
      setPrintLoading(false);
      window.print();
    }, 500);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onOverAllSelectChange,
    onSelect: handleRowSelect, // ✅ single row select/deselect hote hi trigger hoga
  };



  return (

    <div className="p-4 bg-gray-50 min-h-screen">

      <div className='flex justify-between'>

        {/* ✅ Page Heading */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-800">User Session</h1>
          <p className="text-sm text-gray-500">
            Track login/logout sessions, active shift status, and session history
          </p>
        </div>

        {
          loginUserData?.role == "admin" &&

          <Form form={form} layout="vertical">

            <Form.Item
              name="userId"
              label={<span className="text-xs font-semibold text-gray-600">User Id</span>}
              className="mb-0 min-w-[220px]"
            >
              <Select
                placeholder="Select User"
                allowClear
                value={selectedUser}
                onChange={(val) => setSelectedUser(val)}
                showSearch
                filterOption={(input, option) => {
                  // console.log(option , "option .......");
                  return option.children.toLowerCase().includes(input.toLowerCase());
                }}
              >
                {usersData?.data?.map((item, i) => (
                  <Option key={`${item.USERID}-${i}`} value={item.USERID}>
                    {item.USERID}
                  </Option>
                ))}
              </Select>

            </Form.Item>

          </Form>
        }

      </div>

      {/* Filter + Actions Section */}
      <Card className="shadow-sm mb-4">

        <div className="flex flex-wrap items-end justify-between gap-3">

          <Space size="middle">

            <Button
              type="primary"
              icon={<LockOutlined />}
              loading={closeLoading}
              onClick={handleSessionClosed}
              className={`shadow-md shadow-red-500/30 ${openSessionId
                  ? '!bg-red-500 hover:!bg-red-600'
                  : ' !text-gray-800 bg-red-100! !shadow-none border-red-500!'
                }`}
              disabled={!openSessionId}
            >
              Session Closed
            </Button>

            <Button
              icon={<PrinterOutlined />}
              loading={printLoading}
              onClick={handlePrint}
              className="!border-gray-300"
            >
              Print
            </Button>

          </Space>

        </div>

      </Card>

      {/* Table Section */}
      <Card className="shadow-sm">
        <Table
          columns={columns}
          dataSource={currentSessionHistoryData?.data}
          loading={currentSessionHistoryDataLoading}
          rowSelection={rowSelection}
          rowKey={(record) => record.SESSIONID}
          rowClassName={(record) =>
            selectedRowKeys.includes(record.SESSIONID)
              ? 'selected-row'
              : 'hover:bg-gray-50 transition-colors'
          }
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          scroll={{ x: 900 }}
          className="user-session-table"
        />
      </Card>



      {/* ✅ Active session ko blue highlight (image jaisa) */}
      <style>{`
  .user-session-table .ant-table-thead > tr > th {
    background-color: #1677ff !important;
    color: #fff !important;
    font-weight: 600;
    border-bottom: none !important;
  }

  .user-session-table .ant-table-thead > tr > th::before {
    display: none !important;
  }
    
      .selected-row > td {
          background-color: #b3deff !important;
        }
        .selected-row:hover > td {
          background-color: #bae0ff !important;
        }
`}</style>

    </div>
  );
};

export default UserSessionPage;