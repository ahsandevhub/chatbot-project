import {
  Bell,
  Lock,
  Mail,
  Phone,
  RefreshCw,
  Settings,
  Shield,
  UserCircle,
} from "lucide-react";
import React, { useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    const sections = document.querySelectorAll(".fade-in-section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  return (
    <div className="h-screen flex flex-col font-inter bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="overflow-auto">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="text-center mb-16 fade-in-section">
            <Shield className="w-16 h-16 mx-auto mb-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-5xl font-bold gradient-text mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We value your trust and are committed to protecting your privacy.
              Learn how we handle your data with care.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="fade-in-section hover-card bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm">
              <UserCircle className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Information We Collect
              </h2>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="w-2 h-2 mt-2 rounded-full bg-indigo-600 dark:bg-indigo-400 mr-3" />
                  <span>
                    <strong>Personal Information:</strong> Name, email, and
                    account details
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 mt-2 rounded-full bg-indigo-600 dark:bg-indigo-400 mr-3" />
                  <span>
                    <strong>Usage Data:</strong> Interactions within the
                    application
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 mt-2 rounded-full bg-indigo-600 dark:bg-indigo-400 mr-3" />
                  <span>
                    <strong>Device Information:</strong> Browser, IP, and system
                    details
                  </span>
                </li>
              </ul>
            </div>

            <div className="fade-in-section hover-card bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm">
              <Bell className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                How We Use Your Information
              </h2>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="w-2 h-2 mt-2 rounded-full bg-indigo-600 dark:bg-indigo-400 mr-3" />
                  <span>To provide and enhance our application</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 mt-2 rounded-full bg-indigo-600 dark:bg-indigo-400 mr-3" />
                  <span>To communicate with users and send notifications</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 mt-2 rounded-full bg-indigo-600 dark:bg-indigo-400 mr-3" />
                  <span>To analyze trends and improve services</span>
                </li>
              </ul>
            </div>

            <div className="fade-in-section hover-card bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm">
              <Lock className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Data Security
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We implement industry-standard security measures to protect your
                data. This includes encryption, secure servers, and regular
                security audits to ensure your information remains safe.
              </p>
            </div>

            <div className="fade-in-section hover-card bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm">
              <Settings className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Your Rights
              </h2>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="w-2 h-2 mt-2 rounded-full bg-indigo-600 dark:bg-indigo-400 mr-3" />
                  <span>Access and update your personal information</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 mt-2 rounded-full bg-indigo-600 dark:bg-indigo-400 mr-3" />
                  <span>Request data deletion</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 mt-2 rounded-full bg-indigo-600 dark:bg-indigo-400 mr-3" />
                  <span>Opt-out of communications</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="fade-in-section hover-card bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm">
              <RefreshCw className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Changes to This Policy
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We may update this policy periodically to reflect changes in our
                practices or legal requirements. Any significant changes will be
                communicated to you directly.
              </p>
            </div>

            <div className="fade-in-section hover-card bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm">
              <Phone className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Contact Us
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Have questions about our privacy policy? We're here to help!
              </p>
              <a
                href="mailto:support@example.com"
                className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                <Mail className="w-5 h-5 mr-2" />
                support@example.com
              </a>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            Last updated: March 2024
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default PrivacyPolicy;
