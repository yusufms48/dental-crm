export const calcAge = (birthDate) => {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export const ageLabel = (age) => {
  if (age === null) return "";
  const lastTwo = age % 100;
  const lastOne = age % 10;
  if (lastTwo >= 11 && lastTwo <= 19) return `${age} лет`;
  if (lastOne === 1) return `${age} год`;
  if (lastOne >= 2 && lastOne <= 4) return `${age} года`;
  return `${age} лет`;
};
