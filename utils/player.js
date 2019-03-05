/** Calculate Value Function
 * Returns the value of the player based on age and rating.
 *@return {Number} The value of the player (in Villa :))
 */

function calculateValue(age, rating) {
  let value;

  if (age >= 18 && age < 20) {
    if (rating >= 60 && rating < 70) {
      value = 2000000;
    } else if (rating >= 70 && rating < 75) {
      value = 4000000;
    } else if (rating >= 75 && rating < 80) {
      value = 12000000;
    } else if (rating >= 80 && rating < 85) {
      value = 40000000;
    } else if (rating >= 85 && rating < 90) {
      value = 100000000;
    } else if (rating >= 90 && rating < 95) {
      value = 160000000;
    } else if (rating >= 95 && rating < 100) {
      value = 200000000;
    } else {
      value = 0;
    }
  } else if (age >= 20 && age < 24) {
    if (rating >= 60 && rating < 70) {
      value = 4000000;
    } else if (rating >= 70 && rating < 75) {
      value = 6000000;
    } else if (rating >= 75 && rating < 80) {
      value = 15000000;
    } else if (rating >= 80 && rating < 85) {
      value = 44000000;
    } else if (rating >= 85 && rating < 90) {
      value = value = 90000000;
    } else if (rating >= 90 && rating < 95) {
      value = 180000000;
    } else if (rating >= 95 && rating < 100) {
      value = 240000000;
    } else {
      value = 0;
    }
  } else if (age >= 24 && age < 26) {
    if (rating >= 60 && rating < 70) {
      value = 3000000;
    } else if (rating >= 70 && rating < 75) {
      value = 18000000;
    } else if (rating >= 75 && rating < 80) {
      value = 30000000;
    } else if (rating >= 80 && rating < 85) {
      value = 48000000;
    } else if (rating >= 85 && rating < 90) {
      value = 120000000;
    } else if (rating >= 90 && rating < 95) {
      value = 200000000;
    } else if (rating >= 95 && rating < 100) {
      value = 250000000;
    } else {
      value = 0;
    }
  } else if (age >= 26 && age < 30) {
    if (rating >= 60 && rating < 70) {
      value = 2500000;
    } else if (rating >= 70 && rating < 75) {
      value = 15000000;
    } else if (rating >= 75 && rating < 80) {
      value = 34000000;
    } else if (rating >= 80 && rating < 85) {
      value = 8000000;
    } else if (rating >= 85 && rating < 90) {
      value = 120000000;
    } else if (rating >= 90 && rating < 95) {
      value = 140000000;
    } else if (rating >= 95 && rating < 100) {
      value = 240000000;
    } else {
      value = 0;
    }
  } else if (age >= 30 && age < 36) {
    if (rating >= 60 && rating < 70) {
      value = 2000000;
    } else if (rating >= 70 && rating < 75) {
      value = 12000000;
    } else if (rating >= 75 && rating < 80) {
      value = 28000000;
    } else if (rating >= 80 && rating < 85) {
      value = 46000000;
    } else if (rating >= 85 && rating < 90) {
      value = 90000000;
    } else if (rating >= 90 && rating < 95) {
      value = 130000000;
    } else if (rating >= 95 && rating < 100) {
      value = 220000000;
    } else {
      value = 0;
    }
  } else {
    value = 0;
  }
  return value;
}

/** Calculate Rating Function
 * Returns the rating of the player
 * @returns {Number} Rating of the player
 */

function calculateRating(position, attacking_class, defensive_class, gk_class) {
  let rating;
  if (position == "ATT") {
    rating = Math.round(
      (attacking_class / 99) * 80 + (((defensive_class / 99) * 20) / 100) * 99
    );
  } else if (position == "DEF") {
    rating = Math.round(
      (defensive_class / 99) * 80 + (((attacking_class / 99) * 20) / 100) * 99
    );
  } else if (position == "MID") {
    rating = Math.round(
      (defensive_class / 99) * 50 + (((attacking_class / 99) * 50) / 100) * 99
    );
  } else if (position == "GK") {
    rating = Math.round(
      (gk_class / 99) * 90 +
        (defensive_class / 99) * 5 +
        (((attacking_class / 99) * 5) / 100) * 99
    );
  }
  return rating;
}

module.exports = {
  calculateValue,
  calculateRating
};
