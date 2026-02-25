import Navbar from "../components/Navbar";

export default function AdminProfile() {
  return (
    <div className="p-8">
            <Navbar />
      
      <h2 className="text-2xl font-bold mb-4">Profile Settings ⚙</h2>
      <p className="text-gray-600">
        Update your information and manage account settings.
      </p>
    </div>
  );
}
