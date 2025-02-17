import AddServiceForm from '@/component/addServiceForm'
import ServiceTable from '@/component/serviceTable'

//style
import './addService.scss'

export default function Page() {
  return (
    <div className='addService'>
        <AddServiceForm />
        <ServiceTable />
    </div>
  )
}
