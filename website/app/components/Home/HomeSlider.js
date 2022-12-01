import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// import Swiper core and required modules
import SwiperCore, {
  Navigation,
  Thumbs,
  Autoplay,
  EffectFade,
  Pagination,
  Parallax,
} from "swiper";
import { DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";

// install Swiper modules
SwiperCore.use([Navigation, Thumbs, Autoplay]);

import Link from "next/link";
import { IMG_URL } from "../../../../config";

const Default = ({ state = [] }) => {
  useEffect(() => {}, []);

  return (
    <div className=" relative float-left homeSliderReslative">
      <div className="position-absolute w-full  ">
        <div className="slider-arrow-left absolute z-40 left-2  top-1/2">
          <DoubleLeftOutlined />
        </div>
        <div className="slider-arrow-right absolute z-40 right-2  top-1/2">
          <DoubleRightOutlined />
        </div>

        <Swiper
          spaceBetween={0}
          navigation={{
            prevEl: ".slider-arrow-left",
            nextEl: ".slider-arrow-right",
          }}
          autoplay={{
            delay: 15000,
            disableOnInteraction: false,
          }}
          className="w-full h-screen"
        >
          {state.map((val) => (
            <SwiperSlide key={val._id}>
              <div className="item">
                <Link href={val.link}>
                  <a>
                    <img
                      src={`${IMG_URL + val.image}`}
                      height="500"
                      width="1680"
                      style={{ width: "100%" }}
                      alt={val.title + "."}
                      className="absolute -z-10 w-full h-full "
                    />
                  </a>
                </Link>
              </div>
              <div
                data-aos="fade-down"
                data-aos-easing="linear"
                data-aos-duration="1000"
                className=" flex flex-col items-start w-full h-full
                justify-center lg:ml-80 "
              >
                <div className="text-center hidden md:block">
                  <p
                    className="uppercase text-[10px] md:text-lg lg:text-base font-medium border-t-[1px] mx-48 border-black border-solid"
                    data-swiper-parallax-y="100"
                    data-swiper-parallax-duration="1000"
                  >
                    Summer Collection
                  </p>
                  <h1
                    className="text-[21px] md:text-[50px] lg:text-[83px] leading-[82px] font-semibold  lg:mt-10 lg:max-w-[580px] "
                    data-swiper-parallax-y="200"
                    data-swiper-parallax-duration="1000"
                  >
                    A Revolution In Retail
                  </h1>
                </div>
                <span
                  className="bg-[#292929] text-white text-[14px] font-medium leading-[60px] p-[0px 50px] text-center w-[175px] mt-14 ml-[70px] md:ml-[200px] hover:bg-[#62544B] duration-500 rounded-[50px]"
                  data-swiper-parallax-y="300"
                  data-swiper-parallax-duration="1000"
                >
                  Shop Now
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div style={{ clear: "both" }} />
    </div>
  );
};

export default Default;
