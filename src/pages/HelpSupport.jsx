import React from "react";

const HelpSupport = () => {
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-[#1a237e] mb-4">Help & Support</h1>
      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-semibold mb-2">
            Frequently Asked Questions
          </h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>How do I reset my password?</li>
            <li>How do I update my profile information?</li>
            <li>Who do I contact for technical support?</li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-semibold mb-2">Contact Support</h2>
          <form className="flex flex-col gap-2">
            <input
              className="border rounded px-3 py-2"
              placeholder="Your Email"
            />
            <textarea
              className="border rounded px-3 py-2"
              placeholder="Describe your issue..."
              rows={4}
            />
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
              Submit
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default HelpSupport;
