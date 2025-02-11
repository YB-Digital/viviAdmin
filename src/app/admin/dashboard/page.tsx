import InformationBoxes from '@/component/informationBoxes'
import DashboardUserTable from '@/component/dashboardUserTable'

//style
import './dashboard.scss'

export default function Page() {
  return (
    <div className='dashboardPage'>
      <InformationBoxes />
      <DashboardUserTable />
    </div>
  )
}