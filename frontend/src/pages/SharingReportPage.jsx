import { useEffect, useRef, useState } from "react";
import { Spin, Empty } from "antd";
import moment from "moment";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axiosInstance from "../utills/axiosInstance";
import { exportElementToPdf } from "../utills/pdfExport";
import ReportFilters from "../components/SharingReport/ReportFilters";
import ReportPrintable from "../components/SharingReport/ReportPrintable";

const SharingReportPage = () => {
    const loginUserData = useSelector((state) => state?.authSlice?.loginUser);
    const isAdmin = loginUserData?.role === "Admin";

    const [doctorsList, setDoctorsList] = useState([]);
    const [selectedDoctorId, setSelectedDoctorId] = useState(
        isAdmin ? null : loginUserData?.doctorId
    );
    const [fromDate, setFromDate] = useState(moment());
    const [toDate, setToDate] = useState(null);
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pdfLoading, setPdfLoading] = useState(false);

    const printableRef = useRef(null);

    useEffect(() => {
        if (!isAdmin) return;
        const getDoctors = async () => {
            try {
                const res = await axiosInstance.get(`/api/consultants`);
                setDoctorsList(res?.data?.data || []);
            } catch (err) {
                toast.error("Consultant list load nahi ho saki");
            }
        };
        getDoctors();
    }, [isAdmin]);

    const fetchReport = async () => {

        if (!selectedDoctorId) {
            toast.error(isAdmin ? "Select the consultant first" : "Doctor ID missing");
            return;
        }

        if (!fromDate) {
            toast.error("From Date is Required");
            return;
        }

        const effectiveToDate = toDate || fromDate;

        // ✅ Validate with effectiveToDate
        if (fromDate.isAfter(effectiveToDate)) {
            toast.error("From Date, To Date se pehle honi chahiye");
            return;
        }

        setLoading(true);
        try {
            const res = await axiosInstance.get(`/api/doctor/sharingReport`, {
                params: {
                    doctorId: selectedDoctorId,
                    fromDate: fromDate.format("YYYY-MM-DD"),
                    toDate: effectiveToDate.format("YYYY-MM-DD"),
                },
            });
            setReport(res?.data?.data);
        } catch (err) {
            console.log(err, "err .......");
            toast.error(err?.response?.data?.message || "Cannot load reports");
            setReport(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isAdmin && selectedDoctorId) {
            fetchReport();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDownloadPdf = async () => {
        setPdfLoading(true);
        try {
            const fileName = `${report?.consultant?.name || "Doctor"}_Sharing_Report_${report?.period?.fromDate}_to_${report?.period?.toDate}`;
            await exportElementToPdf(printableRef.current, fileName);
        } catch (err) {
            console.error("PDF export failed:", err?.message || err); // 👈 real reason console me
            toast.error(err?.message || "PDF download me error aa gaya");
        } finally {
            setPdfLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <ReportFilters
                isAdmin={isAdmin}
                doctorsList={doctorsList}
                selectedDoctorId={selectedDoctorId}
                onDoctorChange={setSelectedDoctorId}
                fromDate={fromDate}
                toDate={toDate}
                onFromDateChange={setFromDate}
                onToDateChange={setToDate}
                onGenerate={fetchReport}
                generateLoading={loading}
                showDownload={!!report}
                onDownloadPdf={handleDownloadPdf}
                pdfLoading={pdfLoading}
            />

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Spin size="large" />
                </div>
            ) : !report ? (
                <div className="bg-white rounded-xl shadow p-10">
                    <Empty description="Report dekhne ke lie filters set kar ke 'Generate Report' dabayen" />
                </div>
            ) : (
                <ReportPrintable ref={printableRef} report={report} />
            )}
        </div>
    );
};

export default SharingReportPage;