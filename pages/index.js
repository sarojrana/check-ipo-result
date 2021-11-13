import axios from 'axios';
import Head from 'next/head';
import { useState, useEffect } from 'react';

import { getCompanyList, checkIPO } from '../src/api';
import ResultTable from '../src/components/ResultTable';
import SelectCompany from '../src/components/SelectCompany';

export default function Home() {

  const [BOIDs, setBOIDs] = useState('');
  const [companyId, setCompanyId] = useState(0);
  const [companyList, setCompanyList] = useState([]);
  const [ipoResult, setIPOresult] = useState([]);

  const fetchCompanyList = async () => {
    const companies = await getCompanyList();
    const sortedList = companies.sort((a, b) => {
      return b.id - a.id
    });

    setCompanyList(sortedList);
  }

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name == 'company') {
      setCompanyId(value);
    }

    if (name == 'boid') {
      setBOIDs(value);
    }
  }

  const checkIPODummy = (payload) => Promise.resolve({ boid: payload.boid, message: 'Awesome', success: true });

  const handleSubmit = async (event) => {

    // checkIPO({ companyShareId: 20, boid: '1301090000365301' });
    const boids = BOIDs.split(',');
    const promises = [];
    boids.forEach(boid => {
      const promise = checkIPODummy({ companyId, boid }); 
      promises.push(promise);
    });

    const results = await Promise.all(promises);

    setIPOresult(results);

    event.preventDefault();
  }

  useEffect(() => {
    fetchCompanyList();
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Check IPO Result</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <SelectCompany /> */}
      <form onSubmit={handleSubmit}>
        <div className="">
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">
            Companies
          </label>
          <select
            id="company"
            name="company"
            autoComplete="name"
            value={companyId}
            onChange={handleInputChange}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {companyList.map(company => <option key={company.id} value={company.id}> {company.name} </option>)}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="boid" className="block text-sm font-medium text-gray-700">
            BOID(s)
          </label>
          <div className="mt-1">
            <textarea
              id="boid"
              name="boid"
              rows={5}
              onChange={handleInputChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
              placeholder="13XXXXXXXXXXXXXX,13XXXXXXXXXXXXXX"
              defaultValue={BOIDs}
            />
          </div>

          <button type="submit" className="mt-2 px-5 py-3 rounded-md text-white bg-indigo-600" onClick={async () => {
            // checkIPO({ companyShareId: 20, boid: '1301090000365301' });
          }} > Check Result </button>
        </div>
      </form>

      <ResultTable ipoResult={ipoResult} />
    </div>
  )
}
