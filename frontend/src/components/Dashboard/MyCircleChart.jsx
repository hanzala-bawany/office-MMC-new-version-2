// import { Grid } from 'antd';
// import { memo } from 'react';
// import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

// const MyCircleChart = ({ piData , active }) => {

//     const { useBreakpoint } = Grid;
//     const { sm } = useBreakpoint();
//     const innerRadius = sm ? 35 : 25;

//     return (

//         <ResponsiveContainer width="100%" height={active == "dd" ? "100%" : "80%"} >
//             <PieChart >
//                 <Pie
//                     activeShape={{
//                         fill: '#d3d3d3',
//                     }}
//                     data={piData}
//                     dataKey="uv"
//                     innerRadius={active == "dd" && innerRadius}
//                 />
//                 <Tooltip />
//             </PieChart>
//         </ResponsiveContainer>

//     )
// }

// export default memo(MyCircleChart)




import { Grid } from "antd";
import { memo } from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const MyCircleChart = ({ piData, active }) => {

    const { useBreakpoint } = Grid;
    const { sm } = useBreakpoint();
    const innerRadius = sm ? 35 : 25;

    // 🔹 Percentage Label Renderer
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
       
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.45;

        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="#ffffff"              // ✅ white color
                textAnchor="middle"         // ✅ center align
                dominantBaseline="central"
                className="font-bold text-xs sm:text-sm select-none"
            >
                {`${(percent * 100).toFixed(1)}%`}

            </text>
        );
    };


    return (
        <ResponsiveContainer
            width="100%"
            height={active === "dd" ? "100%" : "80%"}
        >
            <PieChart>
                <Pie
                    data={piData}
                    dataKey="uv"
                    innerRadius={active === "dd" ? innerRadius : 0}
                    outerRadius={sm ? 80 : 60}
                    labelLine={false}
                    label={renderCustomizedLabel}   // ⭐ percentage yahan se aayegi
                />
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default memo(MyCircleChart);


