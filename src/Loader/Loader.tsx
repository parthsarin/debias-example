import { MoonLoader } from 'react-spinners';

const Loader = () => (
  <div className='fixed w-full h-full flex align-center'>
    <div className="flex w-full h-full justify-center">
      <div className="flex self-center">
        <MoonLoader color={'black'} size={70} />
      </div>
    </div>
  </div>
);

export default Loader;