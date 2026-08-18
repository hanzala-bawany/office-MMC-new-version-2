// components/SharingReport/ReportPrintable.jsx
import { forwardRef } from "react";
import moment from "moment";
import {
    TeamOutlined,
    DollarCircleOutlined,
    PercentageOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    StopOutlined,
    CloseCircleOutlined,
    MedicineBoxOutlined,
    HeartOutlined,
    UsergroupAddOutlined,
} from "@ant-design/icons";
import { FaMale, FaFemale } from "react-icons/fa";
import MMCLogo from "../../assets/MMC logo.png";

const money = (val) => `Rs. ${Number(val || 0).toLocaleString("en-PK")}`;

// ---- small building blocks — sab plain divs, koi SVG chart nahi, isliye
// PDF (html2canvas) me bhi hubahu waisa hi crisp render hoga jaisa screen pe dikhta he ----

const StatCard = ({ icon, label, value, isCurrency, tone = "slate" }) => {
    const toneMap = {
        slate: "bg-slate-50 text-slate-700 border-slate-200",
        blue: "bg-blue-50 text-blue-700 border-blue-200",
        green: "bg-emerald-50 text-emerald-700 border-emerald-200",
        orange: "bg-amber-50 text-amber-700 border-amber-200",
        red: "bg-rose-50 text-rose-700 border-rose-200",
    };
    return (
        <div className={`rounded-xl border p-4 flex items-start gap-3 ${toneMap[tone]}`}>
            <div className="text-lg mt-0.5 opacity-80">{icon}</div>
            <div>
                <p className="text-xs font-medium opacity-70">{label}</p>
                <p className="text-lg font-bold mt-0.5 leading-tight">
                    {isCurrency ? money(value) : (value ?? 0)}
                </p>
            </div>
        </div>
    );
};

const SectionHeader = ({ title, subtitle }) => (
    <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
);

// Age-group / gender / patient-type ke liye horizontal progress bar row
const BarRow = ({ label, value, total, color }) => {
    const pct = total > 0 ? Math.round((value / total) * 100) : 0;
    return (
        <div className="mb-3 last:mb-0">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>{label}</span>
                <span className="font-semibold text-slate-700">{value} ({pct}%)</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );
};

// ab OPD / IPD dono apna alag row banate hen — data seedha report.opd / report.ipd se aata he
const RevenueRow = ({ label, icon, data, isLast }) => (
    <tr className={`${isLast ? "" : "border-b border-slate-100"}`}>
        <td className="p-3 font-medium text-slate-700 flex items-center gap-2">
            <span className="text-slate-400">{icon}</span> {label}
        </td>
        <td className="p-3 text-right text-slate-600">{data?.patients ?? 0}</td>
        <td className="p-3 text-right text-slate-600">{money(data?.gross)}</td>
        <td className="p-3 text-right text-slate-600">{money(data?.total_charges)}</td>
        <td className="p-3 text-right text-slate-600">{money(data?.net_after_charges)}</td>
        <td className="p-3 text-right text-slate-600">
            {data?.consultant_share_percent != null ? `${data.consultant_share_percent}%` : "—"}
        </td>
        <td className="p-3 text-right font-semibold text-slate-800">
            {money(data?.consultant_share)}
        </td>
    </tr>
);

