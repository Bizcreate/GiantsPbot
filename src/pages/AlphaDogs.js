import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaCoins, FaRocket } from "react-icons/fa";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import InfoCard from "../Components/InfoCard";
import TaskList from "../Components/TaskList";
import SocialLinks from "../Components/SocialLinks";
import Header from "../Components/Header";
import Announcement from "../Components/Announcement";
import Slider from "react-slick";
import { fetchAnnouncements } from "../utils/fetchAnnouncements";

const AlphaDogs = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const tasks = [
    {
      title: "Complete KYC",
      description: "Verify your identity to participate in exclusive events",
    },
    {
      title: "Join Discord",
      description: "Join our community on Discord for latest updates",
    },
    {
      title: "Follow Twitter",
      description: "Follow and engage with our Twitter account",
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

      <Header />

      <main className="relative z-10 pt-32 px-8 pb-20 max-w-7xl mx-auto space-y-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="carousel-container py-8"
        >
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
          className="py-8"
        >
          <TaskList tasks={tasks} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-12"
        >
          <SocialLinks />
        </motion.div>
      </main>
    </div>
  );
};

export default AlphaDogs;
