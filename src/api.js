import axios from 'axios';

const BASE_URL = 'https://ipo-check-server.herokuapp.com';
const IPO_CHECK_API = 'https://ipo-check-server.herokuapp.com/check-ipo';
const COMPANY_LIST_API = 'https://ipo-check-server.herokuapp.com/company-list';

export const getCompanyList = async () => {
  try {
    const response = await axios.get(COMPANY_LIST_API);

    return response.data;
  } catch (err) {
    console.log(err);
  }
};

/**
 * 
 * @param {boid: String, companyShareId: number} payload
 */
export const checkIPO = async (payload) => {
  try {
    const response = await axios.post(IPO_CHECK_API, payload);
    
    return { ...response.data, boid: payload.boid };
  } catch (err) {
    console.log(err);

    return { boid: payload.boid, message: 'Failed to process, please retry.', success: false }
  }
};
