import React, { useState, useEffect } from "react";
import { db } from "../firebase/firestore"; // adjust the path as needed
import { collection, getDocs, query } from "firebase/firestore";
import moment from "moment";
import { NavLink } from "react-router-dom";
import { PiArrowRight } from "react-icons/pi";
import { motion } from "framer-motion";
import Spinner from "./Spinner";

const linksTo = [
  // {
  //   link: "/dashboardAdx/stats",
  //   title: "Dashboard",
  // },
  {
    link: "/dashboardAdx/managetasks",
    title: "Tasks",
  },
  {
    link: "/dashboardAdx/promo",
    title: "Partners",
  },
  // {
  //   link: "/dashboardAdx/externaltasks",
  //   title: "Other Tasks",
  // },

  // {
  //   link: "/dashboardAdx/ranks",
  //   title: "Users Ranks",
  // },
  // {
  //   link: "/dashboardAdx/youtube",
  //   title: "Youtube Tasks",
  // },
  // {
  //   link: "/dashboardAdx/airdroplist",
  //   title: "Airdrop List",
  // },
  {
    link: "/dashboardAdx/search",
    title: "Users list",
  },
  {
    link: "/dashboardAdx/announcements",
    title: "Announcements",
  },
];

const StatisticsPanel = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalTapBalance, setTotalTapBalance] = useState(0);
  const [activeUsersLast24Hours, setActiveUsersLast24Hours] = useState(0);
  // eslint-disable-next-line
  const [activeUsersLast1Hour, setActiveUsersLast1Hour] = useState(0);
  const [activeUsersLast1Minute, setActiveUsersLast1Minute] = useState(0); // New state for last 1 minute
  const [loading, setLoading] = useState(true);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    // const now = moment();
    const last24Hours = moment().subtract(24, "hours").toDate();
    const last1Hour = moment().subtract(1, "hour").toDate();
    const last1Minute = moment().subtract(1, "minute").toDate(); // New time range for last 1 minute

    console.log("Last 24 Hours:", last24Hours);
    console.log("Last 1 Hour:", last1Hour);

    const usersQuery = query(collection(db, "users"));
    const querySnapshot = await getDocs(usersQuery);
    const usersData = querySnapshot.docs.map((doc) => doc.data());

    // Total number of users
    const totalUsersCount = usersData.length;
    setTotalUsers(totalUsersCount);
    setLoading(false);

    // Total balance and total tap balance
    const totalBalanceSum = usersData.reduce(
      (acc, user) => acc + (user.balance || 0),
      0
    );
    const totalTapBalanceSum = usersData.reduce(
      (acc, user) => acc + (user.miningTotal || 0),
      0
    );

    setTotalBalance(totalBalanceSum);
    setTotalTapBalance(totalTapBalanceSum);

    // Active users in the last 24 hours and last 1 hour
    const activeUsers24Hours = usersData.filter(
      (user) => user.lastLoginAt && user.lastLoginAt.toDate() > last24Hours
    ).length;
    const activeUsers1Hour = usersData.filter(
      (user) => user.lastLoginAt && user.lastLoginAt.toDate() > last1Hour
    ).length;
    const activeUsers1Minute = usersData.filter(
      (user) => user.lastLoginAt && user.lastLoginAt.toDate() > last1Minute
    ).length; // New filter for last 1 minute

    setActiveUsersLast24Hours(activeUsers24Hours);
    setActiveUsersLast1Hour(activeUsers1Hour);
    setActiveUsersLast1Minute(activeUsers1Minute); // Set state for last 1 minute
  };

  const formatNumber = (num) => {
    if (typeof num !== "number") {
      return "Invalid number";
    }

    // If the number is less than 1 and has more than 3 decimal places
    if (num < 1 && num.toString().split(".")[1]?.length > 3) {
      return num.toFixed(6).replace(/0+$/, ""); // Trims trailing zeroes
    }

    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const statista = [
    {
      title: "Total Users",
      count: totalUsers,
    },
    {
      title: "Total Balance",
      count: formatNumber(totalBalance),
    },
    {
      title: "Last 24hours",
      count: activeUsersLast24Hours,
    },
    {
      title: "Online Users",
      count: activeUsersLast1Minute,
    },
  ];

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="w-full min-h-screen bg-gradient-to-b from-cards to-cards2 px-4 sm:px-6 md:px-8 py-6 space-y-6"
        >
          {/* Stats Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6"
          >
            {statista.map((stats, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`bg-gradient-to-br from-cards3 to-cards2 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-borders2/10
                  ${
                    index === statista.length - 1
                      ? "xs:col-span-2 sm:col-span-1"
                      : ""
                  }
                  hover:border-accent/20 transition-all duration-300`}
              >
                <h2 className="text-secondary text-sm font-medium mb-2">
                  {stats.title}
                </h2>
                <span className="text-2xl md:text-3xl text-primary font-bold tracking-tight">
                  {stats.count}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Admin Controls Section */}
          <div className="mt-10">
            <h2 className="font-semibold text-xl text-primary mb-6">
              Admin Control Items
            </h2>

            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            >
              {linksTo.map((menu, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <NavLink
                    to={menu.link}
                    className={({ isActive }) => `
                      bg-cards3 hover:bg-cards2 p-4 rounded-lg flex justify-between items-center
                      border border-borders2/10 hover:border-accent/20
                      transition-all duration-300 ${
                        isActive ? "border-accent" : ""
                      }
                    `}
                  >
                    <span className="text-primary font-medium">
                      {menu.title}
                    </span>
                    <motion.span
                      whileHover={{ x: 5 }}
                      className="text-secondary"
                    >
                      <PiArrowRight size={20} />
                    </motion.span>
                  </NavLink>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default StatisticsPanel;
