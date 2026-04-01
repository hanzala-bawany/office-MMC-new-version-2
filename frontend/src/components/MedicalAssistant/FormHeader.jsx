
const FormHeader = ({selectedPatient}) => {


    return (
        
        <div
            className="relative flex items-center justify-between px-6 py-5 overflow-hidden"
            style={{ background: "linear-gradient(135deg, #4338ca 0%, #4f46e5 40%, #3b82f6 100%)" }}
        >

            {/* Decorative orbs */}
            <div className="absolute -top-10 -right-5 w-32 h-32 rounded-full bg-white/[0.07] pointer-events-none" />
            <div className="absolute -bottom-8 left-[35%] w-24 h-24 rounded-full bg-white/[0.05] pointer-events-none" />

            {/* Left side */}
            <div className="flex items-center gap-3 z-10">
                <div className="anim-breathe w-9 h-9 rounded-full bg-white/15 border border-white/30 flex items-center justify-center text-lg">
                    🫀
                </div>
                <div>
                    <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-xl font-semibold text-white">
                        Patient Vitals Entry
                    </p>
                    <p className="text-xs text-white/70 mt-0.5">Record readings before OPD</p>
                </div>
            </div>

            {/* Token pill */}
            <div className="z-10 text-sm font-semibold text-white px-4 py-1.5 rounded-full bg-white/18 border border-white/32 backdrop-blur-sm tracking-wide">
                {selectedPatient?.TOKENNO || "No Token"}
            </div>

        </div>
    )
}

export default FormHeader