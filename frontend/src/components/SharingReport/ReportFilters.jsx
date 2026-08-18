// components/SharingReport/ReportFilters.jsx
import { DatePicker, Select, Button } from "antd";
import { FilePdfOutlined, SearchOutlined } from "@ant-design/icons";
import moment from "moment";

const { Option } = Select;

const ReportFilters = ({
  isAdmin,
  doctorsList,
  selectedDoctorId,
  onDoctorChange,
  fromDate,           // ✅ Naya prop
  toDate,             // ✅ Naya prop
  onFromDateChange,   // ✅ Naya prop
  onToDateChange,     // ✅ Naya prop
  onGenerate,
  generateLoading,
  showDownload,
  onDownloadPdf,
  pdfLoading,
}) => {


  // console.log(toDate , "toDate ,,,,");
  

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col lg:flex-row lg:items-end gap-4 flex-wrap">

      <h2 className="text-xl font-bold text-gray-700 lg:mr-auto">
        Consultant Sharing Report
      </h2>

      {isAdmin && (
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 mb-1">Consultant</label>
          <Select
            placeholder="Select Consultant"
            size="large"
            className="w-full lg:w-64"
            value={selectedDoctorId}
            onChange={onDoctorChange}
            showSearch
            optionFilterProp="children"
            allowClear
          >
            {doctorsList?.map((doc) => (
              <Option key={doc?.id} value={doc?.id}>
                {doc?.name} {doc?.facultyName ? `— ${doc.facultyName}` : ""}
              </Option>
            ))}
          </Select>
        </div>
      )}

      {/* ✅ From Date */}
      <div className="flex flex-col">
        <label className="text-sm text-gray-500 mb-1">From Date</label>
        <DatePicker
          size="large"
          format="DD-MMM-YYYY"
          value={fromDate}
          onChange={onFromDateChange}
          placeholder="Select From Date"
          className="w-full lg:w-48"
          allowClear={true}
          disabledDate={(current) => {
            if (toDate && current) {
              return current > toDate.endOf('day');
            }
            return false;
          }}
        />
      </div>

      {/* ✅ To Date */}
      <div className="flex flex-col">
        <label className="text-sm text-gray-500 mb-1">To Date</label>
        <DatePicker
          size="large"
          format="DD-MMM-YYYY"
          value={toDate}
          onChange={onToDateChange}
          placeholder="Select To Date"
          className="w-full lg:w-48"
          allowClear={true}
          disabledDate={(current) => {
            // ✅ To Date, From Date se pehle select nahi kar sakte
            return fromDate && current && current < fromDate.startOf('day');
          }}
        />
      </div>

      <Button
        type="primary"
        size="large"
        icon={<SearchOutlined />}
        loading={generateLoading}
        onClick={onGenerate}
      >
        Generate Report
      </Button>

      {showDownload && (
        <Button
          icon={<FilePdfOutlined />}
          size="large"
          loading={pdfLoading}
          onClick={onDownloadPdf}
          className="!bg-red-500 !text-white !border-red-500 hover:!bg-red-600"
        >
          Download PDF
        </Button>
      )}
    </div>
  );
};

export default ReportFilters;