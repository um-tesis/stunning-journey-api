/* eslint-disable @typescript-eslint/indent */
import config from '../api/config';

const { BADGR_BASIC_BADGE_ID, BADGR_BRONZE_BADGE_ID, BADGR_SILVER_BADGE_ID, BADGR_GOLD_BADGE_ID } = config;

export const getCorrespondingBadge = (totalHours: number, previousTotalHours: number): string => {
  switch (true) {
    case totalHours > 100 && previousTotalHours <= 100:
      return BADGR_GOLD_BADGE_ID;
    case totalHours > 50 && previousTotalHours <= 50:
      return BADGR_SILVER_BADGE_ID;
    case totalHours > 25 && previousTotalHours <= 25:
      return BADGR_BRONZE_BADGE_ID;
    case totalHours > 10 && previousTotalHours <= 10:
      return BADGR_BASIC_BADGE_ID;
    default:
      return '';
  }
};