// forwardRef zaroori he — parent isi DOM node ko html2canvas se screenshot karke PDF banata he
const ReportPrintable = forwardRef(
    ({ report }, ref) => {

        const { period, consultant, summary, opd, ipd, combined_demographics, combined_patient_types } = report;

        const genderTotal =
            combined_demographics.gender.male + combined_demographics.gender.female;

        const ageTotal =
            combined_demographics.age_groups.infant +
            combined_demographics.age_groups.child +
            combined_demographics.age_groups.teen +
            combined_demographics.age_groups.adult +
            combined_demographics.age_groups.senior;

        const patientTypeTotal =
            combined_patient_types.public +
            combined_patient_types.zakat +
            combined_patient_types.bmj +
            combined_patient_types.spd;

        return (
            <div ref={ref} className="bg-white rounded-2xl shadow-md overflow-hidden max-w-5xl mx-auto">

                {/* ---- Header: gradient banner, doctor info left, logo right ---- */}
                <div className="bg-gradient-to-r from-[#1677ff] to-[#0d47c9] text-white px-6 sm:px-8 py-6 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-[11px] uppercase tracking-widest opacity-70 mb-1">
                            Consultant Sharing Report
                        </p>
                        <h1 className="text-2xl font-bold leading-tight">{consultant.name}</h1>
                        <p className="text-sm opacity-90 mt-0.5">
                            {consultant.degrees}{consultant.degrees && consultant.faculty ? " • " : ""}{consultant.faculty}
                        </p>
                        <p className="text-xs opacity-75 mt-2 bg-white/10 inline-block px-2.5 py-1 rounded-full">
                            {moment(period.fromDate).format("DD MMM YYYY")} — {moment(period.toDate).format("DD MMM YYYY")}
                        </p>
                    </div>

                    <img
                        src={MMCLogo}
                        alt="MMC Logo"
                        className="h-16 w-auto object-contain shrink-0 bg-white/90 rounded-lg p-1.5"
                    />
                </div>

                <div className="p-6 sm:p-8 space-y-8 bg-slate-50/40">

                    {/* ---- Summary stat cards ---- */}
                    <section>
                        <SectionHeader title="Overview" subtitle="Is period ki patient aur revenue summary" />
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <StatCard icon={<TeamOutlined />} label="Total Patients" value={summary.total_patients} tone="blue" />
                            <StatCard icon={<DollarCircleOutlined />} label="Gross Amount" value={summary.total_gross} isCurrency tone="slate" />
                            <StatCard icon={<PercentageOutlined />} label="Discount" value={summary.total_discount} isCurrency tone="orange" />
                            <StatCard icon={<DollarCircleOutlined />} label="Net Revenue" value={summary.total_revenue} isCurrency tone="green" />
                        </div>

                        {/* Queue status sirf OPD me hota he, IPD me nahi — isliye label clear kiya */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                            <StatCard icon={<CheckCircleOutlined />} label="OPD Checked" value={opd?.patient_status?.checked} tone="green" />
                            <StatCard icon={<ClockCircleOutlined />} label="OPD Remaining" value={opd?.patient_status?.remaining} tone="blue" />
                            <StatCard icon={<StopOutlined />} label="OPD Skipped" value={opd?.patient_status?.skipped} tone="orange" />
                            <StatCard icon={<CloseCircleOutlined />} label="OPD Cancelled" value={opd?.patient_status?.cancelled} tone="red" />
                        </div>
                    </section>

                    {/* ---- Demographics: bars, koi chart nahi — PDF friendly ---- */}
                    <section className="bg-white rounded-xl border border-slate-200 p-5">
                        <SectionHeader title="Demographics" subtitle="OPD + IPD combined — gender, age aur patient type" />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <p className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-2">
                                    <FaMale className="text-[#1677ff]" /> / <FaFemale className="text-pink-500" /> Gender Split
                                </p>
                                <BarRow label="Male" value={combined_demographics.gender.male} total={genderTotal} color="#1677ff" />
                                <BarRow label="Female" value={combined_demographics.gender.female} total={genderTotal} color="#f759ab" />
                            </div>

                            <div>
                                <p className="text-xs font-semibold text-slate-500 mb-3">Age Groups</p>
                                <BarRow label="Infant" value={combined_demographics.age_groups.infant} total={ageTotal} color="#36cfc9" />
                                <BarRow label="Child" value={combined_demographics.age_groups.child} total={ageTotal} color="#40a9ff" />
                                <BarRow label="Teen" value={combined_demographics.age_groups.teen} total={ageTotal} color="#597ef7" />
                                <BarRow label="Adult" value={combined_demographics.age_groups.adult} total={ageTotal} color="#9254de" />
                                <BarRow label="Senior" value={combined_demographics.age_groups.senior} total={ageTotal} color="#ff7a45" />
                            </div>
                        </div>

                        {/* ✅ Naya section — Patient Type breakdown (combined_patient_types) */}
                        <div className="mt-6 pt-5 border-t border-slate-100">
                            <p className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-1.5">
                                <UsergroupAddOutlined /> Patient Type
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                                <BarRow label="Public" value={combined_patient_types.public} total={patientTypeTotal} color="#1677ff" />
                                <BarRow label="Zakat" value={combined_patient_types.zakat} total={patientTypeTotal} color="#36cfc9" />
                                <BarRow label="BMJ" value={combined_patient_types.bmj} total={patientTypeTotal} color="#9254de" />
                                <BarRow label="SPD" value={combined_patient_types.spd} total={patientTypeTotal} color="#ff7a45" />
                            </div>
                        </div>
                    </section>

                    {/* ---- OPD / IPD individually + total consultant earning ---- */}
                    <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="p-5 pb-0">
                            <SectionHeader title="Revenue & Consultant Earning" subtitle="OPD aur IPD ki individual breakdown" />
                        </div>

                        <div className="overflow-x-auto px-5 pb-5">
                            <table className="w-full text-sm border-separate border-spacing-0">
                                <thead>
                                    <tr className="bg-slate-100 text-slate-500 text-xs uppercase tracking-wide">
                                        <th className="p-3 text-left rounded-l-lg">Type</th>
                                        <th className="p-3 text-right">Patients</th>
                                        <th className="p-3 text-right">Gross</th>
                                        <th className="p-3 text-right">Charges</th>
                                        <th className="p-3 text-right">Net (After Charges)</th>
                                        <th className="p-3 text-right">Doctor Share</th>
                                        <th className="p-3 text-right rounded-r-lg">Doctor Earning</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <RevenueRow label="Outdoor (OPD)" icon={<MedicineBoxOutlined />} data={opd} />
                                    <RevenueRow label="Indoor (IPD)" icon={<HeartOutlined />} data={ipd} isLast />
                                </tbody>
                            </table>

                            {/* Total earning — highlight card, sabse important number */}
                            <div className="mt-4 rounded-xl bg-gradient-to-r from-[#1677ff] to-[#0d47c9] text-white p-5 flex items-center justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-wide opacity-75">Total Consultant Earning</p>
                                    <p className="text-2xl font-bold mt-1">{money(summary.total_consultant_share)}</p>
                                </div>
                                <DollarCircleOutlined className="text-4xl opacity-30" />
                            </div>
                        </div>
                    </section>

                    {/* ---- Footer ---- */}
                    <p className="text-center text-[11px] text-slate-400 pt-2">
                        Generated on {moment().format("DD MMM YYYY, hh:mm A")} — Memon Medical Complex, Hospitrax
                    </p>

                </div>
                
            </div>
        );
    }
);

ReportPrintable.displayName = "ReportPrintable";

export default ReportPrintable;













// import { forwardRef } from "react";
// import moment from "moment";
// import {
//     TeamOutlined,
//     DollarCircleOutlined,
//     PercentageOutlined,
//     CheckCircleOutlined,
//     ClockCircleOutlined,
//     StopOutlined,
//     CloseCircleOutlined,
//     MedicineBoxOutlined,
//     HeartOutlined,
// } from "@ant-design/icons";
// import { FaMale, FaFemale } from "react-icons/fa";
// import MMCLogo from "../../assets/MMC logo.png";

// const money = (val) => `Rs. ${Number(val || 0).toLocaleString("en-PK")}`;

// // ---- small building blocks — sab plain divs, koi SVG chart nahi, isliye
// // PDF (html2canvas) me bhi hubahu waisa hi crisp render hoga jaisa screen pe dikhta he ----

// const StatCard = ({ icon, label, value, isCurrency, tone = "slate" }) => {
//     const toneMap = {
//         slate: "bg-slate-50 text-slate-700 border-slate-200",
//         blue: "bg-blue-50 text-blue-700 border-blue-200",
//         green: "bg-emerald-50 text-emerald-700 border-emerald-200",
//         orange: "bg-amber-50 text-amber-700 border-amber-200",
//         red: "bg-rose-50 text-rose-700 border-rose-200",
//     };
//     return (
//         <div className={`rounded-xl border p-4 flex items-start gap-3 ${toneMap[tone]}`}>
//             <div className="text-lg mt-0.5 opacity-80">{icon}</div>
//             <div>
//                 <p className="text-xs font-medium opacity-70">{label}</p>
//                 <p className="text-lg font-bold mt-0.5 leading-tight">
//                     {isCurrency ? money(value) : (value ?? 0)}
//                 </p>
//             </div>
//         </div>
//     );
// };

// const SectionHeader = ({ title, subtitle }) => (
//     <div className="mb-4">
//         <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">{title}</h3>
//         {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
//     </div>
// );

// // Age-group / gender ke liye horizontal progress bar row — chart ki jagah
// const BarRow = ({ label, value, total, color }) => {
//     const pct = total > 0 ? Math.round((value / total) * 100) : 0;
//     return (
//         <div className="mb-3 last:mb-0">
//             <div className="flex justify-between text-xs text-slate-500 mb-1">
//                 <span>{label}</span>
//                 <span className="font-semibold text-slate-700">{value} ({pct}%)</span>
//             </div>
//             <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
//                 <div
//                     className="h-full rounded-full"
//                     style={{ width: `${pct}%`, backgroundColor: color }}
//                 />
//             </div>
//         </div>
//     );
// };

// const RevenueRow = ({ label, icon, data, isLast }) => (
//     <tr className={`${isLast ? "" : "border-b border-slate-100"}`}>
//         <td className="p-3 font-medium text-slate-700 flex items-center gap-2">
//             <span className="text-slate-400">{icon}</span> {label}
//         </td>
//         <td className="p-3 text-right text-slate-600">{data?.patients}</td>
//         <td className="p-3 text-right text-slate-600">{money(data?.revenue)}</td>
//         <td className="p-3 text-right text-slate-600">
//             {data.share_percent != null ? `${data?.share_percent}%` : "—"}
//         </td>
//         <td className="p-3 text-right font-semibold text-slate-800">
//             {data.consultant_earning != null ? money(data?.consultant_earning) : "—"}
//         </td>
//     </tr>
// );

// // forwardRef zaroori he — parent isi DOM node ko html2canvas se screenshot karke PDF banata he
// const ReportPrintable = forwardRef(
//     ({ report }, ref) => {

//         const { period, consultant, summary, demographics, revenue_split } = report;

//         const genderTotal = demographics.gender.male + demographics.gender.female;
//         const ageTotal =
//             demographics.age_groups.infant +
//             demographics.age_groups.child +
//             demographics.age_groups.young +
//             demographics.age_groups.adult +
//             demographics.age_groups.senior;

//         return (
//             <div ref={ref} className="bg-white rounded-2xl shadow-md overflow-hidden max-w-5xl mx-auto">

//                 {/* ---- Header: gradient banner, doctor info left, logo right ---- */}
//                 <div className="bg-gradient-to-r from-[#1677ff] to-[#0d47c9] text-white px-6 sm:px-8 py-6 flex items-center justify-between gap-4">
//                     <div>
//                         <p className="text-[11px] uppercase tracking-widest opacity-70 mb-1">
//                             Consultant Sharing Report
//                         </p>
//                         <h1 className="text-2xl font-bold leading-tight">{consultant.name}</h1>
//                         <p className="text-sm opacity-90 mt-0.5">
//                             {consultant.degrees}{consultant.degrees && consultant.faculty ? " • " : ""}{consultant.faculty}
//                         </p>
//                         <p className="text-xs opacity-75 mt-2 bg-white/10 inline-block px-2.5 py-1 rounded-full">
//                             {moment(period.fromDate).format("DD MMM YYYY")} — {moment(period.toDate).format("DD MMM YYYY")}
//                         </p>
//                     </div>

//                     <img
//                         src={MMCLogo}
//                         alt="MMC Logo"
//                         className="h-16 w-auto object-contain shrink-0 bg-white/90 rounded-lg p-1.5"
//                     />
//                 </div>

//                 <div className="p-6 sm:p-8 space-y-8 bg-slate-50/40">

//                     {/* ---- Summary stat cards ---- */}
//                     <section>
//                         <SectionHeader title="Overview" subtitle="Is period ki patient aur revenue summary" />
//                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                             <StatCard icon={<TeamOutlined />} label="Total Patients" value={summary.total_patients} tone="blue" />
//                             <StatCard icon={<DollarCircleOutlined />} label="Gross Amount" value={summary.total_gross} isCurrency tone="slate" />
//                             <StatCard icon={<PercentageOutlined />} label="Discount" value={summary.total_discount} isCurrency tone="orange" />
//                             <StatCard icon={<DollarCircleOutlined />} label="Net Revenue" value={summary.total_revenue} isCurrency tone="green" />
//                         </div>
//                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
//                             <StatCard icon={<CheckCircleOutlined />} label="Checked" value={summary.checked} tone="green" />
//                             <StatCard icon={<ClockCircleOutlined />} label="Remaining" value={summary.remaining} tone="blue" />
//                             <StatCard icon={<StopOutlined />} label="Skipped" value={summary.skipped} tone="orange" />
//                             <StatCard icon={<CloseCircleOutlined />} label="Cancelled" value={summary.cancelled} tone="red" />
//                         </div>
//                     </section>

//                     {/* ---- Demographics: bars, koi chart nahi — PDF friendly ---- */}
//                     <section className="bg-white rounded-xl border border-slate-200 p-5">
//                         <SectionHeader title="Demographics" subtitle="Gender aur age-group breakdown" />

//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                             <div>
//                                 <p className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-2">
//                                     <FaMale className="text-[#1677ff]" /> / <FaFemale className="text-pink-500" /> Gender Split
//                                 </p>
//                                 <BarRow label="Male" value={demographics.gender.male} total={genderTotal} color="#1677ff" />
//                                 <BarRow label="Female" value={demographics.gender.female} total={genderTotal} color="#f759ab" />
//                             </div>

//                             <div>
//                                 <p className="text-xs font-semibold text-slate-500 mb-3">Age Groups</p>
//                                 <BarRow label="Infant" value={demographics.age_groups.infant} total={ageTotal} color="#36cfc9" />
//                                 <BarRow label="Child" value={demographics.age_groups.child} total={ageTotal} color="#40a9ff" />
//                                 <BarRow label="Young (13-30)" value={demographics.age_groups.young} total={ageTotal} color="#597ef7" />
//                                 <BarRow label="Adult (31-60)" value={demographics.age_groups.adult} total={ageTotal} color="#9254de" />
//                                 <BarRow label="Senior (60+)" value={demographics.age_groups.senior} total={ageTotal} color="#ff7a45" />
//                             </div>
//                         </div>

//                         <div className="flex gap-6 justify-center mt-6 pt-4 border-t border-slate-100 text-sm text-slate-600">
//                             <span className="flex items-center gap-1.5">
//                                 <MedicineBoxOutlined className="text-blue-500" /> New Patients: <b>{demographics.patients.new}</b>
//                             </span>
//                             <span className="flex items-center gap-1.5">
//                                 <HeartOutlined className="text-rose-400" /> Returning Patients: <b>{demographics.patients.returning}</b>
//                             </span>
//                         </div>
//                     </section>

//                     {/* ---- Revenue split + charges + total earning ---- */}
//                     <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
//                         <div className="p-5 pb-0">
//                             <SectionHeader title="Revenue & Consultant Earning" subtitle="OPD / IPD / Other ki wise breakdown" />
//                         </div>

//                         <div className="overflow-x-auto px-5 pb-5">
//                             <table className="w-full text-sm border-separate border-spacing-0">
//                                 <thead>
//                                     <tr className="bg-slate-100 text-slate-500 text-xs uppercase tracking-wide">
//                                         <th className="p-3 text-left rounded-l-lg">Type</th>
//                                         <th className="p-3 text-right">Patients</th>
//                                         <th className="p-3 text-right">Revenue</th>
//                                         <th className="p-3 text-right">Doctor Share</th>
//                                         <th className="p-3 text-right rounded-r-lg">Doctor Earning</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     <RevenueRow label="Outdoor (OPD)" icon={<MedicineBoxOutlined />} data={revenue_split.outdoor} />
//                                     <RevenueRow label="Indoor (IPD)" icon={<HeartOutlined />} data={revenue_split.indoor} />
//                                     <RevenueRow
//                                         label="Other"
//                                         icon={<TeamOutlined />}
//                                         data={{ ...revenue_split.other, share_percent: null, consultant_earning: null }}
//                                         isLast
//                                     />
//                                 </tbody>
//                             </table>

//                             <div className="grid grid-cols-2 gap-3 mt-4">
//                                 <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 flex justify-between items-center">
//                                     <span className="text-xs text-slate-500">Surgery Charges</span>
//                                     <span className="font-semibold text-slate-700">{money(revenue_split.surgery_charges)}</span>
//                                 </div>
//                                 <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 flex justify-between items-center">
//                                     <span className="text-xs text-slate-500">Anesthesia Charges</span>
//                                     <span className="font-semibold text-slate-700">{money(revenue_split.anesthesia_charges)}</span>
//                                 </div>
//                             </div>

//                             {/* Total earning — highlight card, sabse important number */}
//                             <div className="mt-4 rounded-xl bg-gradient-to-r from-[#1677ff] to-[#0d47c9] text-white p-5 flex items-center justify-between">
//                                 <div>
//                                     <p className="text-xs uppercase tracking-wide opacity-75">Total Consultant Earning</p>
//                                     <p className="text-2xl font-bold mt-1">{money(revenue_split.total_consultant_earning)}</p>
//                                 </div>
//                                 <DollarCircleOutlined className="text-4xl opacity-30" />
//                             </div>
//                         </div>
//                     </section>

//                     {/* ---- Footer ---- */}
//                     <p className="text-center text-[11px] text-slate-400 pt-2">
//                         Generated on {moment().format("DD MMM YYYY, hh:mm A")} — Memon Medical Complex, Hospitrax
//                     </p>

//                 </div>
//             </div>
//         );
//     }
// );

// ReportPrintable.displayName = "ReportPrintable";

// export default ReportPrintable;

















// // import { forwardRef } from "react";
// // import moment from "moment";
// // import {
// //     PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
// //     BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
// // } from "recharts";
// // import MMCLogo from "../../assets/MMC logo.png"

// // const GENDER_COLORS = ["#1677ff", "#f759ab"];
// // const AGE_COLORS = ["#36cfc9", "#40a9ff", "#597ef7", "#9254de", "#ff7a45"];

// // const money = (val) => `Rs. ${Number(val || 0).toLocaleString("en-PK")}`;

// // const toneMap = {
// //     green: "text-emerald-600",
// //     blue: "text-blue-600",
// //     orange: "text-orange-500",
// //     red: "text-red-500",
// // };

// // const SummaryCard = ({ label, value, isCurrency, highlight, tone }) => (
// //     <div className={`rounded-xl border p-4 ${highlight ? "border-[#1677ff] bg-blue-50" : "border-gray-200"}`}>
// //         <p className="text-xs text-gray-500">{label}</p>
// //         <p className={`text-xl font-bold mt-1 ${tone ? toneMap[tone] : highlight ? "text-[#1677ff]" : "text-gray-800"}`}>
// //             {isCurrency ? money(value) : (value ?? 0)}
// //         </p>
// //     </div>
// // );

// // const RevenueRow = ({ label, data }) => (
// //     <tr className="border-b border-gray-100">
// //         <td className="p-2">{label}</td>
// //         <td className="p-2 text-right">{data.patients}</td>
// //         <td className="p-2 text-right">{money(data.revenue)}</td>
// //         <td className="p-2 text-right">{data.share_percent != null ? `${data.share_percent}%` : "-"}</td>
// //         <td className="p-2 text-right font-semibold">
// //             {data.consultant_earning != null ? money(data.consultant_earning) : "-"}
// //         </td>
// //     </tr>
// // );

// // const ReportPrintable = forwardRef(({ report }, ref) => {
// //     const { period, consultant, summary, demographics, revenue_split } = report;

// //     const genderData = [
// //         { name: "Male", value: demographics.gender.male },
// //         { name: "Female", value: demographics.gender.female },
// //     ];

// //     const ageData = [
// //         { name: "Infant", value: demographics.age_groups.infant },
// //         { name: "Child", value: demographics.age_groups.child },
// //         { name: "Young", value: demographics.age_groups.young },
// //         { name: "Adult", value: demographics.age_groups.adult },
// //         { name: "Senior", value: demographics.age_groups.senior },
// //     ];

// //     return (
// //         <div ref={ref} className="bg-white rounded-xl shadow overflow-hidden">

// //             <div className="bg-[#1677ff] flex justify-between text-white px-6 py-4">

// //                 <div className="text-white">
// //                     <h1 className="text-xl font-semibold">{consultant.name}</h1>
// //                     <p className="text-sm opacity-90">
// //                         {consultant.degrees} {consultant.degrees && consultant.faculty && "•"} {consultant.faculty}
// //                     </p>
// //                     <p className="text-xs opacity-80 mt-1">
// //                         Period: {moment(period.fromDate).format("DD-MMM-YYYY")} to {moment(period.toDate).format("DD-MMM-YYYY")}
// //                     </p>
// //                 </div>

// //                 <img src={MMCLogo} className="w-20" alt="" />
// //             </div>

// //             <div className="p-6 space-y-8">

// //                 <fieldset className="border border-gray-200 rounded-xl p-4">
// //                     <legend className="px-2 font-semibold text-gray-700">Summary</legend>
// //                     <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
// //                         <SummaryCard label="Total Patients" value={summary.total_patients} />
// //                         <SummaryCard label="Gross Amount" value={summary.total_gross} isCurrency />
// //                         <SummaryCard label="Discount" value={summary.total_discount} isCurrency />
// //                         <SummaryCard label="Net Revenue" value={summary.total_revenue} isCurrency highlight />
// //                         <SummaryCard label="Checked" value={summary.checked} tone="green" />
// //                         <SummaryCard label="Remaining" value={summary.remaining} tone="blue" />
// //                         <SummaryCard label="Skipped" value={summary.skipped} tone="orange" />
// //                         <SummaryCard label="Cancelled" value={summary.cancelled} tone="red" />
// //                     </div>
// //                 </fieldset>

// //                 <fieldset className="border border-gray-200 rounded-xl p-4">
// //                     <legend className="px-2 font-semibold text-gray-700">Demographics</legend>
// //                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

// //                         <div className="h-64">
// //                             <p className="text-sm font-medium text-gray-600 mb-2 text-center">Gender Split</p>
// //                             <ResponsiveContainer width="100%" height="90%">
// //                                 <PieChart>
// //                                     <Pie data={genderData} dataKey="value" nameKey="name" outerRadius={80} label>
// //                                         {genderData.map((_, i) => (
// //                                             <Cell key={i} fill={GENDER_COLORS[i % GENDER_COLORS.length]} />
// //                                         ))}
// //                                     </Pie>
// //                                     <Tooltip />
// //                                     <Legend />
// //                                 </PieChart>
// //                             </ResponsiveContainer>
// //                         </div>

// //                         <div className="h-64">
// //                             <p className="text-sm font-medium text-gray-600 mb-2 text-center">Age Groups</p>
// //                             <ResponsiveContainer width="100%" height="90%">
// //                                 <BarChart data={ageData}>
// //                                     <CartesianGrid strokeDasharray="3 3" />
// //                                     <XAxis dataKey="name" fontSize={12} />
// //                                     <YAxis allowDecimals={false} />
// //                                     <Tooltip />
// //                                     <Bar dataKey="value">
// //                                         {ageData.map((_, i) => (
// //                                             <Cell key={i} fill={AGE_COLORS[i % AGE_COLORS.length]} />
// //                                         ))}
// //                                     </Bar>
// //                                 </BarChart>
// //                             </ResponsiveContainer>
// //                         </div>

// //                     </div>

// //                     <div className="flex gap-6 justify-center mt-4 text-sm text-gray-600">
// //                         <span>New Patients: <b>{demographics.patients.new}</b></span>
// //                         <span>Returning Patients: <b>{demographics.patients.returning}</b></span>
// //                     </div>
// //                 </fieldset>

// //                 <fieldset className="border border-gray-200 rounded-xl p-4">
// //                     <legend className="px-2 font-semibold text-gray-700">Revenue &amp; Consultant Earning</legend>

// //                     <div className="overflow-x-auto">
// //                         <table className="w-full text-sm">
// //                             <thead>
// //                                 <tr className="bg-[#1677ff] text-white">
// //                                     <th className="p-2 text-left">Type</th>
// //                                     <th className="p-2 text-right">Patients</th>
// //                                     <th className="p-2 text-right">Revenue</th>
// //                                     <th className="p-2 text-right">Doctor Share %</th>
// //                                     <th className="p-2 text-right">Doctor Earning</th>
// //                                 </tr>
// //                             </thead>
// //                             <tbody>
// //                                 <RevenueRow label="Outdoor (OPD)" data={revenue_split.outdoor} />
// //                                 <RevenueRow label="Indoor (IPD)" data={revenue_split.indoor} />
// //                                 <RevenueRow
// //                                     label="Other"
// //                                     data={{ ...revenue_split.other, share_percent: null, consultant_earning: null }}
// //                                 />

// //                                 <tr className="border-b border-gray-100">
// //                                     <td className="p-2" colSpan={4}>Surgery Charges</td>
// //                                     <td className="p-2 text-right">{money(revenue_split.surgery_charges)}</td>
// //                                 </tr>
// //                                 <tr className="border-b border-gray-100">
// //                                     <td className="p-2" colSpan={4}>Anesthesia Charges</td>
// //                                     <td className="p-2 text-right">{money(revenue_split.anesthesia_charges)}</td>
// //                                 </tr>

// //                                 <tr className="bg-[#c4cdf37a] font-bold">
// //                                     <td className="p-2" colSpan={4}>Total Consultant Earning</td>
// //                                     <td className="p-2 text-right text-[15px]">
// //                                         {money(revenue_split.total_consultant_earning)}
// //                                     </td>
// //                                 </tr>

// //                             </tbody>

// //                         </table>

// //                     </div>

// //                 </fieldset>

// //             </div>
// //         </div>
// //     );
// // });

// // ReportPrintable.displayName = "ReportPrintable";

// // export default ReportPrintable;