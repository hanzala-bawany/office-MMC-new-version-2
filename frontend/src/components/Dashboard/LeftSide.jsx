import heartImg from '../../assets/heart.svg'
import TS1 from '../../assets/TS 1.svg'
import TS2 from '../../assets/TS 2.svg'
import TS3 from '../../assets/TS 3.svg'
import ColumnChart from './ColumnChart'
import MyCircleChart from './MyCircleChart'
import TotalCard from './TotalCard'
import { Table } from 'antd'

const LeftSide = () => {

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Designation',
            dataIndex: 'designation',
            key: 'designation',
        },
        {
            title: 'Timing',
            dataIndex: 'timing',
            key: 'timing',
        },
    ];

    const dataSource = [
        {
            key: '1',
            name: 'Mike',
            age: 32,
            address: '10 Downing Street',
            designation: 'child specialist',
            timing: '9am to 11am',
        },
        {
            key: '2',
            name: 'John',
            age: 42,
            address: '10 Downing Street',
        },
        {
            key: '3',
            name: 'Mike',
            age: 32,
            address: '10 Downing Street',
            designation: 'child specialist',
            timing: '9am to 11am',
        },
        {
            key: '4',
            name: 'Mike',
            age: 32,
            address: '10 Downing Street',
            designation: 'child specialist',
            timing: '9am to 11am',
        },
        {
            key: '5',
            name: 'Mike',
            age: 32,
            address: '10 Downing Street',
            designation: 'child specialist',
            timing: '9am to 11am',
        }, {
            key: '6',
            name: 'Mike',
            age: 32,
            address: '10 Downing Street',
            designation: 'child specialist',
            timing: '9am to 11am',
        }, {
            key: '7',
            name: 'Mike',
            age: 32,
            address: '10 Downing Street',
            designation: 'child specialist',
            timing: '9am to 11am',
        },

    ];

    const piData = [
        { name: 'Page A', uv: 590, fill: "#8884d8" },
        { name: 'Page B', uv: 590, fill: "yellow" },
        { name: 'Page C', uv: 868, fill: "brown" },
        { name: 'Page d', uv: 168, fill: "gray" },
    ]



return (
    <div className=" flex-7 flex flex-col gap-5  ">

        <div className="themeBoxShadow  flex flex-col text-center  sm:flex-row justify-between bg-white items-center gap-5 lg:gap-2  w-full p-5 ">
            <img className='w-[120px]' src={heartImg} alt="" />

            <div className='text-center lg:text-start flex-5'>
                <h2 className='font-bold text-[20px]'>Today - 20% Discount on Lung Examinations</h2>
                <p className='text-[16px] mt-2 lg:mt-0'>The Package price includes: consultoin of a pulmonolgist, spirogrphy, cardiogram</p>
            </div>

            <div className='dashBtn'>Know More</div>
        </div>

        <div className='flex flex-col  sm:flex-row md:flex-col [@media(min-width:900px)]:flex-row   justify-between w-full  gap-5'>

            <TotalCard img={TS1} digit="1245" text="Total Patient" />
            <TotalCard img={TS2} digit="1245" text="Total Patient" />
            <TotalCard img={TS3} digit="5000" text="Total Patient" />

        </div>

        <div className='flex flex-col  md:flex-row [@media(min-width:900px)]:flex-row justify-between gap-5 w-full h-[550px] md:h-[400px]'>

            <div className='themeBoxShadow border-none outline-none flex-1 md:flex-1 '>
                <div className='flex items-center border-b border-gray-300 text-[18px] text-gray-500 p-3 h-[20%] font-medium'>
                    Patient Type
                </div>

                <MyCircleChart piData={piData} active="home" />
            </div>

            <div className='themeBoxShadow  border-none outline-none flex-1 md:flex-2'>
                <div className='flex items-center border-b border-gray-300 text-[18px] text-gray-500 p-3 h-[20%] font-medium'>
                    Faculty Attendence
                </div>

                <ColumnChart />
            </div>

        </div>

        <div className='themeBoxShadow custom-scrollbar overflow-y-scroll h-[60vh] xl:h-auto'>
            <Table
                dataSource={dataSource}
                columns={columns}
            />
        </div>

    </div>
)
}

export default LeftSide