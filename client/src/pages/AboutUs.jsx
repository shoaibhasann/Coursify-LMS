import aboutMainImage from "../assets/aboutMainImage.png";

import HomeLayout from "../layouts/HomeLayout.jsx";
import CarouselSlide from "../components/CarouselSlide.jsx";
import { celebrities } from "../constants/CelebrityData.js";


function AboutUs() {
  return (
    <HomeLayout>
      <div className="sm:pl-20 pt-20 flex flex-col text-white">
        <div className="flex flex-col-reverse sm:flex-row items-center gap-5 mx-6 sm:mx-10">
          <section className="sm:w-1/2 space-y-10">
            <h1 className=" text-3xl sm:text-5xl text-green-500 font-semibold">
              Affordable and quality education
            </h1>
            <p className=" text-lg sm:text-xl text-gray-200">
              Our goal is to provide the afoordable and quality education to the
              world. We are providing the platform for the aspiring teachers and
              students to share their skills, creativity and knowledge to each
              other to empower and contribute in the growth and wellness of
              mankind.
            </p>
          </section>

          <div className="sm:w-1/2">
            <img
              id="test1"
              style={{
                filter: "drop-shadow(0px 10px 10px rgb(0,0,0));",
              }}
              alt="about main image"
              className="drop-shadow-2xl"
              src={aboutMainImage}
            />
          </div>
        </div>

        <div className="carousel w-full sm:w-1/2 m-auto my-16">
          {celebrities &&
            celebrities.map((celebrity) => (
              <CarouselSlide
                {...celebrity}
                key={celebrity.slideNumber}
                totalSlides={celebrities.length}
              />
            ))}
        </div>
      </div>
    </HomeLayout>
  );
}

export default AboutUs;
