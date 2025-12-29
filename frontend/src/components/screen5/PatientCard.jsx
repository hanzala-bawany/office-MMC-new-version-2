import { Card } from "antd"
import { memo } from "react"

const PatientCard = ({ doc }) => {

    console.log(doc);


    return (
        <Card
            title={
                <div className="text-[#014749] text-2xl font-bold">
                    {doc?.doctorName}
                </div>
            }
            extra={
                <span className="text-sm text-[#014749] font-bold hover:text-cyan-700 cursor-pointer">
                    Gynologist
                </span>
            }
            className="rounded-md shadow-lg flex flex-col"
            styles={{
                header: {
                    // background: "linear-gradient(to bottom right, #b2ebf2, #81d4fa)",
                    background: "linear-gradient(to bottom right, rgba(0, 188, 212, 0.3), rgba(103, 232, 249, 0.3))",
                    flex: "2"
                },
                body: {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "10px",
                    padding: "5px 20px",
                    flex: "10",
                }
            }}
        >

            {
                doc?.patients?.map((pDoc, index) =>
                    <div
                        key={pDoc.id}
                        className={`flex justify-between items-center gap-4 p-3 rounded-md transition-all themeBoxShadow ${pDoc.current === 1
                            ? "border-l-5 border-yellow-400"
                            : "bg-white/80"
                            }`}
                    >

                        <div className="flex items-center gap-5">
                            <div className="text-cyan-700 font-bold text-lg">{index + 1}.</div>
                            <div>
                                <div className="text-cyan-900 font-semibold text-lg">
                                    {pDoc.name}
                                </div>
                                <div className="text-gray-600 text-sm">{pDoc.age} years</div>
                            </div>
                        </div>

                        {/* Token */}
                        <div className="bg-cyan-100  text-cyan-800 font-bold text-lg px-4 py-2 rounded-full w-max">
                            {pDoc.token}
                        </div>

                    </div>
                )
            }

        </Card>
    )
}

export default memo(PatientCard);