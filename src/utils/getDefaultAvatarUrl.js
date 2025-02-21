// Add this function to generate placeholder avatar URLs
const getAvatarUrl = (username, size = 100) => {
  if (!username)
    return `https://ui-avatars.com/api/?background=fe2e00&color=fff&size=${size}&name=User`;

  return (
    username?.avatarUrl ||
    `https://ui-avatars.com/api/?background=fe2e00&color=fff&size=${size}&name=${encodeURIComponent(
      username
    )}`
  );
};
export default getAvatarUrl;
