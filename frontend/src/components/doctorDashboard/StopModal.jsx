import { Button, Input, Modal, Select } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import { useState } from "react";
import axios from "axios";
import { base_URL } from "../../utills/baseUrl";
import { toast } from "react-toastify";

const StopModal = ({
  isOpen,
  onClose,
  startBreak,
  loginUserData,
  currentPatientsData,
  formData,
  docPatientData,
  setFormData,
}) => {
  const [isBreakLoading, setIsBreakLoading] = useState(false);
  const [breakMessage, setBreakMessage] = useState("");

  const handleClose = () => {
    setBreakMessage("");
    onClose();
  };

  const breakHandler = async () => {
    try {
      setIsBreakLoading(true);
      const res = await axios.post(`${base_URL}/api/opd/doctor/stop`, {
        doctorId: loginUserData?.doctorId,
        receiptNo: currentPatientsData?.RECEIPTNO || null,
        remarks: formData?.primaryComplain || null,
        primaryDiagnosis: formData?.primaryDiagnosis || null,
        medicalTests: formData?.medicalTests || null,
        treatment: formData?.treatment || null,
        medicine: formData?.medicines || null,
        medicalPlan: formData?.medicinePlan || null,
        breakMessage: breakMessage,
      });
      // console.log(res, "res of break Handler by id");
      await docPatientData();

      setFormData({
        primaryDiagnosis: [],
        medicalTests: [],
        treatment: "",
        primaryComplain: "",
        medicines: [],
        medicinePlan: "",
      });
      toast.success(`This patinet is checked and remaining Patients Stopped Susseccfully`);
      startBreak();
      handleClose();
    } catch (err) {
      console.log(err, "error in next Handler");
      toast.error(err?.message);
    } finally {
      setIsBreakLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <WarningOutlined className="text-yellow-400" />
          <span className="text-white font-semibold text-base">
            Stop Patient
          </span>
        </div>
      }
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      centered
      width={480}
      styles={{
        header: {
          background: "linear-gradient(135deg, #ef4444, #dc2626)",
          padding: "16px 24px",
          borderRadius: "16px 16px 0 0",
          borderBottom: "none",
        },
        body: { padding: "24px" },
        content: {
          borderRadius: "16px",
          overflow: "hidden",
        },
      }}
    >
      {/* Warning Alert */}
      <div className="mb-5 p-3 bg-red-50 rounded-xl border border-red-200 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <svg
            className="w-4 h-4 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-red-800 text-sm">Warning</p>
          <p className="text-xs text-red-600 mt-0.5">
            This action cannot be undone. Your message will replace the patient
            data on screen.
          </p>
        </div>
      </div>

      {/* Message Input */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message <span className="text-red-500">*</span>
        </label>

        <Input.TextArea
          placeholder="Write a message explaining why patient is being stopped..."
          rows={2}
          maxLength={30}
          showCount
          value={breakMessage}
          onChange={(e) => setBreakMessage(e.target.value)}
          className="resize-none rounded-lg"
          style={{ resize: "none" }}
          status={!breakMessage.trim() && isBreakLoading ? "error" : ""}
        />
  
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
        <Button
          onClick={handleClose}
          className="h-10 px-5 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button
          type="primary"
          danger
          className="bg-red-600 hover:bg-red-700 border-none h-10 px-5 rounded-lg font-medium shadow-sm"
          loading={isBreakLoading}
          onClick={breakHandler}
        >
          STOP PATIENT
        </Button>
      </div>
    </Modal>
  );
};

export default StopModal;

// import { Button, Input, Modal, Select } from "antd"

// const StopModal = ({ isOpen, onClose }) => {

//     const handleClose = () => {
//         onClose();
//     };

//     return (

//         <Modal
//             title={
//                 <span className="text-white font-semibold text-base">
//                     Stop patients
//                 </span>
//             }
//             open={isOpen}
//             onCancel={handleClose}
//             footer={null}
//             centered
//             styles={{
//                 header: {
//                     background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
//                     padding: "14px 20px",
//                     borderRadius: "8px 8px 0 0",
//                 },
//                 body: { padding: "20px" },
//             }}
//         >

//             {/* Vitals Grid */}
//             <div className="flex flex-col gap-4">
//                 <div>

//                 </div>

//                 <Input placeholder="Write a message ">

//                 </Input>
//             </div>

//             {/* Footer Buttons */}
//             <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
//                 <Button onClick={handleClose}>Cancel</Button>
//                 <Button
//                     type="primary"
//                     // loading={loading}
//                     className="bg-indigo-600 border-none"
//                 // onClick={saveVitalsHandler}
//                 >
//                     STOP
//                 </Button>
//             </div>

//         </Modal>
//     )
// }

// export default StopModal
