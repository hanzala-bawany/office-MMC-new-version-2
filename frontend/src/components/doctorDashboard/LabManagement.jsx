
const LabManagement = () => {


    return (
        <div className="order-3 2xl:col-span-2 2xl:order-4 z-10 themeBoxShadow border-none outline-none rounded-xl bg-white flex flex-col max-h-[55vh] 2xl:max-h-none 2xl:min-h-[35vh] overflow-hidden relative">

            {/* Gray Overlay with Coming Soon Text */}
            <div className="absolute inset-0 bg-gray-800/30 backdrop-blur-xs z-20 flex items-center justify-center rounded-xl">

                <div className="text-center">
                    {/* Coming Soon Badge */}
                    <div className="bg-white/95 backdrop-blur rounded-2xl p-6 shadow-2xl mx-4">
                        <div className="text-5xl mb-3">
                            🚧
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Coming Soon
                        </h2>
                        <p className="text-gray-600 text-sm max-w-xs">
                            This feature is under development and will be available soon
                        </p>
                        <div className="mt-4 flex items-center justify-center gap-2">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                            <span className="text-xs text-gray-500">In Progress</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Header */}
            <div className="flex-1 p-4 flex justify-between items-center rounded-xl border border-gray-300 xl:bg-gradient-to-r xl:from-indigo-600 xl:to-blue-500">
                <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-black xl:text-white">
                        Lab Management
                    </h2>
                    <p className="text-xs text-blue-600 xl:text-blue-100">
                        Assign & Monitor Patient Lab Tests
                    </p>
                </div>

                <div className=" flex items-center gap-2 bg-gray-100 xl:bg-white/20 px-3 py-1 rounded-full">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                    </span>
                    <span className="text-xs text-black  xl:text-white">Live</span>
                </div>
            </div>

            {/* Department + Test Selection */}
            <div className="p-4 border-b border-gray-200 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Select
                        placeholder="Select Department"
                        value={selectedDepartment}
                        onChange={setSelectedDepartment}
                        showSearch
                        optionFilterProp="children"
                        className="w-full"
                        size="middle"
                    >
                        {departments.map((dept) => (
                            <Option key={dept.id} value={dept.id}>
                                {dept.name}
                            </Option>
                        ))}
                    </Select>

                    <Select
                        placeholder="Select Test"
                        value={selectedTest}
                        onChange={setSelectedTest}
                        disabled={!selectedDepartment}
                        showSearch
                        optionFilterProp="children"
                        className="w-full"
                        size="middle"
                    >
                        {selectedDepartment &&
                            sampleTests
                                .filter((test) => test.department === selectedDepartment)
                                .map((test) => (
                                    <Option key={test.id} value={test.id}>
                                        {test.name}
                                    </Option>
                                ))}
                    </Select>

                    <Button
                        type="primary"
                        size="middle"
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 border-none hover:opacity-90"
                        onClick={() => {
                            if (selectedTest && currentPatientsData) {
                                toast.success(
                                    `Test assigned to ${currentPatientsData.PATIENTNAME}`,
                                );
                                setSelectedTest(null);
                            } else {
                                toast.warning(
                                    "Please select test and ensure patient available",
                                );
                            }
                        }}
                        disabled={!selectedTest || !currentPatientsData}
                    >
                        Assign Test
                    </Button>
                </div>
            </div>

            {/* Lab Patients Table */}
            <div className="flex-6 p-4 overflow-auto hide-scrollbar">
                <div className="mb-3 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-700">
                        Today's Lab Patients
                    </h3>

                    <Badge
                        count={sampleLabPatients?.length}
                        style={{ backgroundColor: "#3b82f6" }}
                    />
                </div>

                <Table
                    columns={[
                        {
                            title: "Patient",
                            dataIndex: "patientName",
                            key: "patientName",
                            render: (text) => (
                                <span className="font-medium text-gray-800">{text}</span>
                            ),
                        },
                        {
                            title: "Token",
                            dataIndex: "tokenNo",
                            key: "tokenNo",
                            render: (text) => <Tag color="blue">{text}</Tag>,
                        },
                        {
                            title: "Test",
                            dataIndex: "testName",
                            key: "testName",
                            render: (text) => <span className="text-gray-600">{text}</span>,
                        },
                        {
                            title: "Department",
                            dataIndex: "department",
                            key: "department",
                            render: (text) => (
                                <span className="text-gray-600 text-xs font-medium">
                                    {text}
                                </span>
                            ),
                        },
                        {
                            title: "Status",
                            dataIndex: "status",
                            key: "status",
                            render: (status) => {
                                const style =
                                    status === "completed"
                                        ? "bg-green-100 text-green-700"
                                        : status === "pending"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-blue-100 text-blue-700";

                                const label =
                                    status === "completed"
                                        ? "Completed"
                                        : status === "pending"
                                            ? "Pending"
                                            : "Processing";

                                return (
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${style}`}
                                    >
                                        {label}
                                    </span>
                                );
                            },
                        },
                    ]}
                    dataSource={sampleLabPatients}
                    rowKey="id"
                    size="middle"
                    pagination={false}
                    scroll={{ y: 270, x: "max-content" }}
                    className="rounded-lg"
                />
            </div>

        </div>
    )
}

export default LabManagement