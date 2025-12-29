import {Tabs,} from "antd";
import Tabe1 from "../components/Reception/Tabe1";
import Tabe2 from "../components/Reception/Tabe2";
import Tabe3 from "../components/Reception/Tabe3";




export default function ReceptionPage() {


  return (

    <div style={{ padding: 20 }}>

      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "➕ Add / Edit Patient",
            children:  <Tabe1 />
          },

          // TAB 2
          {
            key: "2",
            label: "👨‍⚕️ Patient History",
            children: <Tabe2/>,
          },

          // TAB 3
          {
            key: "3",
            label: "📊 Complete History",
            children: <Tabe3 />,
          },
        ]}
      />

    </div>
  );
}
