import { Card, Table, Tabs } from "antd";

const Tabe2 = () => {
    // ✅ HISTORY TABLE
    const historyColumns = [
        { title: "Date", dataIndex: "date" },
        { title: "Doctor", dataIndex: "doctor" },
        { title: "Token", dataIndex: "token" },
        { title: "Age", dataIndex: "age" },
        { title: "CNIC", dataIndex: "cnic" },
    ];

    const previewHistory = [
        {
            date: "2025-01-12",
            doctor: "Dr. Ahmed Khan",
            token: "T-001",
            age: 28,
            cnic: "42101-1234567-1",
        },
        {
            date: "2025-01-15",
            doctor: "Dr. Sarah Malik",
            token: "T-002",
            age: 34,
            cnic: "42101-9876543-2",
        },
        {
            date: "2025-01-20",
            doctor: "Dr. Bilal Siddiqui",
            token: "T-003",
            age: 42,
            cnic: "42101-1112223-4",
        },
    ];


    return (

        <Card title="📜Patient History">
            <Table
                dataSource={previewHistory}
                columns={historyColumns}
                rowKey="token"
                locale={{ emptyText: "No History Found" }}
            />
        </Card>

    )
}

export default Tabe2