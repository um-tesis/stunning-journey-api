/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import querystring from 'querystring';
import config from '../../api/config';

const { BADGR_USERNAME, BADGR_PASSWORD, BADGR_ISSUER_ID, BADGR_API_URL } = config;

@Injectable()
export class BadgrService {
  public async awardNewBadge(email: string, newBadge: string) {
    const accessToken = await this.getBadgrAuthToken();
    await axios.post(
      `${BADGR_API_URL}/badgeclasses/${newBadge}/assertions`,
      {
        issuer: BADGR_ISSUER_ID,
        recipient: {
          identity: email,
          type: 'email',
          hashed: false,
          salt: null,
          plainTextIdentity: email,
        },
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
  }

  public async getUserBadges(email: string) {
    const accessToken = await this.getBadgrAuthToken();
    const res: any = await axios.get(`${BADGR_API_URL}/issuers/${BADGR_ISSUER_ID}/assertions`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const awards = res.data.result;
    const userAwards = awards && awards.length > 0 ? awards.filter((award) => award.recipient.identity === email) : [];

    return userAwards;
  }

  private async getBadgrAuthToken() {
    const endpoint = 'https://api.badgr.io/o/token';

    const data = querystring.stringify({
      username: BADGR_USERNAME,
      password: BADGR_PASSWORD,
    });

    const response = await axios.post(endpoint, data, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    return response.data.access_token;
  }
}
