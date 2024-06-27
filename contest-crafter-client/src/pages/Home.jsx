import Banner from "../components/Banner";
import ContestCreator from "../components/ContestCreator";
import ContestWinner from "../components/ContestWinner";
import PopularContest from "../components/PopularContest";

const Home = () => {
  return (
    <section className="w-full h-full">
      <Banner />
      <PopularContest />
      <ContestWinner />
      <ContestCreator />
    </section>
  );
};

export default Home;
