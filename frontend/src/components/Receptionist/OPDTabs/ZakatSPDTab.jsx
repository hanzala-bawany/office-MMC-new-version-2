import React from 'react';
import { Card, Form, Input, Select, DatePicker, InputNumber, Button, Space, Divider } from 'antd';
import { SaveOutlined, EditOutlined, DeleteOutlined, PrinterOutlined, UserAddOutlined } from '@ant-design/icons';
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;
const titleOptions = ["Mr.", "Ms.", "Miss.", "Mrs.", "Master.", "Baby.", "S/O.", "D/O."];
const genders = [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }];

const ZakatSPDTab = () => {
    const [form] = Form.useForm();

    return (
        <Card
            className="shadow-sm rounded-xl border-0"
            style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}
            title={
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-amber-600 rounded-full"></div>
                        <span className="text-lg font-semibold text-gray-800">Zakat / SPD Reception</span>
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">Counter</span>
                    </div>
                    <Space size="small" wrap>
                        <Button type="primary" icon={<UserAddOutlined />} className="bg-gradient-to-r from-blue-500 to-indigo-600 border-0">New</Button>
                        <Button type="primary" icon={<SaveOutlined />} className="bg-gradient-to-r from-emerald-500 to-green-600 border-0">Save</Button>
                        <Button icon={<EditOutlined />}>Edit</Button>
                        <Button danger icon={<DeleteOutlined />}>Delete</Button>
                        <Button icon={<PrinterOutlined />}>Print</Button>
                    </Space>
                </div>
            }
        >
            <Form form={form} layout="vertical" initialValues={{ date: moment(), patientTitle: 'Mr.', gender: 'male' }}>

                {/* TOP: LEFT = Category & Consultant | RIGHT = Patient Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* LEFT */}
                    <div>
                        <Divider orientation="left" className="text-xs font-semibold text-gray-600 !my-1.5">
                            <span className="flex items-center gap-2">
                                <span className="w-1 h-4 bg-gradient-to-b from-orange-400 to-amber-500 rounded-full"></span>
                                Category & Consultant
                            </span>
                        </Divider>
                        <div className="grid grid-cols-2 gap-3">
                            <Form.Item name="category" label={<span className="text-xs font-semibold text-gray-600">Category</span>} rules={[{ required: true }]} initialValue="zakat">
                                <Select allowClear suffixIcon={<span className="text-gray-400">▼</span>}>
                                    <Option value="zakat">Zakat</Option>
                                    <Option value="spd">SPD</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="date" label={<span className="text-xs font-semibold text-gray-600">Date & Time</span>} rules={[{ required: true }]}>
                                <DatePicker showTime format="DD-MMM-YYYY hh:mm" className="w-full" allowClear />
                            </Form.Item>
                            <Form.Item name="consultant" label={<span className="text-xs font-semibold text-gray-600">Consultant</span>} rules={[{ required: true }]} >
                                <Select placeholder="Select Consultant" allowClear showSearch suffixIcon={<span className="text-gray-400">▼</span>}>
                                    <Option value={1}>Dr. Ahmed</Option>
                                    <Option value={2}>Dr. Sara</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="reference" label={<span className="text-xs font-semibold text-gray-600">Approval Ref#</span>} >
                                <Input placeholder="Zakat/SPD approval reference" allowClear />
                            </Form.Item>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div>
                        <Divider orientation="left" className="text-xs font-semibold text-gray-600 !my-1.5">
                            <span className="flex items-center gap-2">
                                <span className="w-1 h-4 bg-gradient-to-b from-orange-400 to-amber-500 rounded-full"></span>
                                Patient Details
                            </span>
                        </Divider>

                        <div className="grid grid-cols-2 gap-3">

                            <div className='flex justify-between gap-4'>
                                <Form.Item
                                    name="patientTitle"
                                    label={<span className="text-xs font-semibold text-gray-600">Title</span>}
                                    rules={[{ required: true }]}
                                    className='w-[50%]'
                                >
                                    <Select allowClear suffixIcon={<span className="text-gray-400">▼</span>}>
                                        {titleOptions.map(t => <Option key={t} value={t}>{t}</Option>)}
                                    </Select>
                                </Form.Item>
                                <Form.Item name="gender" label={<span className="text-xs font-semibold text-gray-600">Gender</span>} rules={[{ required: true }]} className='w-[50%]'>
                                    <Select allowClear suffixIcon={<span className="text-gray-400">▼</span>}>
                                        {genders.map(g => <Option key={g.value} value={g.value}>{g.label}</Option>)}
                                    </Select>
                                </Form.Item>
                            </div>
                            <Form.Item name="patientName" label={<span className="text-xs font-semibold text-gray-600">Patient Name</span>} rules={[{ required: true }]}>
                                <Input placeholder="Enter patient full name" allowClear prefix={<span className="text-gray-400 text-xs">👤</span>} />
                            </Form.Item>
                            <Form.Item name="contact" label={<span className="text-xs font-semibold text-gray-600">Contact #</span>} rules={[{ required: true }]}>
                                <Input placeholder="Enter contact number" allowClear prefix={<span className="text-gray-400 text-xs">📞</span>} />
                            </Form.Item>
                            <Form.Item name="remarks" label={<span className="text-xs font-semibold text-gray-600">Remarks</span>}>
                                <TextArea placeholder="Enter any remarks" rows={1} allowClear />
                            </Form.Item>

                        </div>

                    </div>

                </div>

                {/* PAYMENT */}
                <Divider orientation="left" className="text-xs font-semibold text-gray-600 !my-2">
                    <span className="flex items-center gap-2">
                        <span className="w-1 h-4 bg-linear-to-r from-green-400 to-emerald-500 rounded-full"></span>
                        Payment Details
                    </span>
                </Divider>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Form.Item name="grossPayment" label={<span className="text-xs font-semibold text-gray-600">Gross Payment</span>} rules={[{ required: true }]}>
                        <InputNumber className="w-full!" min={0} allowClear prefix={<span className="text-gray-400 text-xs">Rs.</span>} />
                    </Form.Item>
                    <Form.Item name="discountAmount" label={<span className="text-xs font-semibold text-gray-600">Zakat/SPD Amount</span>}>
                        <InputNumber className="w-full!" min={0} allowClear prefix={<span className="text-gray-400 text-xs">Rs.</span>} />
                    </Form.Item>
                    <Form.Item name="netPayment" label={<span className="text-xs font-semibold text-gray-600">Net Payment</span>} rules={[{ required: true }]}>
                        <InputNumber className="w-full!" min={0} allowClear prefix={<span className="text-gray-400 text-xs">Rs.</span>} />
                    </Form.Item>
                    <Form.Item name="balancePayment" label={<span className="text-xs font-semibold text-gray-600">Balance</span>}>
                        <InputNumber className="w-full!" min={0} allowClear prefix={<span className="text-gray-400 text-xs">Rs.</span>} />
                    </Form.Item>
                </div>

                {/* REFUND */}
                <div className="flex flex-wrap justify-between gap-3 mt-4 bg-gradient-to-r from-red-50/70 to-orange-50/70 p-2 rounded-xl border border-red-200/50">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-red-600">Refund Information</span>
                        <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-medium rounded-full">Optional</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/60 p-1.5 rounded-lg">
                        <span className="text-xs font-medium text-gray-500">Refund By:</span>
                        <Form.Item name="refundBy" noStyle>
                            <Select placeholder="Select User" allowClear showSearch style={{ minWidth: 150 }}>
                                <Option value="u1">Ahmed</Option>
                                <Option value="u2">Sara</Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="flex items-center gap-3 bg-white/60 p-1.5 rounded-lg">
                        <span className="text-xs font-medium text-gray-500">Refund Date:</span>
                        <span className="text-sm font-semibold text-gray-800">16-Jul-2026 01:44 PM</span>
                    </div>
                </div>

            </Form>
        </Card>
    );
};

export default ZakatSPDTab;