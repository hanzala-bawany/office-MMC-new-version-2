import { Card, Row, Col, Typography } from "antd";

const { Title, Text } = Typography;

const Screen7Display = () => {
  // Dummy data
  const doctors = [
    {
      doctorId: 1,
      doctorName: "Dr. Ahmed",
      patient: {
        token: "A-12",
        name: "Ali Khan",
        age: 35,
      },
    },
    {
      doctorId: 2,
      doctorName: "Dr. Sana",
      patient: {
        token: "B-07",
        name: "Ayesha Malik",
        age: 28,
      },
    },
    {
      doctorId: 3,
      doctorName: "Dr. Usman",
      patient: {
        token: "C-03",
        name: "Hassan Raza",
        age: 41,
      },
    },
    {
      doctorId: 4,
      doctorName: "Dr. Hina",
      patient: {
        token: "D-09",
        name: "Fatima Noor",
        age: 32,
      },
    },
    {
      doctorId: 5,
      doctorName: "Dr. Bilal",
      patient: {
        token: "E-02",
        name: "Zain Ahmed",
        age: 22,
      },
    },
    {
      doctorId: 6,
      doctorName: "Dr. Farooq",
      patient: {
        token: "F-15",
        name: "Imran Sheikh",
        age: 50,
      },
    },
  ];

  return (
    <div
      style={{
        padding: "40px 20px",
        background: "linear-gradient(135deg, #e0f7fa, #fff)",
        minHeight: "100vh",
      }}
    >
      <Title
        level={1}
        style={{
          textAlign: "center",
          marginBottom: 50,
          color: "#006064",
          fontWeight: "bold",
        }}
      >
        Current Patient Queue Display
      </Title>

      <Row gutter={[32, 32]} justify="center">
        {doctors.map((doc) => (
          <Col key={doc.doctorId} xs={24} sm={12} md={12} lg={8} xl={8}>
            <Card
              hoverable
              title={
                <Title level={3} style={{ margin: 0, color: "#006064" }}>
                  {doc.doctorName}
                </Title>
              }
              headStyle={{
                background: "linear-gradient(to right, #00bcd4, #0097a7)",
                color: "white",
                fontSize: "24px",
                textAlign: "center",
                borderRadius: "15px 15px 0 0",
              }}
              bodyStyle={{ padding: "40px", textAlign: "center" }}
              style={{
                borderRadius: "15px",
                boxShadow: "0 8px 20px rgba(0, 123, 255, 0.15)",
                background: "#ffffff",
                transition: "all 0.3s ease",
                height: "100%",
              }}
            >
              <div style={{ marginBottom: 30 }}>
                <Text style={{ fontSize: "18px", color: "#555" }}>Token No:</Text>
                <Title
                  level={2}
                  style={{
                    margin: "10px 0 0",
                    color: "#d81b60",
                    fontSize: "48px",
                  }}
                >
                  {doc.patient.token}
                </Title>
              </div>

              <div style={{ marginBottom: 30 }}>
                <Text style={{ fontSize: "18px", color: "#555" }}>Patient Name:</Text>
                <Title level={3} style={{ margin: "10px 0 0", color: "#006064" }}>
                  {doc.patient.name}
                </Title>
              </div>

              <div>
                <Text style={{ fontSize: "18px", color: "#555" }}>Age:</Text>
                <Title level={3} style={{ margin: "10px 0 0", color: "#006064" }}>
                  {doc.patient.age} years
                </Title>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Screen7Display;