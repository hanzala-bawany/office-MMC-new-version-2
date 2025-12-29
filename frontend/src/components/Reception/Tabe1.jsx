import { useMemo, useState } from "react";
import {
    Card,
    Form,
    Input,
    Select,
    Button,
    Table,
    Tag,
    Radio,
    message,
} from "antd";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import moment from "moment";
import { base_URL } from "../../utills/baseUrl";
import axios from "axios";
import { toast } from "react-toastify";

const { Option } = Select;

const Tabe1 = () => {

    const doctorsData = useSelector(state => state?.doctorSlice?.doctorsData);
    const [form] = Form.useForm();
    const [queues, setQueues] = useState({});
    const [tokenCounters, setTokenCounters] = useState({});
    const [patientHistory, setPatientHistory] = useState({});
    const [previewHistory, setPreviewHistory] = useState([]);
    const [isOldPatient, setIsOldPatient] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);
    const [addPatientLoading, setAddPatientLoading] = useState(false);


    // console.log(doctorsData, "doctors data inb tabe 1");

    const todayDoctors = useMemo(() => {

        const today = moment().format("ddd");
        return doctorsData.filter((item) => {
            const days = item?.SCHEDULE_SUMMARY?.split(", ").map((it) => it.slice(0, 3));
            return days.includes(today);
        });

    }, [doctorsData]);


    // ✅ AUTO CHECK HISTORY BY PHONE
    const handlePhoneChange = (phone) => {
        if (patientHistory[phone]) {
            setPreviewHistory(patientHistory[phone]);
            setIsOldPatient(true);
        } else {
            setPreviewHistory([]);
            setIsOldPatient(false);
        }
    };

    // ✅ TOKEN GENERATOR
    const generateToken = (doctor) => {
        const doc = todayDoctors.find((d) => d?.DOCTOR_NAME === doctor);
        const prefix = doc?.DOCTOR_ID.slice(2);
        const next = (tokenCounters[doctor] || 0) + 1;

        setTokenCounters((prev) => ({
            ...prev,
            [doctor]: next,
        }));

        return `${prefix}-${next}`;
    };

    // ✅ ADD / EDIT PATIENT
    const onFinish = async (values) => {

        console.log(values, "values");

        const { doctor, room, ...addPatientData } = values

        try {
            setAddPatientLoading(true);
            const res = await axios.post(`${base_URL}/api/patient/add`, addPatientData);
            toast.success(res?.data?.message)
            // console.log(res, "res of ADD  PATIENT");
        }
        catch (err) {
            // console.log(err, "error in ADD  PATIENT");
            toast.error(err?.response?.data?.message)
        }
        finally {
            setAddPatientLoading(false);
        }


        // if (editingPatient) {
        //     // ✅ EDIT PATIENT
        //     setQueues((prev) => {
        //         const updated = prev[editingPatient.doctor].map((p) =>
        //             p.token === editingPatient.token ? { ...p, ...values } : p
        //         );
        //         return { ...prev, [editingPatient.doctor]: updated };
        //     });

        //     message.success("Patient Updated Successfully");
        //     setEditingPatient(null);
        //     form.resetFields();
        //     return;
        // }

        // // ✅ NEW PATIENT
        // const token = generateToken(values.doctor);

        // const visit = {
        //     date: dayjs().format("YYYY-MM-DD"),
        //     doctor: values.doctor,
        //     token,
        //     phone: values.phone,
        //     age: values.age,
        //     cnic: values.cnic || "-",
        // };

        // const newPatient = {
        //     token,
        //     phone: values.phone,
        //     name: isOldPatient ? "Existing Patient" : values.name,
        //     gender: values.gender,
        //     age: values.age,
        //     cnic: values.cnic || "-",
        //     doctor: values.doctor,
        // };

        // // ✅ QUEUE
        // setQueues((prev) => ({
        //     ...prev,
        //     [values.doctor]: prev[values.doctor]
        //         ? [...prev[values.doctor], newPatient]
        //         : [newPatient],
        // }));

        // // ✅ HISTORY
        // setPatientHistory((prev) => ({
        //     ...prev,
        //     [values.phone]: prev[values.phone]
        //         ? [...prev[values.phone], visit]
        //         : [visit],
        // }));

        // form.resetFields();
        // setPreviewHistory([]);
        // setIsOldPatient(false);
    };

    // ✅ EDIT HANDLER
    const handleEdit = (patient) => {
        setEditingPatient(patient);
        form.setFieldsValue(patient);
    };

    // ✅ cancel btn HANDLER
    const cancelFormHandler = () => {
         form.resetFields();
    };





    return (
        <div className="flex flex-col gap-6">

            {/* ADD PATIENT CARD */}
            <Card title="Generate Token">
                <Form
                    layout="vertical"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                    form={form}
                    onFinish={onFinish}
                >
                    <Form.Item label="Today Date">
                        <Input value={dayjs().format("DD-MM-YYYY")} disabled />
                    </Form.Item>

                    <Form.Item
                        name="doctor"
                        label="Select Doctor"
                        rules={[{ required: true }]}
                    >
                        <Select placeholder="Select Doctor">
                            {todayDoctors.map((doc) => (
                                <Option key={doc?.DOCTOR_ID} value={doc?.DOCTOR_NAME}>
                                    {doc?.DOCTOR_NAME}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="name" label="Patient Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="father_name" label="Father Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="age" label="Age" rules={[{ required: true }]}>
                        <Input type="number" />
                    </Form.Item>

                    <Form.Item name="room" label="Room" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Phone Number"
                        rules={[{ required: true }]}
                    >
                        <Input onChange={(e) => handlePhoneChange(e.target.value)} />
                    </Form.Item>

                    <Form.Item
                        name="gender"
                        label="Gender"
                        rules={[{ required: true }]}
                    >
                        <Radio.Group>
                            <Radio value="M">Male</Radio>
                            <Radio value="F">Female</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <div
                        className="mb-4"
                        style={{ visibility: isOldPatient ? "visible" : "hidden" }}
                    >
                        <Tag color="blue">Old Patient — Only Token Generated</Tag>
                    </div>

                    <Button loading={addPatientLoading} className="mb-4" type="primary" htmlType="submit">
                        Add
                    </Button>

                    <Button type="primary" >
                        {editingPatient ? "Update Patient" : "Generate Token"}
                    </Button>

                    <Button onClick={cancelFormHandler} type="primary"  className="!bg-red-600 hover:!bg-red-700 !border-red-600" >
                        Cancel
                    </Button>
                </Form>
            </Card>

            {/* LIVE QUEUE */}
            <Card title="Doctor Queues">
                {Object.entries(queues).map(([doctor, patients]) => (
                    <Card key={doctor} style={{ marginBottom: 15 }}>
                        <h3 className="my-4">
                            <span className="text-[18px] font-[500]">{doctor}</span> <Tag color="blue">Live Queue</Tag>
                        </h3>

                        <Table
                            pagination={false}
                            dataSource={patients}
                            rowKey="token"
                            columns={[
                                { title: "Token", dataIndex: "token" },
                                { title: "Name", dataIndex: "name" },
                                { title: "Phone", dataIndex: "phone" },
                                { title: "Age", dataIndex: "age" },
                                { title: "CNIC", dataIndex: "cnic" },
                                { title: "Gender", dataIndex: "gender" },
                                {
                                    title: "Action",
                                    render: (_, row) => (
                                        <Button onClick={() => handleEdit(row)} type="link">
                                            Edit
                                        </Button>
                                    ),
                                },
                            ]}
                        />
                    </Card>
                ))}
            </Card>

        </div>
    )
}

export default Tabe1