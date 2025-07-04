import React from "react";

const AccountSettings = () => {
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-[#1a237e] mb-4">
        Account Settings
      </h1>
      <div className="space-y-6">
        {/* Profile Info Section */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Profile Information</h2>
          <div className="flex flex-col gap-2">
            <input
              className="border rounded px-3 py-2"
              placeholder="Full Name"
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="Email Address"
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="Phone Number"
            />
          </div>
        </section>
        {/* Password Section */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Change Password</h2>
          <div className="flex flex-col gap-2">
            <input
              className="border rounded px-3 py-2"
              type="password"
              placeholder="Current Password"
            />
            <input
              className="border rounded px-3 py-2"
              type="password"
              placeholder="New Password"
            />
            <input
              className="border rounded px-3 py-2"
              type="password"
              placeholder="Confirm New Password"
            />
          </div>
        </section>
        <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default AccountSettings;
