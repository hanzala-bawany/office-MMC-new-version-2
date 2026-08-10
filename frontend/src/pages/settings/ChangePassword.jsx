import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const ChangePassword = () => {
    const [form] = Form.useForm();

    // saare inputs yahan console me mil jayenge, API wiring baad me
    const onFinish = (values) => {
        console.log("ChangePassword form values:", values);
    };

    const handleReset = () => {
        form.resetFields();
        // navigate/modal-close jo bhi tumhara flow ho, yahan laga dena
    };

    return (
        <div className="flex justify-center">
            <div className="flex h-full flex-col overflow-hidden rounded-md border border-gray-300 shadow-sm w-[65%]! mt-5">

                {/* Module Heading */}
                <div className="shrink-0 bg-[#1677ff] px-6 py-4">
                    <h2 className="text-xl font-semibold text-white">
                        Change Password
                    </h2>
                </div>

                {/* Fields */}
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className="flex-1 min-h-0 overflow-y-auto bg-gray-50 p-5! grid grid-cols-1 lg:grid-cols-2 gap-4"
                >
                    <Form.Item
                        label="User Id"
                        name="userId"
                        rules={[{ required: true, message: "Please enter User Id" }]}
                        className="mb-3"
                    >
                        <Input
                            placeholder="Enter user id"
                            prefix={<UserOutlined className="text-gray-400" />}
                            readOnly 
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Old Password"
                        name="oldPassword"
                        rules={[{ required: true, message: "Please enter old password" }]}
                        className="mb-3"
                    >
                        <Input.Password
                            placeholder="Enter old password"
                            prefix={<LockOutlined className="text-gray-400" />}
                             size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="New Password"
                        name="newPassword"
                        rules={[
                            { required: true, message: "Please enter new password" },
                            { min: 6, message: "Password must be at least 6 characters" },
                        ]}
                        className="mb-3"
                    >
                        <Input.Password
                            placeholder="Enter new password"
                            prefix={<LockOutlined className="text-gray-400" />}
                             size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        dependencies={["newPassword"]}
                        rules={[
                            { required: true, message: "Please enter confirm password" },
                            { min: 6, message: "Password must be at least 6 characters" },
                        ]}
                        className="mb-0"
                    >
                        <Input.Password
                            placeholder="Confirm new password"
                            prefix={<LockOutlined className="text-gray-400" />}
                             size="large"
                        />
                    </Form.Item>

                </Form>

                {/* Footer actions */}
                <div className="shrink-0 flex justify-center gap-4 border-t border-gray-300 bg-[#c4cdf37a] px-4 py-3">
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="min-w-[90px]"
                    >
                        Save
                    </Button>
                    <Button onClick={handleReset} className="min-w-22.5">
                        Reset
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;