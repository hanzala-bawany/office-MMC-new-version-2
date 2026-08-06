import { Layout, Menu, Breadcrumb, theme, Flex } from 'antd';
import React, { useEffect, useState } from 'react';
import NavImg from '../assets/MMC logo.png';
import hospitraxLogo from '../assets/productLogoBgRemove.png';
import { UserOutlined, LaptopOutlined, MenuUnfoldOutlined, MenuFoldOutlined, FileTextOutlined, TeamOutlined, FundOutlined, SettingOutlined } from '@ant-design/icons';
import { FaChalkboardTeacher, FaMicrophone, FaTextWidth, FaUserMd, FaUserMinus, FaXRay } from 'react-icons/fa';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineMenu } from "react-icons/ai";
import { AiFillCloseCircle } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../reduxToolKit/authSlice';
import "./AppLayout.css"
import Time from '../components/Applayout/Time';
import axios from 'axios';
import { base_URL } from '../utills/baseUrl';
import { updateDoctorsData } from '../reduxToolKit/doctorSlice';
import LogoutModal from '../utills/LogoutModal';


const { Header, Content, Sider } = Layout;


const AppLayout = () => {

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  const [isSiderOpen, setIsSiderOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const pageName = location.pathname.split("/")[1];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const loginUserData = useSelector((state) => state?.authSlice?.loginUser);
  const userRole = loginUserData?.role;

  // console.log(loginUserData, "loginUserData ......");

  const menuData = [
    {
      key: "1", icon: UserOutlined, roles: ["admin"], label:
        <NavLink to={`/doctor`}>Doctors</NavLink>
    },
    {
      key: "2", icon: FaUserMd, roles: ["admin"],
      label: <NavLink to="/consultant">Add Consultant</NavLink>,
    },
    {
      key: "9", icon: FaMicrophone, roles: ["admin"],
      label: <NavLink to="/pronunciation">Add Doctor Pronunciation</NavLink>,
    },
    {
      key: "10", icon: FaUserMinus, roles: ["admin"],
      label: <NavLink to="/removeDoctor">Doctor Management</NavLink>,
    },
    {
      key: "8",
      icon: FaTextWidth,
      roles: ["admin"],
      label: (
        <span><NavLink to={`/addScreens`}>Add Screens</NavLink></span>
      )
    },
    {
      key: "16",
      icon: FileTextOutlined,
      roles: ["admin", "Receptionist"],
      label: "Out Patient",
      children: [
        {
          key: "16-1",
          label: <NavLink to="/opdReceiptPage">OPD Receipt</NavLink>
        },
        {
          key: "16-2",
          label: <NavLink to="/partialPaymentPage">Patrtial Payment</NavLink>
        },
      ],
    },
    {
      key: "17",
      icon: TeamOutlined,
      roles: ["admin", "Receptionist"],
      label: "Management",
      children: [
        {
          key: "17-1",
          label: <NavLink to="/userSessionPage">User Session</NavLink>
        },
      ]
    },
    {
      key: "18",
      icon: FundOutlined,
      roles: ["admin", "Receptionist"],
      label: "Statistics",
      children: [
        {
          key: "18-1",
          label: <NavLink to="/currentCashPage">Current Cash Status</NavLink>
        }
      ]
    },
    {
      key: "19",
      icon: FaXRay,
      roles: ["admin", "Receptionist"],
      label: "X-Ray",
      children: [
        {
          key: "19-1",
          label: <NavLink to="/xray-request">X-Ray Tempelate Designer</NavLink>
        },
        {
          key: "19-2",
          label: <NavLink to="/xray-reports">X-Ray Reports</NavLink>
        }
      ]
    },
    {
      key: "20",
      icon: SettingOutlined,
      roles: ["admin", "Receptionist"],
      label: "Settings",
      children: [
        {
          key: "20-1",
          label: <NavLink to="/clinic-settings">Change Password</NavLink>
        }
      ]
    },
    {
      key: "3", icon: LaptopOutlined, roles: ["admin"], label: "Screen 1",
      children: [
        { key: "1-1", label: <NavLink to={`/screen1`}>Add Data</NavLink> },
        { key: "1-2", label: <NavLink to={`/screen1display`}>TV Screen</NavLink> },
      ],
    },
    {
      key: "4", icon: LaptopOutlined, roles: ["admin"], label: "Screen 2",
      children: [
        {
          key: "2-1",
          label: (
            <span style={{ pointerEvents: "none", opacity: 0.4, color: 'gray', fontWeight: "500", cursor: "not-allowed" }}>
              <NavLink to="/screen2">Add Data</NavLink>
            </span>
          ),
        },
        { key: "2-2", label: <NavLink to="/screen2display">TV Screen</NavLink> },
      ],
    },
    {
      key: "5", icon: LaptopOutlined, roles: ["admin"], label: "Screen 3",
      children: [
        { key: "3-1", label: <NavLink to={`/screen3`}>Add Data</NavLink> },
        { key: "3-2", label: <NavLink to={`/screen3display`}>TV Screen</NavLink> },
      ],
    },
    {
      key: "6", icon: LaptopOutlined, roles: ["admin"], label: "Screen 4",
      children: [
        { key: "4-1", label: <NavLink to={`/screen4`}>Add Data</NavLink> },
        { key: "4-2", label: <NavLink to={`/screen4display`}>TV Screen</NavLink> },
      ],
    },
    {
      key: "7", icon: LaptopOutlined, roles: ["admin"], label: "Screen 5",
      children: [
        { key: "5-2", label: <NavLink to={`/screen/5`}>TV Screen</NavLink> },
      ],
    },
    {
      key: "11", icon: LaptopOutlined, roles: ["admin"], label: "Screen 6",
      children: [
        { key: "6-2", label: <NavLink to={`/screen/6`}>TV Screen</NavLink> },
      ],
    },
    {
      key: "12", icon: LaptopOutlined, roles: ["admin"], label: "Screen 7",
      children: [
        { key: "7-2", label: <NavLink to={`/screen/7`}>TV Screen</NavLink> },
      ],
    },
    {
      key: "13", icon: LaptopOutlined, roles: ["admin"], label: "Screen 8",
      children: [
        { key: "8-2", label: <NavLink to={`/screen/8`}>TV Screen</NavLink> },
      ],
    },
    {
      key: "14", icon: LaptopOutlined, roles: ["admin"], label: "Screen 9",
      children: [
        { key: "9-2", label: <NavLink to={`/screen/9`}>TV Screen</NavLink> },
      ],
    },
    {
      key: "15",
      roles: ["admin", "Receptionist"], // sabko Logout dikhna chahiye
      label: (
        <button onClick={() => setIsModalOpen(true)}>
          Logout
        </button>
      ),
    }

  ];

  // Role ke hisaab se filter, aur original key preserve (regenerate mat karo!)
  const items2 = menuData
    .filter(item => !item.roles || item.roles.includes(userRole))
    .map((item) => ({
      key: item.key,
      icon: item.icon ? React.createElement(item.icon) : null,
      label: item.label || null,
      children: item.children
        ? item.children.map((child) => ({
          key: child.key,
          label: child.label,
        }))
        : null,
    }));


  useEffect(() => {

    if (userRole !== "admin") return;
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`${base_URL}/api/doctor/list`);
        dispatch(updateDoctorsData(res.data.data));
      } catch (error) {
        console.log("Failed to fetch doctors", error);
      }
    };
    fetchDoctors();
  }, [userRole]);


  return (

    <Layout style={{ height: "100vh", width: "100%", display: "flex", backgroundColor: "red", overflowX: "hidden" }}>

      {
        <LogoutModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} loginUserData={loginUserData} />
      }

      {/* HEADER */}
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#001529",
          color: "#fff",
          position: "relative",
          padding: "45px 50px",
          height: "8vh"
        }}
      >

        <NavLink to="/">
          <div className="cursor-pointer flex items-center gap-4 [@media(min-width:3200px)]:gap-8 [@media(min-width:4400px)]:gap-12 group">

            {/* Logo with gradient border */}
            <div className="relative ">

              {/* Animated gradient ring */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <img
                src={hospitraxLogo}
                alt="Hospitrax Logo"
                className="bg-amber-50 relative w-16 object-contain rounded-full p-2 border border-blue-400 shadow-xl"
              />
            </div>

            <div>
              <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 text-2xl font-bold min-[2000px]:text-4xl [@media(min-width:3200px)]:text-5xl [@media(min-width:4400px)]:text-6xl tracking-wide drop-shadow-lg">
                Hospitrax
              </h1>
              <p className="text-gray-400 text-xs italic min-[2000px]:text-xl [@media(min-width:3000px)]:text-2xl [@media(min-width:4400px)]:text-3xl font-medium group-hover:text-gray-300 transition">
                “Healthcare Management System”
              </p>
            </div>

          </div>
        </NavLink>


        <h1 className="hidden sm:block swim-text text-[28px] font-extrabold  tracking-wide">
          Memon Medical Complex
        </h1>

        <div className='flex gap-x-4 items-center'>

          <Time />

          <div className="flex gap-x-2 text-[18px] sm:text-[20px]">
            <span >Admin</span>
            <UserOutlined style={{ fontSize: "25px", color: "white" }} />
          </div>

        </div>

      </Header>

      {/* BODY */}
      <Layout >


        {/* SIDEBAR */}
        <Sider
          // collapsible
          collapsed={collapsed}
          trigger={null}
          style={{
            background: colorBgContainer,
            height: "88vh",
            overflow: "hidden",
          }}
          className={`2xl:!min-w-[240px] 2xl:!max-w-[240px] transition-all duration-300 ease-in-out z-50  ${isSiderOpen ? "!absolute left-0 ml-0 !h-[calc(100vh-70px)] shadow-lg" : "-ml-[200px] h-0"} md:ml-0 md:static md:h-full bg-white`}
        >

          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

            {/* Yeh wrapper div flex ka kaam karega */}
            <div
              style={{
                display: "flex",
                justifyContent: collapsed ? "center" : "flex-start",
                alignItems: "center",
                padding: collapsed ? "14px 0" : "14px 16px",
                borderBottom: "1px solid #f0f0f0",
                flexShrink: 0,
              }}
            >
              <button
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  background: "#f5f5f5",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: "#001529",
                }}
              >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </button>

            </div>

            {/* Scrollable area - logout ke bina */}
            <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
              <Menu
                style={{
                  width: "100%",
                  paddingTop: "40px",
                  borderInlineEnd: 0,
                }}
                items={items2.filter(item => item.key !== "15")}
              />
            </div>

            {/* Logout - hamesha neeche fixed */}
            <div style={{
              borderTop: "1px solid #f0f0f0",
              padding: "12px 0",
              background: colorBgContainer,
              flexShrink: 0,  // yeh shrink nahi hoga
            }}>
              <Menu
                style={{
                  width: "100%",
                  borderInlineEnd: 0,
                }}
                items={items2.filter(item => item.key === "15")}
              />
            </div>

          </div>

        </Sider>


        <button className={`flex align-top pt-4 pl-3 md:hidden cursor-pointer z-99 ${isSiderOpen && "absolute"} `}>
          {
            !isSiderOpen ? <AiOutlineMenu onClick={() => setIsSiderOpen(true)} size={24} />
              :
              <AiFillCloseCircle onClick={() => setIsSiderOpen(false)} size={24} />
          }
        </button>

        {/* MAIN CONTENT */}
        <Layout style={{ padding: "0 24px 24px" }}>
          <Breadcrumb
            items={[{ title: <NavLink to={userRole == "Receptionist" ? `/receptionist` : `/`}>Home</NavLink> }, { title: pageName },]}
            style={{ margin: "16px 0" }}
          />
          <Content
            style={{
              padding: 24,
              margin: 0,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              overflowY: "auto",
              // overflowX : "hidden"

            }}
          >
            <Outlet />

          </Content>
        </Layout>

      </Layout>

    </Layout >
  );
};

export default AppLayout;
