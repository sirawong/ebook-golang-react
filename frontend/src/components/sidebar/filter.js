import React from 'react';
import ReactStars from 'react-rating-stars-component';

export default function ResponsiveDrawer({ handle }) {
  const [rate, setRate] = React.useState();

  return (
    <div className="max-h-screen md:flex flex-col flex-auto flex-shrink-0 antialiased text-gray-800 hidden">
      <div className=" flex flex-col top-0 left-0 w-64 bg-white h-full border-r">
        <div className="overflow-y-auto overflow-x-hidden flex-grow">
          <ul className="flex flex-col py-4 space-y-1">
            <li className="px-5">
              <div className="flex flex-row items-center h-8">
                <div className="text-sm font-light tracking-wide text-gray-500">Price</div>
              </div>
            </li>
            <div className="px-5">
              <li>
                <span
                  className="hover:text-indigo-500 cursor-pointer"
                  onClick={() => handle({ gtPrice: 0, ltPrice: 5 })}>
                  Under $5
                </span>
              </li>
              <li>
                <span
                  className="hover:text-indigo-500 cursor-pointer"
                  onClick={() => handle({ gtPrice: 5, ltPrice: 10 })}>
                  $5 - $10
                </span>
              </li>
              <li>
                <span
                  className="hover:text-indigo-500 cursor-pointer"
                  onClick={() => handle({ gtPrice: 10, ltPrice: 20 })}>
                  $10 - $20
                </span>
              </li>
              <li>
                <span
                  className="hover:text-indigo-500 cursor-pointer"
                  onClick={() => handle({ gtPrice: 20, ltPrice: 50 })}>
                  $20 - $50
                </span>
              </li>
              <li>
                <span
                  className="hover:text-indigo-500 cursor-pointer"
                  onClick={() => handle({ gtPrice: 50, ltPrice: 999 })}>
                  $50 Above
                </span>
              </li>
            </div>
            <div className="px-5 text-gray-500"></div>

            <li className="px-5">
              <div className="flex flex-row items-center h-8">
                <div className="text-sm font-light tracking-wide text-gray-500">Rating</div>
              </div>
            </li>
            <li>
              <div className="ml-8 flex items-center space-x-2">
                <span>
                  <ReactStars
                    count={5}
                    size={24}
                    onChange={(newRating) => {
                      handle({ rating: newRating });
                      setRate(newRating);
                    }}
                    isHalf={true}
                    emptyIcon={<i className="far fa-star"></i>}
                    halfIcon={<i className="fa fa-star-half-alt"></i>}
                    fullIcon={<i className="fa fa-star"></i>}
                    activeColor="#ffd700"
                  />
                </span>
                <span className="text-gray-400">{rate}+</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
