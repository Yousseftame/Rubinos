import QRCodeGenerator from "../../../components/QRCodeGenerator/QRCodeGenerator";

export default function AdminPanel() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Welcome & Overview Header */}
      <div className="mb-8">
        <h1 
          className="text-2xl sm:text-3xl lg:text-4xl font-serif mb-2" 
          style={{ color: '#0E302A', fontFamily: 'Cinzel, serif' }}
        >
          Admin Control Center
        </h1>
        <p className="text-sm text-[#0E302A]/80 font-body">
          Manage system configurations, analytics, and marketing assets.
        </p>
      </div>

      {/* Main Feature Section */}
      <div className="max-w-6xl mx-auto">
        <QRCodeGenerator />
      </div>
    </div>
  );
}
