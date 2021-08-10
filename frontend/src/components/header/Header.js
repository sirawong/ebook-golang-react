import headerImg from '../../images/6151-ai.svg';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
        <svg
          className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
          fill="currentColor"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true">
          <polygon points="50,0 100,0 50,100 0,100" />
        </svg>

        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
          <div className="sm:text-center lg:text-left">
            <h1 className="flex justify-center text-3xl tracking-tight font-extrabold text-indigo-600 sm:text-3xl md:text-6xl lg:justify-start">
              <span className="block xl:inline">Online Library</span>{' '}
            </h1>
            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
              Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat
              commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua.
            </p>
            <div className="mt-5 mx-16 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
              <div className="rounded-md shadow">
                <Link
                  to="/shop"
                  className="flex items-center justify-center px-8 py-3 border border-transparent text-base h-10 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                  Find your book
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-contain sm:h-72 md:h-96 lg:w-full lg:h-full"
          src={headerImg}
          alt=""
        />
      </div>
    </div>
  );
}
