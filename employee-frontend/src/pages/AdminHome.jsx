import Navbar from "../components/Navbar";

export default function AdminHome() {
  return (
    <div className="p-8">
            <Navbar />
      
      <h2 className="text-2xl font-bold mb-4">Welcome Admin 👋</h2>
      <p className="text-gray-600">
        Monitor employee productivity and incidents in real-time.
      </p>
    </div>
  );
}