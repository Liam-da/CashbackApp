import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

export default function NotFound() {
  return (
    <div className="page max-w-lg space-y-4 text-center">
      <h1 className="page-title">Page not found</h1>
      <p className="page-subtitle">
        The page you are looking for does not exist.
      </p>
      <Button asChild className="w-full sm:w-auto">
        <Link to="/">Back to home</Link>
      </Button>
    </div>
  );
}
