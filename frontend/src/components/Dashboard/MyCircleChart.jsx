import { Grid } from 'antd';
import { memo } from 'react';
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const MyCircleChart = ({ piData , active }) => {

    const { useBreakpoint } = Grid;
    const { sm } = useBreakpoint();
    const innerRadius = sm ? 35 : 25;

    return (

        <ResponsiveContainer width="100%" height={active == "dd" ? "100%" : "80%"} >
            <PieChart >
                <Pie
                    activeShape={{
                        fill: '#d3d3d3',
                    }}
                    data={piData}
                    dataKey="uv"
                    innerRadius={active == "dd" && innerRadius}
                />
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>

    )
}

export default memo(MyCircleChart)

