import Hero from "./components/Home";
import { ToastContainer } from 'react-toastify';

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <ToastContainer />
    </main>
  );
}
