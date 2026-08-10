import { useCallback, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Radio,
  Button,
  Table,
  message,
} from "antd";
import dayjs from "dayjs";
import moment from "moment";
import useFetch from "../hooks/useFetch";
import { useSelector } from "react-redux";

const PartialPaymentPage = () => {

  const [form] = Form.useForm();
  const [selectedRow, setSelectedRow] = useState(null);
  const loginUserData = useSelector((state) => state?.authSlice?.loginUser);

  const { data: patientAndHistoryData , loading: patientAndHistoryDataLoading , error: patientAndHistoryDataError, reFetchData: refetchpatientAndHistoryData }
    = useFetch(loginUserData?.username ? `/api/partialPayment/patientHistoryByReceipt/${loginUserData?.username}` : null);

  const onFinish = (values) => {
    console.log("PartialPayment form values:", values);
  };

  const handleNew = useCallback(() => {
    form.resetFields();
    setSelectedRow(null);
  }, [form]);

  const handleDelete = useCallback(() => {
    if (!selectedRow) {
      message.warning("Pehle ek record select karo delete ke liye");
      return;
    }
    // delete API yahan wire hogi
  }, [selectedRow]);

  const handleRowDoubleClick = (record) => {
    setSelectedRow(record);
    form.setFieldsValue({
      receiptNo: record.receiptNo,
      totalBill: record.totalBill,
      amount: record.amount,
      createdBy: record.createdBy,
    });
  };

  const columns = [
    { title: "Receipt*", dataIndex: "receiptNo", key: "receiptNo" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Total Bill", dataIndex: "totalBill", key: "totalBill" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Created By", dataIndex: "createdBy", key: "createdBy" },
    { title: "Edit By", dataIndex: "editBy", key: "editBy" },
    { title: "Terminal Id", dataIndex: "terminalId", key: "terminalId" }
  ];

  // table header ko module-heading wale blue se match karne ke liye header cell override

  return (
    <div className="flex h-full flex-col overflow-hidden">

      {/* Module Heading */}
      <div className="shrink-0 bg-[#1677ff] px-6 py-3 mb-4 rounded-md">
        <h2 className="text-xl font-semibold text-white text-center">
          Partial Payment Information
        </h2>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          date: moment() ,
          amount: 0,
          modeOfPayment: "cash",
        }}
        className="flex-1 min-h-0 overflow-y-auto space-y-4 px-4!"
      >

        {/* Patient Info (left) + Receipt Info (right) side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Left: Patient Info */}
          <fieldset className="border border-gray-300 rounded-md px-4 pb-4 pt-2 col-span-2">

            <legend className="px-2 text-sm font-semibold text-gray-700">
              Patient Info
            </legend>
            <div className="grid grid-cols-3 gap-3">

              <Form.Item label="Receipt. No" name="receiptNo" className="mb-0">
                <Input placeholder="Enter receipt no" />
              </Form.Item>
              <Form.Item label="Patient Name" name="patientName" className="mb-0">
                <Input readOnly />
              </Form.Item>

              {/* Gender + Age half-half same row */}
              <div className="grid grid-cols-2 gap-3">
                <Form.Item label="Gender" name="gender" className="mb-0">
                  <Input readOnly />
                </Form.Item>
                <Form.Item label="Age" name="age" className="mb-0">
                  <InputNumber readOnly className="w-full!" />
                </Form.Item>
              </div>

              <Form.Item label="Adm. Date" name="admissionDate" className="mb-0">
                <Input readOnly />
              </Form.Item>
              <Form.Item label="Contact No" name="contactNo" className="mb-0">
                <Input readOnly />
              </Form.Item>
              <Form.Item label="Consultant" name="consultant" className="mb-0">
                <Input readOnly />
              </Form.Item>

            </div>
          </fieldset>

          {/* Right: Receipt Info (vertical) + Mode of Payment */}
          <div className="grid grid-cols-1 gap-4">

            <fieldset className="border border-gray-300 rounded-md px-4 pb-4 pt-2">

              <legend className="px-2 text-sm font-semibold text-gray-700">
                Receipt Info
              </legend>

              <div className="grid grid-cols-2 gap-3">

                <Form.Item label="Date" name="date" className="mb-0 col-span-2">
                  <DatePicker
                    showTime
                    format="DD-MMM-YYYY hh:mm A"
                    className="w-full!"
                  />
                </Form.Item>

                <Form.Item label="Receipt" name="receipt" className="mb-0">
                  <Input readOnly/>
                </Form.Item>

                <Form.Item
                  label="Amount"
                  name="amount"
                  rules={[{ required: true, message: "Please enter amount" }]}
                  className="mb-0"
                >
                  <InputNumber min={0} className="w-full!" />
                </Form.Item>

              </div>
            </fieldset>

          </div>

        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleNew}>New</Button>

            <Button type="primary" htmlType="submit">
              Save
            </Button>

            <Button>Print</Button>

            <Button danger onClick={handleDelete}>
              Delete
            </Button>
          </div>

          <Form.Item label="Total Balance" name="totalBalance" className="mb-0">
            <Input className="w-50!" />
          </Form.Item>

        </div>

        {/* Advance History */}
        <div>
          <div className="flex items-baseline gap-2 mb-2">
            <h3 className="text-sm font-bold text-gray-800">Advance History</h3>
          </div>
          <Table
            columns={columns}
            dataSource={patientAndHistoryData?.historyData}
            loading={patientAndHistoryDataLoading}
            rowKey={(record) => record.receiptNo}
            size="small"
            pagination={false}
            scroll={{ y: 300 }}
            onRow={(record) => ({
              onDoubleClick: () => handleRowDoubleClick(record),
            })}
          />
        </div>

      </Form>

    </div>
  );
};

export default PartialPaymentPage;