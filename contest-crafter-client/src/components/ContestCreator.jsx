import useContests from "../hook/getContests";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "./style.css";

const SingleCreator = ({ contest }) => {
  return (
    <div className="card card-side bg-base-200 shadow-xl rounded flex-col">
      <figure className="">
        <img
          src={contest.creator.imageUrl}
          alt={contest.creator.name}
          className="rounded-xl h-52 w-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{contest.creator.name}</h2>
        <h3>{contest.contestName}</h3>
        <p className="max-w-xs">{contest.description.slice(0, 30)}...</p>
        {/* <div className="card-actions justify-end">
          <button className="btn btn-primary">Watch</button>
        </div> */}
      </div>
    </div>
  );
};

const ContestCreator = () => {
  const bestContest = useContests(
    "contestCreator",
    "limit=3&sort=participationCount&sortOrder=desc"
  );
  if (bestContest.isLoading)
    return <span className="loading loading-dots loading-lg"></span>;
  return (
    <section className="my-10">
      <h1 className="text-xl md:text-4xl text-center font-bold mt-20">
        Best contest creator
      </h1>

      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="mySwiper"
      >
        {bestContest.data.map((contest) => (
          <SwiperSlide key={contest._id}>
            <SingleCreator contest={contest} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default ContestCreator;
