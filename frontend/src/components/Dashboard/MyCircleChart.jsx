import { memo } from 'react';
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const MyCircleChart = ({ piData }) => {


    return (

        <ResponsiveContainer width="100%" height="100%" >
            <PieChart >
                <Pie
                    activeShape={{
                        fill: '#d3d3d3',
                    }}
                    data={piData}
                    dataKey="uv"
                    innerRadius={35}
                />
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>

    )
}

export default memo(MyCircleChart)

