import { useEffect, useState } from "react";
import api from "../api/api";

const Home = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    api.get("/packages").then((res) => setPackages(res.data.packages));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-bold">Home page (coming in Step 7)</h1>
      <p className="mt-4 text-slate-600">
        Packages loaded from the API: <b>{packages.length}</b>
      </p>
      <ul className="mt-4 list-disc pl-6">
        {packages.map((p) => (
          <li key={p.id}>
            {p.name} {p.speed}Mbps: ₦{p.finalPrice.toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;