import moment from "moment";
import { PdfDocument, COLORS } from "./PdfDocument";
import { loadImageAsDataURL } from "./pdfImageLoader";
import { formatMoney } from "../formatters";
import MMCLogo from "../../assets/MMC logo.png";

const summarize = (rows = []) => {
  return rows.reduce(
    (acc, r) => {
      acc.patients += Number(r.TOTAL_PATIENT || 0);
      acc.gross += Number(r.GROSS || 0);
      acc.discount += Number(r.DISCOUNT || 0);
      acc.net += Number(r.NET || 0);
      return acc;
    },
    { patients: 0, gross: 0, discount: 0, net: 0 },
  );
};

// jaani — ye placeholder he, apne actual hospital ke address/phone/email se update kar lena
// PDF header me yahi info top-right pe show hogi
export const HOSPITAL_INFO = {
  name: "Memon Medical Complex",
  tagline: "Hospitrax — Hospital Management System",
  addressLine: "Karachi, Pakistan",
  phone: "",
  email: "",
};

// yehi column set OPD aur IPD dono tables me reuse hota he
const TABLE_COLUMNS = [
  {
    key: "DATES",
    label: "Date",
    width: 24,
    render: (r) => moment(r.DATES).format("DD-MMM-YY"),
  },
  // { key: "RECEIPTTYPE", label: "Type", width: 14 },
  { key: "TOTAL_PATIENT", label: "Patients", width: 18, align: "right" },
  {
    key: "GROSS",
    label: "Gross",
    width: 24,
    align: "right",
    render: (r) => formatMoney(r.GROSS),
  },
  {
    key: "TOTAL_CHARGES",
    label: "Charges",
    width: 22,
    align: "right",
    render: (r) => formatMoney(r.TOTAL_CHARGES),
  },
  {
    key: "NETAMTAFTERCHARGES",
    label: "Net (After Charges)",
    width: 30,
    align: "right",
    render: (r) => formatMoney(r.NETAMTAFTERCHARGES),
  },
  {
    key: "CONSULTANTSHARE",
    label: "Doctor Share",
    width: 22,
    align: "right",
    render: (r) => `${r.CONSULTANTSHARE ?? 0}%`,
  },
  {
    key: "COUNSULTANTSHAREAMT",
    label: "Doctor Earning",
    width: 32,
    align: "right",
    render: (r) => formatMoney(r.COUNSULTANTSHAREAMT),
  },
];

export const buildDeepReportPdf = async ({ doctorInfo, opdData = [], ipdData = [], fromDate, toDate, }) => {
  
  // console.log(doctorInfo, ".........");

  let logoDataUrl = null;
  try {
    logoDataUrl = await loadImageAsDataURL(MMCLogo);
  } catch (err) {
    logoDataUrl = null; // logo fail ho to bhi report generate ho jaye
  }

  const pdf = new PdfDocument();
  const periodLabel = `${moment(fromDate).format("DD MMM YYYY")} — ${moment(toDate).format("DD MMM YYYY")}`;

  const drawHeader = (doc) => {
    doc.addBrandHeader({
      logoDataUrl,
      titleLines: [
        {
          text: "Consultant Deep Sharing Report",
          bold: true,
          size: 12,
          color: COLORS.primaryDark,
        },
        { text: HOSPITAL_INFO.tagline, size: 7.5, color: COLORS.slate500 },
      ],
      orgLines: [
        { text: HOSPITAL_INFO.name, bold: true, size: 10 },
        { text: HOSPITAL_INFO.addressLine, size: 7.5 },
        {
          text: [HOSPITAL_INFO.phone, HOSPITAL_INFO.email]
            .filter(Boolean)
            .join("  |  "),
          size: 7.5,
        },
      ],
    });
  };

  drawHeader(pdf);
  pdf.setRepeatingHeader(drawHeader); // aage jitne page auto-banenge sab pe ye header repeat hoga

  pdf.addInfoGrid([
    { label: "Consultant", value: doctorInfo?.name },
    { label: "Degrees", value: doctorInfo?.degrees },
    { label: "Faculty", value: doctorInfo?.faculty },
    // { label: "Consultant Share", value: `${doctorInfo?.consultantShare ?? "-"}%` },
    { label: "Period", value: periodLabel },
    { label: "Generated On", value: moment().format("DD MMM YYYY, hh:mm A") },
  ]);

  const opdSummary = summarize(opdData);
  pdf.addSectionHeading("OPD Summary");
  pdf.addStatCards([
    { label: "Total Patients", value: opdSummary.patients },
    { label: "Gross Amount", value: formatMoney(opdSummary.gross) },
    { label: "Total Discount", value: formatMoney(opdSummary.discount) },
    { label: "Net Revenue", value: formatMoney(opdSummary.net), valueColor: COLORS.green },
  ]);

  const ipdSummary = summarize(ipdData);
  pdf.addSectionHeading("IPD Summary");
  pdf.addStatCards([
    { label: "Total Patients", value: ipdSummary.patients },
    { label: "Gross Amount", value: formatMoney(ipdSummary.gross) },
    { label: "Total Discount", value: formatMoney(ipdSummary.discount) },
    { label: "Net Revenue", value: formatMoney(ipdSummary.net), valueColor: COLORS.green },
  ]);

  // ---- pehle saari OPD rows, phir saari IPD rows ----
  pdf.addSectionHeading(`OPD Records (${opdData.length})`);
  opdData.length
    ? pdf.addTable({ columns: TABLE_COLUMNS, rows: opdData })
    : pdf.addSpacer(6);

  pdf.addSectionHeading(`IPD Records (${ipdData.length})`);
  ipdData.length
    ? pdf.addTable({ columns: TABLE_COLUMNS, rows: ipdData })
    : pdf.addSpacer(6);

  pdf.finalizeFooters(`${HOSPITAL_INFO.name} — Hospitrax`);

  const fileName = `${doctorInfo?.name || "Doctor"}_Deep_Report_${moment(fromDate).format("YYYY-MM-DD")}_to_${moment(toDate).format("YYYY-MM-DD")}`;
  pdf.save(fileName);
};
