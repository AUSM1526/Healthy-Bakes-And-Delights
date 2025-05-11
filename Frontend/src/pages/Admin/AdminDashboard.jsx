import React from "react";
import { Package, ShoppingCart, Users, BarChart2,ShoppingBag} from "lucide-react";
import SideBar from "../../components/Sidebar";


const Dashboard = () => {
  return (
    <div className="min-h-screen flex bg-[#fdf7f2] text-[#42210b]">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <main className="flex-1 p-6 py-12 md:py-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-sm text-[#6c4f3d]">Welcome back, Admin</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Revenue" value="₹42,500" change="12% from last month" icon={<BarChart2 size={20} />} up />
          <StatCard title="Orders" value="128" change="8% from last month" icon={<ShoppingCart size={20} />} up />
          <StatCard title="Products" value="45" change="3 new this month" icon={<Package size={20} />} up />
          <StatCard title="Customers" value="312" change="2% from last month" icon={<Users size={20} />} />
        </div>

        {/* Tabs */}
        <div className="mb-4">
          <div className="flex space-x-4 text-sm font-medium">
            <button className="px-4 py-2 bg-[#ede2d4] rounded text-[#42210b]">Overview</button>
            <button className="px-4 py-2">Analytics</button>
            <button className="px-4 py-2">Reports</button>
          </div>
        </div>

        {/* Revenue + Orders Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="col-span-2 bg-white rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold mb-2">Revenue Overview</h3>
            <div className="flex items-center justify-center h-48 text-gray-400">
              <BarChart2 className="w-12 h-12" />
              <span className="ml-2">Revenue chart will appear here</span>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold mb-2">Recent Orders</h3>
            <p className="text-sm text-[#6c4f3d] mb-4">You have 12 orders this week</p>
            <OrderItem id="#4345" amount="1247" date="5/11/2025" />
            <OrderItem id="#4862" amount="2555" date="5/11/2025" />
            <OrderItem id="#9385" amount="241" date="5/11/2025" />
          </div>
        </div>
      </main>
    </div>
  );
};



const StatCard = ({ title, value, change, icon, up = false }) => (
  <div className="bg-white rounded-lg p-4 shadow flex flex-col space-y-2">
    <div className="text-sm text-[#6c4f3d]">{title}</div>
    <div className="text-2xl font-bold flex justify-between items-center">
      {value}
      {icon}
    </div>
    <div className={`text-sm ${up ? "text-green-600" : "text-red-500"}`}>↕ {change}</div>
  </div>
);

const OrderItem = ({ id, amount, date }) => (
  <div className="flex items-center justify-between py-2 border-b">
    <div className="flex items-center space-x-3">
      <ShoppingBag className="w-5 h-5 text-[#42210b]" />
      <div>
        <p className="text-sm font-semibold">Order {id}</p>
        <p className="text-xs text-[#6c4f3d]">{date}</p>
      </div>
    </div>
    <div className="text-sm font-medium">₹{amount}</div>
  </div>
);

export default Dashboard;
