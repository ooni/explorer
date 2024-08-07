import { useRouter } from 'next/router'
import OONI404 from '../public/static/images/OONI_404.svg'

const NotFound = ({ title }) => {
  const { asPath } = useRouter()

  return (
    <div className="container">
      <div className="flex justify-around items-center my-16">
        <OONI404 height="200px" />
        <div className="w-1/2">
          <h4>{title}</h4>
          <div className="text-gray-800">{`${process.env.NEXT_PUBLIC_EXPLORER_URL}${asPath}`}</div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
