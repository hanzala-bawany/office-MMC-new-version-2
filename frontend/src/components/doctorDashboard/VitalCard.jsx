// VitalCard.jsx
const VitalCard = ({ label, currentValue, lastValue, bgColor, borderColor, textColor, subTextColor , unit }) => {


    return (
        <div
            className="flex flex-col p-3 rounded-lg border "
            style={{ backgroundColor: bgColor, borderColor: borderColor }}
        >
            <span className="text-black font-semibold">{label}</span>
            <div className="font-bold" style={{ color: textColor }}>
                { currentValue ? `${currentValue} ${unit || ""} ` : "—"}
            </div>
            <div className="" style={{ color: subTextColor }}>
                { lastValue ? `${lastValue} ${unit || ""} (L)` : "—" }
            </div>
        </div>
    );
};

export default VitalCard;