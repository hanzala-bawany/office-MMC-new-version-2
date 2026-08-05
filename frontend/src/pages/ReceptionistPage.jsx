// frontend/src/pages/ReceptionistPage.jsx
import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { UserOutlined, SearchOutlined } from '@ant-design/icons';
import hospitraxLogo from '../assets/productLogoBgRemove.png';
import mmcLogo from '../assets/MMC logo.png';
import OPDSearch from '../components/Receptionist/OPDSearch';
import OPDReceipt from '../components/Receptionist/OPDReceipt';
import LastSlipIssuedModal from '../components/Receptionist/LastSlipIssuedModal';
import LogoutModal from '../utills/LogoutModal';
import { useSelector } from 'react-redux';
import SeccionOpenAlertModal from '../components/Receptionist/SeccionOpenAlertModal';
import { MedicineBoxOutlined, ExperimentOutlined, HeartOutlined, TeamOutlined } from '@ant-design/icons';
import GeneralOPDTab from '../components/Receptionist/OPDTabs/GeneralOPDTab';
import LaboratoryTab from '../components/Receptionist/OPDTabs/LaboratoryTab';
import ZakatSPDTab from '../components/Receptionist/OPDTabs/ZakatSPDTab';
import MemberTab from '../components/Receptionist/OPDTabs/MemberTab';



const ReceptionistPage = () => {

    const [activeTab, setActiveTab] = useState('1');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const loginUserData = useSelector((state) => state?.authSlice?.loginUser);
    const [showSessionAlertModal, setShowSessionAlertModal] = useState(false);
    const [editRecord, setEditRecord] = useState(null);
    // console.log(loginUserData , "loginUserData ........");

    const handleEdit = (record) => {

        console.log(record, "record .........");
        setEditRecord(record);
        setActiveTab('1');
    }

    const items = [
        {
            key: '1',
            label: (
                <span className="flex items-center gap-2">
                    <UserOutlined />
                    Add Patient
                </span>
            ),
            children: <OPDReceipt editRecord={editRecord} handleEdit={handleEdit} clearEditRecord={() => setEditRecord(null)} />,
        },
        {
            key: '2',
            label: (
                <span className="flex items-center gap-2">
                    <SearchOutlined />
                    Search Patient
                </span>
            ),
            children: <OPDSearch handleEdit={handleEdit} />,
        },
        // { key: 'general', label: <span className="flex items-center gap-1.5"><MedicineBoxOutlined />General OPD</span>, children: <GeneralOPDTab /> },
        // { key: 'lab', label: <span className="flex items-center gap-1.5"><ExperimentOutlined />Laboratory</span>, children: <LaboratoryTab /> },
        // { key: 'zakatSpd', label: <span className="flex items-center gap-1.5"><HeartOutlined />Zakat / SPD</span>, children: <ZakatSPDTab /> },
        // { key: 'member', label: <span className="flex items-center gap-1.5"><TeamOutlined />Member</span>, children: <MemberTab /> },
    ];

    useEffect(() => {
        if (loginUserData?.isprevioussessionopen == 1) {
            setShowSessionAlertModal(true);
        }
    }, [loginUserData]);




    return (
        <div
            className="h-screen flex flex-col px-4 pb-3 pt-3 "
            style={{
                fontFamily: "'DM Sans', sans-serif",
                background: "#f0f4ff",
                backgroundImage: `radial-gradient(ellipse 80% 50% at 20% -10%, rgba(99,102,241,0.15) 0%, transparent 60%),radial-gradient(ellipse 60% 40% at 80% 110%, rgba(59,130,246,0.12) 0%, transparent 60%)`,
            }}
        >

            {/* Global override so AntD Tabs content fills remaining height and each tab pane can scroll internally */}
            <style>{`
                .receptionist-tabs { display: flex; flex-direction: column; height: 100%; min-height: 0; }
                .receptionist-tabs .ant-tabs-content-holder,
                .receptionist-tabs .ant-tabs-content,
                .receptionist-tabs .ant-tabs-tabpane {
                    height: 100%;
                    min-height: 0;
                }
            `}</style>

            <LogoutModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} loginUserData={loginUserData} />

            <SeccionOpenAlertModal isModalOpen={showSessionAlertModal} setIsModalOpen={setShowSessionAlertModal} loginUserData={loginUserData} />

            {/* HEADER - shrink-0 so it never gets squeezed */}
            <header className="shrink-0 flex items-center justify-between mb-4">

                <div className="flex items-center gap-4 [@media(min-width:3200px)]:gap-8 [@media(min-width:4400px)]:gap-12">

                    <img
                        src={hospitraxLogo}
                        alt="Hospitrax Logo"
                        className="w-16 4xl:w-30"
                    />
                    <div>
                        <h1 className="text-blue-600 text-xl font-bold min-[2000px]:text-4xl [@media(min-width:3200px)]:text-5xl [@media(min-width:4400px)]:text-6xl tracking-wide drop-shadow">
                            Hospitrax
                        </h1>
                        <p className="text-gray-500 text-xs italic min-[2000px]:text-xl [@media(min-width:3000px)]:text-2xl [@media(min-width:4400px)]:text-3xl">
                            “Healthcare Management System”
                        </p>
                    </div>

                </div>

                {/* Center - Module Heading with Glassmorphism */}
                <div className="hidden md:flex items-center gap-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm px-5 py-2 rounded-2xl border border-white/50 shadow-lg shadow-blue-500/10">

                    <div className="flex items-center gap-4">

                        <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md shadow-blue-500/30">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>

                        <div className="h-8 w-0.5 bg-gradient-to-b from-blue-300/50 to-indigo-300/50 hidden md:block"></div>

                        <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent tracking-wide">
                            OPD Receipt
                        </h2>

                        <span className="relative px-3 py-1 border text-indigo-600 text-xs font-semibold rounded-full shadow-md shadow-blue-500/30 animate-pulse-slow">
                            <span className="relative z-10">Module</span>
                            <span className="absolute inset-0 rounded-full bg-white/20 animate-ping-slow"></span>
                        </span>
                    </div>

                </div>

                {/* Logo pill - Clickable to open modal */}
                <div
                    onClick={() => setIsModalOpen(true)}
                    className="cursor-pointer anim-slideDown flex flex-col items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-600/50 bg-white/90 backdrop-blur shadow-md shadow-indigo-500/10 hover:shadow-lg hover:border-indigo-700/100 transition-all duration-300"
                >

                    <div className="flex items-center gap-3">

                        <img src={mmcLogo} alt="MMC Logo" className="h-10 w-10 object-contain rounded-full" />
                        <div className="text-right hidden sm:block">
                            <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-base font-semibold text-indigo-950 tracking-wide block">
                                Memon Medical Complex
                            </span>
                            <div className="flex items-center gap-1 mt-0.5">
                                <span className="text-[13px] font-medium text-indigo-600/80 tracking-wide">
                                    {loginUserData?.username}
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            </div>
                        </div>

                    </div>
                </div>

            </header>

            {/* Tabs wrapper - flex-1 min-h-0 so it takes remaining screen height and can shrink for scrolling */}
            <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm px-4 flex flex-col overflow-hidden!">

                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={items}
                    className="receptionist-tabs"
                    size="large"
                    tabBarStyle={{
                        borderBottom: '2px solid #e5e7eb',
                        marginBottom: '16px',
                        flexShrink: 0,
                    }}
                />

            </div>

        </div>
    );
};

export default ReceptionistPage;




