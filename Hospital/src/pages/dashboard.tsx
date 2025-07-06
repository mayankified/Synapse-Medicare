import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Bed, Calendar, Clock, Users, Coins } from "lucide-react";

// 🔹 Indian hospital stats
const stats = [
  {
    title: "Total Patients",
    value: "3,450",
    icon: Users,
  },
  {
    title: "Appointments Today",
    value: "62",
    icon: Calendar,
  },
  {
    title: "Available Beds",
    value: "18/100",
    icon: Bed,
  },
  {
    title: "Revenue (INR)",
    value: "₹42,75,000",
    icon: Coins,
  },
];

// 🔹 Recent hospital activity in India
const recentActivity = [
  {
    id: 1,
    type: "admission",
    patient: "Amit Sharma",
    time: "15 minutes ago",
    description: "Admitted to ICU at Apollo Hospital, Mumbai",
  },
  {
    id: 2,
    type: "appointment",
    patient: "Neha Patel",
    time: "30 minutes ago",
    description: "Completed checkup with Dr. Mehta at Fortis Hospital, Delhi",
  },
  {
    id: 3,
    type: "discharge",
    patient: "Rajesh Kumar",
    time: "2 hours ago",
    description: "Discharged from General Ward at AIIMS, New Delhi",
  },
  {
    id: 4,
    type: "appointment",
    patient: "Priya Iyer",
    time: "3 hours ago",
    description: "Routine checkup completed at Manipal Hospital, Bangalore",
  },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hospital Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to Healthcare Hub</p>
        </div>
      <img className="w-[120px]" src="./haha.png" alt="" />
      </div>

      {/* 🔹 Statistics Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 🔹 Recent Activity Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.patient}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
