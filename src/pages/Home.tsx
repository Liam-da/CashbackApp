import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Dashboard from "./Dashboard";

export default function Home() {
  const pointsBalance = useQuery(api.points.getCurrentUserPointsBalance);
  const points = pointsBalance?.currentPoints ?? 0;
  const navigate = useNavigate();
  function handleNavigate(screen: string) {
    switch (screen) {
      case 'points-overview':
        navigate('/points-overview');
        break;
      case 'rewards':
        navigate('/reward');
        break;
      case 'scan':
        navigate('/scan');
        break;
      default:
        break;
    }
  }
  return (
    <>
      <h1></h1>
      <Dashboard onNavigate={handleNavigate} points={points} />
    </>
  );
}
