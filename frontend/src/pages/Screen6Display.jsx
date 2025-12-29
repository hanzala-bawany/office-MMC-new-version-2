import React from "react";
import { Card, Row, Col, Typography } from "antd";
import logo from "../assets/MMC logo.png";

const { Title, Text } = Typography;

const Screen6Display = () => {
  const doctors = [
    { doctorId: 1, doctorName: "Dr. Ahmed", patient: { token: "A-12", name: "Ali Khan", age: 35 } },
    { doctorId: 2, doctorName: "Dr. Sana", patient: { token: "B-07", name: "Ayesha Malik", age: 28 } },
    { doctorId: 3, doctorName: "Dr. Usman", patient: { token: "C-03", name: "Hassan Raza", age: 41 } },
    { doctorId: 4, doctorName: "Dr. Hina", patient: { token: "D-09", name: "Fatima Noor", age: 32 } },
    { doctorId: 5, doctorName: "Dr. Bilal", patient: { token: "E-02", name: "Zain Ahmed", age: 22 } },
    { doctorId: 6, doctorName: "Dr. Farooq", patient: { token: "F-15", name: "Imran Sheikh", age: 50 } },
  ];

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#001f3f] via-[#003366] to-[#00162a] p-10 overflow-hidden">

      {/* 🔹 TOP LEFT BRAND */}
      <div className="flex absolute top-4 left-4 items-center gap-4">
        <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-[#00b0ff]/30">
          <img src={logo} alt="logo" className="h-14 w-14 object-contain" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide drop-shadow">
            Memon Medical Complex
          </h1>
          <p className="text-[#a7c8e8] italic text-sm">
            “Serving with Excellence & Care”
          </p>
        </div>
      </div>

      {/* 🔹 CENTER TITLE */}
      <Title
        level={1}
        style={{
          textAlign: "center",
          color: "white",
          marginBottom: 60,
          fontSize: "52px",
          letterSpacing: "1px",
        }}
      >
        Now Serving Patients
      </Title>

      {/* 🔹 DOCTOR CARDS */}
      <Row gutter={[40, 40]} justify="center">
        {doctors.map((doc) => (
          <Col key={doc.doctorId} xs={24} sm={12} lg={8}>
            <Card
              bordered={false}
              style={{
                height: "100%",
                borderRadius: "22px",
                background: "linear-gradient(180deg, #ffffff, #f1f9ff)",
                boxShadow: "0 20px 45px rgba(0,0,0,0.25)",
              }}
              headStyle={{
                background: "linear-gradient(90deg, #00b0ff, #0077ff)",
                borderRadius: "22px 22px 0 0",
                textAlign: "center",
                padding: "20px",
              }}
              title={
                <span style={{ fontSize: "26px", color: "#fff", fontWeight: 700 }}>
                  {doc.doctorName}
                </span>
              }
              bodyStyle={{ textAlign: "center", padding: "45px" }}
            >
              <Text style={{ fontSize: "22px", color: "#555" }}>Token Number</Text>

              <div
                style={{
                  fontSize: "64px",
                  fontWeight: "bold",
                  color: "#d81b60",
                  margin: "20px 0 35px",
                }}
              >
                {doc.patient.token}
              </div>

              <Text style={{ fontSize: "20px", color: "#555" }}>Patient Name</Text>
              <div style={{ fontSize: "30px", fontWeight: 600, color: "#003366", marginTop: 10 }}>
                {doc.patient.name}
              </div>

              <div style={{ marginTop: 25, fontSize: "22px", color: "#003366" }}>
                Age: <strong>{doc.patient.age}</strong>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Screen6Display;