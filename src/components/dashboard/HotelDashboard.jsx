import React, { useMemo, useState } from 'react'
import { Bed, BedDouble, LogOut, Users, Menu, ChevronLeft, DollarSign, CalendarDays, UserCircle2, Bell } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// Minimal shadcn-like UI primitives (scoped to this dashboard directory)
const Card = ({ className = '', children }) => (
  <div className={`rounded-xl border bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm ${className}`}>{children}</div>
)
const CardHeader = ({ className = '', children }) => (
  <div className={`flex items-center justify-between gap-2 p-4 border-b ${className}`}>{children}</div>
)
const CardTitle = ({ className = '', children }) => (
  <h3 className={`text-sm font-medium text-gray-700 ${className}`}>{children}</h3>
)
const CardContent = ({ className = '', children }) => (
  <div className={`p-4 ${className}`}>{children}</div>
)
const Badge = ({ variant = 'default', children }) => {
  const styles = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-800',
    destructive: 'bg-rose-100 text-rose-700',
    info: 'bg-blue-100 text-blue-700',
    outline: 'border border-gray-300 text-gray-700',
  }[variant]
  return <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${styles}`}>{children}</span>
}
const ScrollArea = ({ className = '', children }) => (
  <div className={`overflow-y-auto ${className}`}>{children}</div>
)

// Table components
const Table = ({ children }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse min-w-[640px]">{children}</table>
  </div>
)
const THead = ({ children }) => (
  <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">{children}</thead>
)
const TBody = ({ children }) => <tbody className="divide-y divide-gray-100">{children}</tbody>
const TR = ({ children }) => <tr className="hover:bg-gray-50/60">{children}</tr>
const TH = ({ className = '', children }) => (
  <th className={`px-4 py-3 font-semibold ${className}`}>{children}</th>
)
const TD = ({ className = '', children }) => (
  <td className={`px-4 py-3 text-sm text-gray-700 ${className}`}>{children}</td>
)

// Types (JSDoc for clarity since this project uses JS)
/** @typedef {{name: string; room: string|number; checkIn: string; checkOut: string; status: 'Checked-in'|'Checked-out'|'Pre-booked'}} Booking */
/** @typedef {{name: string; role: string; priority: 'High'|'Medium'|'Low'; task: string}} Staff */
/** @typedef {{day: string; bookings: number; expenditure: number; food: number}} FinancialDatum */
/** @typedef {{guest: string; room: string|number; request: string}} Request */

const sampleMetrics = {
  totalVacancy: 42,
  totalBooked: 128,
  pendingCheckout: 9,
  totalGuests: 276,
  totalStaff: 58,
  totalExpenditure: 82450,
}

/** @type {Booking[]} */
const bookingRows = [
  { name: 'Alice Johnson', room: '402', checkIn: '2025-11-15', checkOut: '2025-11-18', status: 'Checked-in' },
  { name: 'Michael Chen', room: '305', checkIn: '2025-11-16', checkOut: '2025-11-19', status: 'Pre-booked' },
  { name: 'Priya Nair', room: '1201', checkIn: '2025-11-14', checkOut: '2025-11-17', status: 'Checked-in' },
  { name: 'Diego Rivera', room: '708', checkIn: '2025-11-13', checkOut: '2025-11-16', status: 'Checked-out' },
  { name: 'Emma Wilson', room: '214', checkIn: '2025-11-12', checkOut: '2025-11-15', status: 'Checked-out' },
]

/** @type {Staff[]} */
const staffRows = [
  { name: 'Sofia Gomez', role: 'Front Desk', priority: 'High', task: 'VIP check-in at 3 PM' },
  { name: 'James Lee', role: 'Housekeeping', priority: 'Medium', task: 'Prepare rooms 210-220' },
  { name: 'Aisha Khan', role: 'F&B', priority: 'Low', task: 'Inventory check' },
  { name: 'Tom Müller', role: 'Maintenance', priority: 'High', task: 'Fix AC in 904' },
]

/** @type {FinancialDatum[]} */
const financialData = [
  { day: 'Mon', bookings: 24, expenditure: 9800, food: 42 },
  { day: 'Tue', bookings: 31, expenditure: 10400, food: 55 },
  { day: 'Wed', bookings: 28, expenditure: 9100, food: 48 },
  { day: 'Thu', bookings: 36, expenditure: 11200, food: 61 },
  { day: 'Fri', bookings: 47, expenditure: 13900, food: 78 },
  { day: 'Sat', bookings: 52, expenditure: 15100, food: 83 },
  { day: 'Sun', bookings: 29, expenditure: 9700, food: 50 },
]

/** @type {Request[]} */
const requests = [
  { guest: 'Liam Brown', room: '512', request: 'Extra pillows and blanket' },
  { guest: 'Olivia Davis', room: '803', request: 'Airport pickup at 6 PM' },
  { guest: 'Noah Wilson', room: '1102', request: 'Vegan dinner for two' },
  { guest: 'Ava Martinez', room: '221', request: 'Late checkout (2 PM)' },
  { guest: 'Ethan Taylor', room: '917', request: 'Baby crib in room' },
]

const SidebarItem = ({ icon: Icon, label }) => (
  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition">
    <Icon className="h-4 w-4" />
    <span className="text-sm font-medium">{label}</span>
  </button>
)

const MetricCard = ({ title, value, icon: Icon, accent = 'bg-blue-50 text-blue-600' }) => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-md ${accent}`}>
          <Icon className="h-4 w-4" />
        </div>
        <CardTitle>{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-semibold tracking-tight text-gray-900">{value}</div>
    </CardContent>
  </Card>
)

