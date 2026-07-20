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
  Badge
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  FilterOutlined,
  EyeOutlined,
  EditOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const OPDSearch = () => {

  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Mock data - replace with actual API data
  const mockData = [
    {
      key: '1',
      tokenNo: 50,
      voucher: 'OP-03001337',
      date: '16-Jul-2026',
      category: 'Consultant',
      consultant: 'Kulsoom Bhati',
      patientType: 'PUBLIC',
      patientName: 'Dua Nouman',
      amount: 900,
      createdBy: 'ZohraZakaria',
    },
    {
      key: '2',
      tokenNo: 49,
      voucher: 'OP-03001336',
      date: '16-Jul-2026',
      category: 'Consultant',
      consultant: 'Kulsoom Bhati',
      patientType: 'PUBLIC',
      patientName: 'Hina Aslam',
      amount: 900,
      createdBy: 'sakina',
    },
    {
      key: '3',
      tokenNo: 5,
      voucher: 'OP-03001335',
      date: '16-Jul-2026',
      category: 'Consultant',
      consultant: 'Saad Hassan',
      patientType: 'ZAKAT',
      patientName: 'Imran',
      amount: 0,
      createdBy: 'Sobia',
    },
    {
      key: '4',
      tokenNo: 52,
      voucher: 'OP-03001334',
      date: '16-Jul-2026',
      category: 'General O.P.D',
      consultant: 'Md. Jawaid',
      patientType: 'PUBLIC',
      patientName: 'Ambreen Adil',
      amount: 200,
      createdBy: 'ZohraZakaria',
    },
    {
      key: '5',
      tokenNo: 0,
      voucher: 'OP-03001333',
      date: '16-Jul-2026',
      category: 'Medical Services',
      consultant: 'Shumailla (R)',
      patientType: 'PUBLIC',
      patientName: 'Aliha',
      amount: 200,
      createdBy: 'sakina',
    },
    {
      key: '6',
      tokenNo: 0,
      voucher: 'OP-03001333',
      date: '16-Jul-2026',
      category: 'Medical Services',
      consultant: 'Shumailla (R)',
      patientType: 'PUBLIC',
      patientName: 'Aliha',
      amount: 200,
      createdBy: 'sakina',
    }
    ,
    {
      key: '7',
      tokenNo: 0,
      voucher: 'OP-03001333',
      date: '16-Jul-2026',
      category: 'Medical Services',
      consultant: 'Shumailla (R)',
      patientType: 'PUBLIC',
      patientName: 'Aliha',
      amount: 200,
      createdBy: 'sakina',
    },
    {
      key: '8',
      tokenNo: 0,
      voucher: 'OP-03001333',
      date: '16-Jul-2026',
      category: 'Medical Services',
      consultant: 'Shumailla (R)',
      patientType: 'PUBLIC',
      patientName: 'Aliha',
      amount: 200,
      createdBy: 'sakina',
    },
  ];

  const columns = [
    {
      title: 'Token No',
      dataIndex: 'tokenNo',
      key: 'tokenNo',
      width: 80,
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Voucher #',
      dataIndex: 'voucher',
      key: 'voucher',
      render: (text) => <span className="text-blue-600">{text}</span>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 120,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Consultant',
      dataIndex: 'consultant',
      key: 'consultant',
    },
    {
      title: 'Patient Type',
      dataIndex: 'patientType',
      key: 'patientType',
      render: (text) => (
        <Tag color={text === 'PUBLIC' ? 'green' : text === 'ZAKAT' ? 'orange' : 'blue'}>
          {text}
        </Tag>
      ),
    },
    {
      title: 'Patient Name',
      dataIndex: 'patientName',
      key: 'patientName',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => (
        <span className={`font-medium ${text === 0 ? 'text-gray-400' : 'text-green-600'}`}>
          Rs. {text}
        </span>
      ),
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Button type="text" icon={<EyeOutlined />} size="small" />
          <Button type="text" icon={<EditOutlined />} size="small" />
        </Space>
      ),
    },
  ];

  const handleSearch = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleRefresh = () => {
    setSearchText('');
    handleSearch();
  };

  return (

    <div className="opd-search-container">

      {/* Filter Section */}
      <Card className="shadow-sm mb-4">

        <Row gutter={[16, 12]} align="bottom">
          <Col xs={24} sm={12} md={4}>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 mb-1">From</label>
              <DatePicker
                defaultValue={dayjs('2026-07-16')}
                format="DD-MMM-YYYY"
                className="w-full"
              />
            </div>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 mb-1">To</label>
              <DatePicker format="DD-MMM-YYYY" className="w-full" />
            </div>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 mb-1">Users</label>
              <Select placeholder="Select User" className="w-full" allowClear>
                <Select.Option value="all">All Users</Select.Option>
                <Select.Option value="zohra">ZohraZakaria</Select.Option>
                <Select.Option value="sakina">Sakina</Select.Option>
                <Select.Option value="sobia">Sobia</Select.Option>
              </Select>
            </div>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 mb-1">Receipt#</label>
              <Input placeholder="Receipt number" />
            </div>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 mb-1">Contact#</label>
              <Input placeholder="Contact number" />
            </div>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-600 mb-1">OPD Category</label>
              <Select placeholder="All Categories" className="w-full" allowClear>
                <Select.Option value="all">All Categories</Select.Option>
                <Select.Option value="general">General O.P.D</Select.Option>
                <Select.Option value="consultant">Consultant</Select.Option>
                <Select.Option value="medical">Medical Services</Select.Option>
                <Select.Option value="dental">Dental</Select.Option>
              </Select>
            </div>
          </Col>
        </Row>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          <Space size="middle">
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              loading={loading}
            >
              Find
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
              Refresh
            </Button>
          </Space>
          <div className="text-sm text-gray-500">
            Total Records: <span className="font-semibold text-gray-700">540</span>
          </div>
        </div>
      </Card>

      {/* Table Section */}
      <Card className="shadow-sm">

        <Table
          columns={columns}
          dataSource={mockData}
          loading={loading}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} records`,
          }}
          scroll={{ x: 1200 }}
          className="opd-search-table"
          rowClassName="hover:bg-gray-50 transition-colors"
        />
      </Card>

    </div>
  );
};

export default OPDSearch;