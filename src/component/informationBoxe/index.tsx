import Image from 'next/image'

//style
import './informationBoxe.scss'

interface InformationBoxeProps {
  class?: string;
  img: string; 
  text: string; 
  data: string; 
}

export default function InformationBoxe({ class: className, img, text, data }: InformationBoxeProps) {
  return (
    <div className={`informationBoxe ${className}`}>
      <Image src={img} alt="icon" width={50} height={50} />
      <p className="text font-inter">{text}</p>
      <p className="data font-inter">{data}</p>
    </div>
  );
}