const formatCurrency = (num) => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num)

export default function HotelDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const chartLegend = useMemo(() => ({
    bookings: { name: 'Bookings', color: '#2563eb' },
    expenditure: { name: 'Expenditure', color: '#16a34a' },
    food: { name: 'Food Bookings', color: '#f59e0b' },
  }), [])

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-white text-gray-900">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="inline-flex lg:hidden items-center justify-center rounded-md p-2 hover:bg-gray-100"
              onClick={() => setSidebarOpen((s) => !s)}
              aria-label="Toggle navigation"
            >
              {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="flex items-center gap-2">
              <BedDouble className="h-5 w-5 text-blue-600" />
              <span className="font-semibold">Hotel Manager</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <button className="p-2 rounded-md hover:bg-gray-100" aria-label="Notifications"><Bell className="h-5 w-5" /></button>
            <div className="flex items-center gap-2">
              <UserCircle2 className="h-6 w-6" />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
          {/* Sidebar */}
          <aside className={`lg:sticky lg:top-16 h-max transition-all ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
            <Card className="p-3">
              <nav className="space-y-1">
                <SidebarItem icon={BedDouble} label="Dashboard" />
                <SidebarItem icon={CalendarDays} label="Reservations" />
                <SidebarItem icon={Users} label="Guests" />
                <SidebarItem icon={LogOut} label="Check-outs" />
                <SidebarItem icon={DollarSign} label="Finance" />
              </nav>
            </Card>
          </aside>

          {/* Main content */}
          <main className="space-y-6">
            {/* KPI Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <MetricCard title="Total Vacancy" value={sampleMetrics.totalVacancy} icon={Bed} accent="bg-blue-50 text-blue-600" />
              <MetricCard title="Total Booked" value={sampleMetrics.totalBooked} icon={BedDouble} accent="bg-indigo-50 text-indigo-600" />
              <MetricCard title="Pending Check-outs" value={sampleMetrics.pendingCheckout} icon={LogOut} accent="bg-amber-50 text-amber-600" />
              <MetricCard title="Total Guests" value={sampleMetrics.totalGuests} icon={Users} accent="bg-emerald-50 text-emerald-600" />
            </section>

            {/* Bookings table */}
            <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <Card className="xl:col-span-2">
                <CardHeader>
                  <CardTitle>Guest Booking Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <THead>
                      <TR>
                        <TH>Guest Name</TH>
                        <TH>Room Number</TH>
                        <TH>Check-in Date</TH>
                        <TH>Check-out Date</TH>
                        <TH>Status</TH>
                      </TR>
                    </THead>
                    <TBody>
                      {bookingRows.map((row, idx) => (
                        <TR key={idx}>
                          <TD className="font-medium">{row.name}</TD>
                          <TD>{row.room}</TD>
                          <TD>{row.checkIn}</TD>
                          <TD>{row.checkOut}</TD>
                          <TD>
                            {row.status === 'Checked-in' && <Badge variant="success">Checked-in</Badge>}
                            {row.status === 'Checked-out' && <Badge variant="outline">Checked-out</Badge>}
                            {row.status === 'Pre-booked' && <Badge variant="info">Pre-booked</Badge>}
                          </TD>
                        </TR>
                      ))}
                    </TBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Staff Overview */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Staff Overview</CardTitle>
                    <div className="text-2xl font-semibold">{sampleMetrics.totalStaff} Total Staff</div>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Staff Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <THead>
                        <TR>
                          <TH>Name</TH>
                          <TH>Role</TH>
                          <TH>Job Priority</TH>
                          <TH>Current Task</TH>
                        </TR>
                      </THead>
                      <TBody>
                        {staffRows.map((s, i) => (
                          <TR key={i}>
                            <TD className="font-medium">{s.name}</TD>
                            <TD>{s.role}</TD>
                            <TD>
                              {s.priority === 'High' && <Badge variant="destructive">High</Badge>}
                              {s.priority === 'Medium' && <Badge variant="warning">Medium</Badge>}
                              {s.priority === 'Low' && <Badge>Low</Badge>}
                            </TD>
                            <TD>{s.task}</TD>
                          </TR>
                        ))}
                      </TBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Financial Overview + Requests */}
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <Card className="xl:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between w-full">
                    <CardTitle>Financial Overview (Last 7 Days)</CardTitle>
                    <div className="text-sm text-gray-500">USD</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 text-sm text-gray-600">Total Expenditure: <span className="font-semibold text-gray-900">{formatCurrency(sampleMetrics.totalExpenditure)}</span></div>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={financialData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="day" stroke="#6b7280" tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
                        <YAxis stroke="#6b7280" tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
                        <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }} />
                        <Legend />
                        <Bar dataKey="bookings" name={chartLegend.bookings.name} fill={chartLegend.bookings.color} radius={[4,4,0,0]} />
                        <Bar dataKey="expenditure" name={chartLegend.expenditure.name} fill={chartLegend.expenditure.color} radius={[4,4,0,0]} />
                        <Bar dataKey="food" name={chartLegend.food.name} fill={chartLegend.food.color} radius={[4,4,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Guest Special Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-72 pr-2">
                    <ul className="space-y-3">
                      {requests.map((r, i) => (
                        <li key={i} className="flex items-start gap-3 border-b last:border-none pb-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-semibold">
                            {r.guest.split(' ').map(w => w[0]).slice(0,2).join('')}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{r.guest} • Room {r.room}</div>
                            <div className="text-sm text-gray-600">{r.request}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </CardContent>
              </Card>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}
