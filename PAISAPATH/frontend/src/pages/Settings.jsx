import React from "react";
import SettingsPanel from "../components/SettingsPanel";

export default function Settings() {
  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#F0F7EC" }}>
      <h1 className="text-3xl font-bold text-[#14532D] mb-6">Settings</h1>

      {/* Settings Container */}
      <div className="bg-[#F5F9E6] p-6 rounded-2xl shadow-lg border border-[#A3D9A5] max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-[#14532D] mb-4">Account & Preferences</h2>

        <SettingsPanel />

        {/* Example Section Styling (if your SettingsPanel has sections) */}
        {/* <div className="mt-6 space-y-4">
          <div className="p-4 bg-white rounded-xl shadow hover:shadow-md transition">
            <h3 className="font-medium text-[#14532D] mb-2">Profile</h3>
            <p className="text-gray-600">Update your personal information and email settings.</p>
          </div>

          <div className="p-4 bg-white rounded-xl shadow hover:shadow-md transition">
            <h3 className="font-medium text-[#14532D] mb-2">Notifications</h3>
            <p className="text-gray-600">Manage push notifications and reminders from the app.</p>
          </div>
        </div> */}
      </div>
    </div>
  );
}
