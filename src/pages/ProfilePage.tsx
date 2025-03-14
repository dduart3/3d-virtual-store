import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { PersonalInfo } from "../modules/profile/components/PersonalInfo";
import { OrderHistory } from "../modules/profile/components/OrderHistory";

enum ProfileTab {
  PERSONAL_INFO = "personal-info",
  ORDERS = "orders",
}

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>(
    ProfileTab.PERSONAL_INFO
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black to-gray-900 text-white px-6 py-12 md:px-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-light mb-2">Mi perfil</h1>
          <p className="text-gray-400">
            Administra tu información personal y revisa tus órdenes
          </p>
        </header>

        {/* Tabs Navigation */}
        <div className="border-b border-white/10 mb-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab(ProfileTab.PERSONAL_INFO)}
              className={`py-4 text-sm font-medium border-b-2 ${
                activeTab === ProfileTab.PERSONAL_INFO
                  ? "border-white text-white"
                  : "border-transparent text-gray-400 hover:text-white hover:border-gray-700"
              }`}
            >
              Información personal
            </button>
            <button
              onClick={() => setActiveTab(ProfileTab.ORDERS)}
              className={`py-4 text-sm font-medium border-b-2 ${
                activeTab === ProfileTab.ORDERS
                  ? "border-white text-white"
                  : "border-transparent text-gray-400 hover:text-white hover:border-gray-700"
              }`}
            >
              Órdenes
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === ProfileTab.PERSONAL_INFO && <PersonalInfo />}
          {activeTab === ProfileTab.ORDERS && <OrderHistory />}
        </div>

        {/* Back link */}
        <div className="mt-12 pt-6 border-t border-white/10 text-center">
          <Link to="/" className="text-gray-400 hover:text-white">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
