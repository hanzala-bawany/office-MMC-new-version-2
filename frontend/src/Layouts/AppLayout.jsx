// src/layouts/AppLayout.jsx
import { Layout, Menu, Breadcrumb, theme, Flex } from 'antd';
import React, { useEffect, useState } from 'react';
import NavImg from '../assets/MMC logo.png';
import { UserOutlined, LaptopOutlined } from '@ant-design/icons';
import { FaChalkboardTeacher, FaTextWidth } from 'react-icons/fa';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineMenu } from "react-icons/ai";
import { AiFillCloseCircle } from 'react-icons/ai';
import moment from 'moment';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../reduxToolKit/authSlice';
import "./AppLayout.css"
import { span } from 'framer-motion/client';
import Time from '../components/Applayout/Time';
import axios from 'axios';
import { base_URL } from '../utills/baseUrl';
import { updateDoctorsData } from '../reduxToolKit/doctorSlice';


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

  const menuData = [
    {
      key: "1", icon: UserOutlined, label:
        <NavLink
          to={`/doctor`}
        >
          Doctors
        </NavLink>
    },
    {
      key: "2", icon: FaChalkboardTeacher, label:
        <NavLink
          to={`/consultant `}

        >
          Add Consultant
        </NavLink>
    },
    {
      key: "3",
      icon: LaptopOutlined,
      label: "Screen 1",
      children: [
        {
          key: "1-1", label:
            <NavLink
              to={`/screen1`}
            >
              Add Data
            </NavLink>
        },
        {
          key: "1-2", label:
            <NavLink
              to={`/screen1display`}
            >
              TV Screen
            </NavLink>
        },
      ],
    },
    {
      key: "4",
      icon: LaptopOutlined,
      label: "Screen 2",
      children: [
        {
          key: "2-1",
          label: (
            <span style={{
              pointerEvents: "none",
              opacity: 0.4,
              color: 'gray',
              fontWeight: "500",
              cursor: "not-allowed",
            }}>
              <NavLink to="/screen2">
                Add Data
              </NavLink>
            </span>
          ),
        },
        {
          key: "2-2",
          label: (
            <NavLink to="/screen2display">
              TV Screen
            </NavLink>
          ),
        },
      ],
    },
    {
      key: "5",
      icon: LaptopOutlined,
      label: "Screen 3",
      children: [
        {
          key: "3-1", label:
            <NavLink
              to={`/screen3`}
            >
              Add Data
            </NavLink>
        },
        {
          key: "3-2", label:
            <NavLink
              to={`/screen3display`}
            >
              TV Screen
            </NavLink>
        },
      ],
    },
    {
      key: "6",
      icon: LaptopOutlined,
      label: "Screen 4",
      children: [
        {
          key: "4-1", label:
            <NavLink
              to={`/screen4`}
            >
              Add Data
            </NavLink>
        },
        {
          key: "4-2", label:
            <NavLink
              to={`/screen4display`}
            >
              TV Screen
            </NavLink>
        },
      ],
    },
    {
      key: "7", icon: FaTextWidth, label: (
        <span style={{
          pointerEvents: "none",
          opacity: 0.4,
          color: 'gray',
          fontWeight: "500",
          cursor: "not-allowed",
        }}>
          <NavLink
            to={`/screens`}
          >
            Screens Description
          </NavLink>
        </span>)
    },
    {
      key: "9",
      label:
        <button onClick={() => {
          dispatch(logoutUser())
          toast.success("Logout Scuccessful")
          navigate("/login")
        }} >
          Logout
        </button>
    },
  ];

  const items2 = menuData.map((item, i) => ({
    key: `${i + 1}`,
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
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`${base_URL}/api/doctor/list`);
        dispatch(updateDoctorsData(res.data.data));
      } catch (error) {
        console.log("Failed to fetch doctors", error);
      }
    };
    fetchDoctors();
  }, []);


  return (

    <Layout style={{ height: "100vh", width: "100%", display: "flex", backgroundColor: "red", overflowX: "hidden" }}>
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
          height:"12vh"
        }}
      >
        <NavLink to="/">
          <img
            src={NavImg}
            alt="logo"
            style={{ borderRadius: "50%" }}
            className='w-15 h-15 sm:h-15 sm:w-20'
          />
        </NavLink>

        {/* <h1 style={{ color: "red", margin: 0, fontSize: "25px" }} className='hidden sm:block'>
          Memon Medical Complex
        </h1> */}
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
          // width={240}
          style={{ background: colorBgContainer,   height:"88vh", overflow:"hidden"  }}
          className={`2xl:!min-w-[240px] 2xl:!max-w-[240px]   transition-all duration-300 ease-in-out z-50 
          ${isSiderOpen
              ? " !absolute left-0 ml-0 !h-[calc(100vh-70px)] shadow-lg"
              : "-ml-[200px] h-0"}
          md:ml-0  md:static md:h-full  bg-white `}
        >
          <Menu
           
            style={{ height: "100%", width:"100%" , paddingTop:"40px", borderInlineEnd: 0, display: "flex", flexDirection: "column" }}
            items={items2}
          />
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
            items={[{ title: <NavLink to="/">Home</NavLink> }, { title: pageName },]}
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
    </Layout>
  );
};

export default AppLayout;
