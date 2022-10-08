import { ThreeDots } from 'react-loader-spinner'

export function Loader() {
  return (
    <div>
            {/* <ThreeDots 
                height="80" 
                width="80" 
                radius="9"
                color="#eb05ad" 
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClassName=""
                visible={true}
            /> */}
      <svg className="animate-spin h-10 w-10 text-[#5634ee]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  )
}

export function FetchingLoader({message}) {
  return (
    <div className='flex flex-col justify-center items-center bg-white h-screen -my-[140px]'>
      <Loader />
      <div className='text-black mt-[30px] text-3xl font-semibold'>{message ? message : `We are Fetching new Pins for you.`}</div>
    </div>
  )
}

export function LoadingLoader({message}) {
  return (
    <div className='flex flex-col justify-center items-center bg-white h-screen -my-[140px]'>
      <Loader />
      <div className='text-black mt-[30px] text-3xl font-semibold'>{message ? message : `Loading Latest Pins for you.`}</div>
    </div>
  )
}

export function ErrorLoader({error}) {
  return (
    <div className='flex flex-col justify-center items-center bg-white h-screen -my-[140px]'>
      <Loader />
      <div className='text-black mt-[30px] text-3xl font-semibold'>{error}</div>
    </div>
  )
}

