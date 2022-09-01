import { MoonLoader } from 'react-spinners';

const Loader = () => (
  <div className='absolute w-full h-full flex align-center bg-white bg-opacity-80 z-50'>
    <div className="flex w-full h-full justify-center">
      <div className="flex self-center">
        <MoonLoader color={'black'} size={70} />
      </div>
    </div>
  </div>
);

export default Loader;