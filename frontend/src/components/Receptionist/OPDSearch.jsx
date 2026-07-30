// frontend/src/components/Reception/OPDSearch.jsx
import React, { useState } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  DatePicker,
  Card,
  Space,
  Tag,
  Row,
  Col,
  Badge,
  Form
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  FilterOutlined,
  EyeOutlined,
  EditOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import useFetch from '../../hooks/useFetch';
import moment from 'moment';

const { RangePicker } = DatePicker;

const OPDSearch = () => {

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchParams, setSearchParams] = useState({
    fromDate: moment().format('DD-MMM-YYYY'),
    toDate: null,
    userId: null,
    receiptNo: null,
    contactNo: null,
    categoryId: null,
    pageNo: 1,
    pageSize: 10
  });

  const { data: patientsData, loading: patientsDataLoading, error: patientsDataError } =
    useFetch('/api/receptionist/filterPatients', searchParams);
  const { data: opdCategoryData, loading: opdCategorLoading, error: opdCategorError } = useFetch('/api/receptionist/opdCategory');
  const { data: usersData, loading: usersLoading, error: usersError } = useFetch('/api/receptionist/users');

  // console.log(patientsData, "patientsData ..........");
  // console.log(opdCategoryData, "opdCategoryData ..........");
  // console.log(usersData, "usersData ..........");


  const columns = [
    {
      title: 'Token No',
      dataIndex: 'TOKENNO',
      key: 'TOKENNO',
      width: 80,
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Reciept #',
      dataIndex: 'RECEIPTNO',
      key: 'RECEIPTNO',
      render: (text) => <span className="text-blue-600">{text}</span>,
    },
    {
      title: 'Date',
      dataIndex: 'VDATE',
      key: 'VDATE',
      width: 120,
      render: (date) => <span>{moment(date).format("DD-MMM-YYYY")}</span>,
    },
    {
      title: 'Category',
      dataIndex: 'CATEGORYNAME',
      key: 'CATEGORYNAME',
    },
    {
      title: 'Consultant',
      dataIndex: 'CONSULTANTNAME',
      key: 'CONSULTANTNAME',
    },
    {
      title: 'Patient Type',
      dataIndex: 'PATIENTTYPENAME',
      key: 'PATIENTTYPENAME',
      render: (text) => (
        <Tag color={text === 'PUBLIC' ? 'green' : text === 'ZAKAT' ? 'orange' : 'blue'}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'Patient Name',
      dataIndex: 'PATIENTNAME',
      key: 'PATIENTNAME',
    },
    {
      title: 'Net Amount',
      dataIndex: 'NETAMOUNT',
      key: 'NETAMOUNT',
      render: (text) => (
        <span className={`font-medium ${text === 0 ? 'text-gray-400' : 'text-green-600'}`}>
          Rs. {text}
        </span>
      ),
    },
    {
      title: 'Created By',
      dataIndex: 'CREATEDBY',
      key: 'CREATEDBY',
    },
    {
      title: 'Edit By',
      dataIndex: 'EDITBY',
      key: 'EDITBY',
      render: (text) => <span >{text || "-"}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button type="text" icon={<EditOutlined />} size="small" />
        </Space>
      ),
    },
  ];

  const onFinish = (values) => {

    const newParams = {
      fromDate: values.from ? values.from.format('DD-MMM-YYYY') : null,
      toDate: values.to ? values.to.format('DD-MMM-YYYY') : null,
      userId: values.user || null,
      receiptNo: values.receiptNo || null,
      contactNo: values.contactNo || null,
      categoryId: values.opdCategory || null,
      pageNo: 1, // naya search hamesha page 1 se start ho
      pageSize: searchParams.pageSize,
    };

    setSearchParams(newParams); // ye state change useFetch ko naye params ke sath re-run karwayega

  };

  const handleRefresh = () => {

    form.resetFields();
    setSearchParams({
      fromDate: moment().format('DD-MMM-YYYY'),
      toDate: null,
      userId: null,
      receiptNo: null,
      contactNo: null,
      categoryId: null,
      pageNo: 1,
      pageSize: 10,
    });

  };

  // Table pagination change (page badalne ya pageSize badalne par)
  const handleTableChange = (pagination) => {
    setSearchParams(prev => ({
      ...prev,
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
    }));
  };

  return (

    <div className="opd-search-container">

      {/* Filter Section */}
      <Card className="shadow-sm mb-4">

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            from: moment(),
          }}
        >
          <div className="grid grid-cols-6 gap-4">

            <Form.Item name="from" label="From" className="w-full sm:w-auto">
              <DatePicker
                format="DD-MMM-YYYY"
                className="w-full"
              // allowClear={false}
              />
            </Form.Item>

            <Form.Item name="to" label="To" className="w-full sm:w-auto">
              <DatePicker format="DD-MMM-YYYY" className="w-full" />
            </Form.Item>

            <Form.Item
              name="user"
              label={<span className="text-xs font-semibold text-gray-600">User</span>}
              className="mb-0"
            >
              <Select
                placeholder="Select User"
                className="rounded-lg"
                allowClear
                suffixIcon={<span className="text-gray-400">▼</span>}
                showSearch
                filterOption={(input, option) => {
                  return option.children.toLowerCase().includes(input.toLowerCase())
                }}
              >
                {usersData?.data?.map((item, index) => (
                  <Option key={`${item.USERID}-${index}`} value={item?.USERID}>{item?.USERNAME}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="receiptNo" label="Receipt#" className="w-full sm:w-auto">
              <Input placeholder="Receipt number" />
            </Form.Item>

            <Form.Item name="contactNo" label="Contact#" className="w-full sm:w-auto">
              <Input placeholder="Contact number" />
            </Form.Item>

            <Form.Item
              name="opdCategory"
              label={<span className="text-xs font-semibold text-gray-600">OPD Category</span>}
              className="mb-0"
            >
              <Select
                placeholder="Select OPD Category"
                className="rounded-lg"
                allowClear
                suffixIcon={<span className="text-gray-400">▼</span>}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {opdCategoryData?.data?.map(item => (
                  <Option key={item?.ID} value={item?.ID}>{item?.TITLE}</Option>
                ))}
              </Select>
            </Form.Item>

          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
            <Space size="middle">
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
                loading={loading}
              >
                Find
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
                Refresh
              </Button>
            </Space>
            <div className="text-sm text-gray-500">
              Total Records: <span className="font-semibold text-gray-700">{patientsData?.total ?? 0}</span>
            </div>
          </div>
        </Form>
      </Card>

      {/* Table Section */}
      <Card className="shadow-sm">

        <Table
          columns={columns}
          dataSource={patientsData?.data}
          loading={patientsDataLoading}
          rowKey={(record) => record?.RECEIPTNO || `${record.MRNO}-${record.RN}`}
          onChange={handleTableChange}
          pagination={{
            current: searchParams.pageNo,
            pageSize: searchParams.pageSize,
            total: patientsData?.total ?? 0,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          scroll={{ x: 1200 , y: 200 }}
          className="opd-search-table"
          rowClassName="hover:bg-gray-50 transition-colors"
        />
      </Card>

    </div>
  );
};

export default OPDSearch;