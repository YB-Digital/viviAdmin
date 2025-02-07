import InformationBoxe from '../informationBoxe'

//style
import './informationBoxes.scss'

//image
import revenue from '@/image/revenue.svg'
import user from '@/image/adminUser.svg'
import service from '@/image/adminServices.svg'
import video from '@/image/adminVideo.svg'

export default function InformationBoxes() {
  return (
    <div className='informationBoxes'>
        <InformationBoxe img={revenue} text={'Total Revenue'} data={'$ 10.500'} class={'revenue'}/>
        <InformationBoxe img={user} text={'User'} data={'10.500'} class={'user'}/>
        <InformationBoxe img={service} text={'Total Service'} data={'10.500'} class={'service'}/>
        <InformationBoxe img={video} text={'Total Video'} data={'10.500'} class={'video'}/>
    </div>
  )
}