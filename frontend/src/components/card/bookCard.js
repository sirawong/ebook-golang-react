import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { addToCart } from '../../store/slices/cartSlice';

import ReactStars from 'react-rating-stars-component';

export default function Card({ props }) {
  const dispatch = useDispatch();

  return (
    <div className="pt-4 grid grid-cols-3">
      <div className="relative h-52">
        <Link to={`/book/${props.id}`}>
          <img className="rounded-lg h-full object-scale-down" src={props.imageslink} alt="" />
        </Link>
      </div>
      <div className="px-2 col-span-2 flex flex-col font-sans text-xl lg:text-base">
        <div className="font-bold">
          <span>{props.title}</span>
        </div>
        <div className="text-lg lg:text-xs text-gray-500">
          <span>{props.author}</span>
        </div>
        <div className="">
          <div className="pt-2 lg:pt-5 flex item-center">
            <ReactStars
              count={5}
              size={24}
              value={props.rating}
              isHalf={true}
              edit={false}
              emptyIcon={<i className="far fa-star"></i>}
              halfIcon={<i className="fa fa-star-half-alt"></i>}
              fullIcon={<i className="fa fa-star"></i>}
              activeColor="#ffd700"
            />
          </div>
          <div>
            <span className="lg:text-xs text-gray-500">{props.num_ratings} reviews</span>
          </div>
        </div>
        <div className="h-full flex flex-col justify-end">
          <h1 className="text-gray-700 font-bold text-xl lg:text-lg">${props.price}</h1>
          <button
            className="px-3 py-2 bg-gray-800 text-white text-lg lg:text-xs font-bold uppercase rounded"
            onClick={() =>
              dispatch(
                addToCart({
                  ...{
                    id: props.id,
                    title: props.title,
                    price: props.price,
                    imageslink: props.imageslink,
                  },
                  quantity: 1,
                })
              )
            }>
            Add to Card
          </button>
        </div>
      </div>
    </div>
  );
}
