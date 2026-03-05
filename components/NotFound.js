import { useRouter } from 'next/router'
import Image from 'next/image'

const NotFound = ({ title }) => {
  const { asPath } = useRouter()

  return (
    <div className="shadow-[0_-100px_0] shadow-blue-500 mt-16">
      <div className="container">
        <div className="flex flex-col md:flex-row gap-4 justify-around items-center py-20">
          <Image
            src="/static/images/OONI_404.svg"
            alt="404"
            height={200}
            className="min-w-[200px]"
            style={{ height: '200px', width: 'auto' }}
            unoptimized
          />
          <div>
            <h4>{title}</h4>
            <div className="text-gray-800 break-all">{`${process.env.NEXT_PUBLIC_EXPLORER_URL}${asPath}`}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
