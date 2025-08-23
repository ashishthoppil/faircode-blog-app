import Hero from "./components/Home";
import { ToastContainer } from 'react-toastify';

export default function Home() {
  return (
    <main className="h-screen">
      <Hero />
      <ToastContainer />
    </main>
  );
}
