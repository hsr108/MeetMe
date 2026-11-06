export const MIN_BIRTH_YEAR = 1900;

// Returns { name?, yob? } error messages; an empty object means the input is valid.
export const validateGuestDetails = (name, yob, currentYear = new Date().getFullYear()) => {
  const errors = {};
  if (!name.trim()) {
    errors.name = "Name is required";
  }
  if (!yob.trim()) {
    errors.yob = "Year of birth is required";
  } else {
    const year = parseInt(yob, 10);
    if (isNaN(year) || year < MIN_BIRTH_YEAR || year > currentYear) {
      errors.yob = `Enter a valid year (${MIN_BIRTH_YEAR}–${currentYear})`;
    }
  }
  return errors;
};

export const digitsOnly = (value) => value.replace(/\D/g, "");
