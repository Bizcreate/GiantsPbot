import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaCoins, FaRocket } from "react-icons/fa";
import Sidebar from "../Components/sidebar";
import Header from "../Components/Header";
import InfoCard from "../Components/InfoCard";
import Announcement from "../Components/Announcement";
import Slider from "react-slick";
import { fetchAnnouncements } from "../utils/fetchAnnouncements";
import { fetchPartners } from "../utils/fetchPartners";
import PartnerCard from "../Components/PartnerCard";

const AlphaDogs = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState([]);
  const [partnersLoading, setPartnersLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncementsData = async () => {
      const { data, error } = await fetchAnnouncements();
      if (error) {
        console.error("Error fetching announcements:", error);
      } else {
        setAnnouncements(data);
      }
      setLoading(false);
    };

    fetchAnnouncementsData();
  }, []);

  useEffect(() => {
    const fetchPartnersData = async () => {
      const { data, error } = await fetchPartners();
      if (error) {
        console.error("Error fetching partners:", error);
      } else {
        setPartners(data);
      }
      setPartnersLoading(false);
    };

    fetchPartnersData();
  }, []);

  const infoCards = [
    {
      title: "AI Strategies",
      value: "24/7 Active",
      icon: FaRocket,
      description: "Continuous AI-powered investment optimization",
    },
    {
      title: "Yield Optimization",
      value: "Up to 250% APY",
      icon: FaCoins,
      description: "Maximized returns through smart rebalancing",
    },
    {
      title: "Total TVL",
      value: "$10.5M",
      icon: FaCoins,
      description: "Total Value Locked across protocols",
    },
    {
      title: "Supported Protocols",
      value: "15+",
      icon: FaRocket,
      description: "Integration with major DeFi platforms",
    },
    {
      title: "Active Users",
      value: "5,678",
      icon: FaUsers,
      description: "Growing community of DeFi farmers",
    },
  ];

  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const partnersSliderSettings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 2.5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    centerMode: true,
    centerPadding: "0px",
    arrows: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          centerMode: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "40px",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#121212] font-Syne">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/starbg2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <Sidebar />

      <main className="relative z-10 pt-32 px-8 pb-20 max-w-7xl mx-auto space-y-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="carousel-container py-8"
        >
          <h2 className="text-primary text-3xl font-semibold mb-8">Home</h2>
          <Slider {...sliderSettings}>
            {infoCards.map((card, index) => (
              <div key={index} className="px-4">
                <InfoCard {...card} />
              </div>
            ))}
          </Slider>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {" "}
          <Header />
          <h2 className="text-primary text-3xl font-semibold mb-8">
            Announcements
          </h2>
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : announcements.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {announcements.map((announcement) => (
                <Announcement
                  key={announcement.id}
                  title={announcement.title}
                  date={announcement.date}
                  content={announcement.description}
                  category={announcement.category}
                  priority={announcement.priority}
                  image={announcement.image}
                  projectLink={announcement.projectLink}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center">
              No announcements available
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <h2 className="text-primary text-3xl font-semibold mb-8">
            Our Partners
          </h2>

          {partnersLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : partners.length > 0 ? (
            <div className="carousel-container py-16 -mx-8">
              <Slider {...partnersSliderSettings}>
                {partners.map((partner) => (
                  <div key={partner.id} className="px-4">
                    <PartnerCard
                      companyImage={partner.companyImage}
                      name={partner.name}
                      description={partner.description}
                      projectLink={partner.projectLink}
                    />
                  </div>
                ))}
              </Slider>
            </div>
          ) : (
            <p className="text-gray-400 text-center">No partners available</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-12"
        >
          {/* <SocialLinks /> */}
        </motion.div>
      </main>
    </div>
  );
};

export default AlphaDogs;
