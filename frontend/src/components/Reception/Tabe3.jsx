import { Card, Table, Tabs, Tag } from "antd"


const Tabe3 = () => {

    // ✅ HISTORY TABLE
    const historyColumns = [
        { title: "Date", dataIndex: "date" },
        { title: "Doctor", dataIndex: "doctor" },
        { title: "Token", dataIndex: "token" },
        { title: "Age", dataIndex: "age" },
        { title: "CNIC", dataIndex: "cnic" },
    ];

    const patientHistory = {
        "03001234567": [
            {
                date: "2025-01-12",
                doctor: "Dr. Ahmed Khan",
                token: "T-001",
                age: 28,
                cnic: "42101-1234567-1",
            },
            {
                date: "2025-02-05",
                doctor: "Dr. Sarah Malik",
                token: "T-015",
                age: 28,
                cnic: "42101-1234567-1",
            },
        ],
        "03219876543": [
            {
                date: "2025-01-18",
                doctor: "Dr. Bilal Siddiqui",
                token: "T-009",
                age: 34,
                cnic: "42101-9876543-2",
            },
            {
                date: "2025-02-10",
                doctor: "Dr. Komal Fatima",
                token: "T-020",
                age: 34,
                cnic: "42101-9876543-2",
            },
            {
                date: "2025-02-22",
                doctor: "Dr. Ahmed Khan",
                token: "T-028",
                age: 34,
                cnic: "42101-9876543-2",
            },
        ],

        "03451239876": [
            {
                date: "2025-03-01",
                doctor: "Dr. Hina Rasheed",
                token: "T-035",
                age: 41,
                cnic: "42101-1122334-5",
            },
        ],
    };

    return (
        <>
            {Object.entries(patientHistory).map(([phone, visits]) => (
                <Card key={phone} style={{ marginBottom: 15 }}>
                    <h3>
                        📞 {phone} <Tag color="blue">Total Visits: {visits.length}</Tag>
                    </h3>
                    <Table
                        pagination={false}
                        dataSource={visits}
                        rowKey="token"
                        columns={historyColumns}
                    />
                </Card>
            ))}
        </>

    )
}

export default Tabe3