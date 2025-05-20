import { BigQuery } from '@google-cloud/bigquery';

const bigquery = new BigQuery({ projectId: process.env.BIGQUERY_PROJECT_ID });

export default async function handler(req, res) {
  const { startYear = 2010, endYear = 2024, keyword = '' } = req.query;

  const query = `
    SELECT EXTRACT(YEAR FROM patent_date) AS year, COUNT(*) AS count
    FROM \`patents-public-data.patents.publications\`
    WHERE patent_abstract LIKE @keyword
      AND EXTRACT(YEAR FROM patent_date) BETWEEN @startYear AND @endYear
    GROUP BY year
    ORDER BY year;
  `;

  const options = {
    query,
    params: { keyword: `%${keyword}%`, startYear: Number(startYear), endYear: Number(endYear) },
    location: 'US',
  };

  try {
    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
} 