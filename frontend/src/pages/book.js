import { UseBook } from '../hook/useProducts';
import { useParams } from 'react-router-dom';
import ReactStars from 'react-rating-stars-component';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';

export default function Book() {
  const dispatch = useDispatch();
  let { id } = useParams();
  const { book } = UseBook(id);
  return (
    <section className="text-gray-700 body-font overflow-hidden bg-white">
      {book && (
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <img
              alt="ecommerce"
              className="lg:w-1/2 w-full object-contain object-center rounded border border-gray-200"
              src={book.imageslink}
            />
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">{book.title}</h1>
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                Author : {book.author}
              </h2>
              <span className="flex items-center">
                <div className="flex my-4">
                  {book.genres && (
                    <ReactStars
                      count={5}
                      size={24}
                      value={book.rating}
                      isHalf={true}
                      edit={false}
                      emptyIcon={<i className="far fa-star"></i>}
                      halfIcon={<i className="fa fa-star-half-alt"></i>}
                      fullIcon={<i className="fa fa-star"></i>}
                      activeColor="#ffd700"
                    />
                  )}
                </div>
                <span className="text-gray-600 ml-3">{book.num_ratings} Reviews</span>
              </span>
              <div className="flex flex-wrap">
                {book.genres &&
                  book.genres.map((tag) => (
                    <span className="border border-gray-500 mt-1 rounded-full px-2 mr-2">
                      {tag}
                    </span>
                  ))}
              </div>
              <p className="pt-5 leading-relaxed">{book.description}</p>
              <div className="mt-2 pb-5 border-b-2 border-gray-200 mb-5" />
              <div className="leading-relaxed">
                <h1 className="font-bold text-xl font-mono">Characters : </h1>
                <div className="flex flex-wrap">
                  {book.length !== 0 &&
                    book.characters &&
                    book.characters.map((char) => (
                      <span className="border border-gray-500 mt-1 rounded-full px-2 mr-2">
                        {char}
                      </span>
                    ))}
                </div>
              </div>
              <div className="mt-2 pb-5 border-b-2 border-gray-200 mb-5" />
              <div className="flex">
                <span className="title-font font-medium text-2xl text-gray-900">${book.price}</span>
                <button
                  onClick={() =>
                    dispatch(
                      addToCart({
                        ...{
                          id: book.id,
                          title: book.title,
                          price: book.price,
                          imageslink: book.imageslink,
                        },
                        quantity: 1,
                      })
                    )
                  }
                  className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
