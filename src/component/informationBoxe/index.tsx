import Image from 'next/image'

//style
import './informationBoxe.scss'

export default function InformationBoxe(props:any) {
    return (
        <div className={`informationBoxe ${props.class}`}>
            <Image src={props.img} alt='icon'/>
            <p className='text font-inter'>{props.text}</p>
            <p className='data font-inter'>{props.data}</p>
        </div>
    )
}
