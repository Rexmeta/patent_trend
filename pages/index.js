import { useState } from 'react';
import axios from 'axios';
import TrendChart from '../components/TrendChart';

export default function Home() {
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState([]);
  const [years, setYears] = useState({ start: 2010, end: 2024 });

  const fetchTrends = async () => {
    const res = await axios.get('/api/trends', { params: { keyword, startYear: years.start, endYear: years.end } });
    setData(res.data.map(r => ({ year: r.year, count: r.count })));
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">특허 트렌드 분석</h1>
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-grow"
          placeholder="키워드 입력"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 rounded"
          onClick={fetchTrends}
        >조회</button>
      </div>
      {data.length > 0 && <TrendChart data={data} metric="count" />}
    </div>
  );
} 