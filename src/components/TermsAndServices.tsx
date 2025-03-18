import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Mail,
  Phone,
  Shield,
  Users,
} from "lucide-react";
import React, { useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";

const TermsAndServices: React.FC = () => {
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
            <FileText className="w-16 h-16 mx-auto mb-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-5xl font-bold gradient-text mb-6">
              Terms and Services
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Please read our terms and conditions carefully before using our
              services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="fade-in-section hover-card bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm">
              <CheckCircle className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Acceptance of Terms
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                By accessing or using our services, you agree to be bound by
                these terms. If you do not agree, please do not use our
                services.
              </p>
            </div>

            <div className="fade-in-section hover-card bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm">
              <Users className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                User Responsibilities
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Users must comply with all applicable laws and regulations. Any
                misuse of our services may result in termination of access.
              </p>
            </div>

            <div className="fade-in-section hover-card bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm">
              <Shield className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Privacy Policy
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Our privacy policy outlines how we handle your data. By using
                our services, you agree to our data practices.
              </p>
            </div>

            <div className="fade-in-section hover-card bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm">
              <AlertTriangle className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Prohibited Activities
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Users must not engage in any activity that violates the law,
                infringes on rights, or disrupts the service.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="fade-in-section hover-card bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm">
              <Clock className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Changes to Terms
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We may update these terms from time to time. Continued use of
                our services implies agreement to the updated terms.
              </p>
            </div>

            <div className="fade-in-section hover-card bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm">
              <Phone className="w-10 h-10 text-indigo-600 dark:text-indigo-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Contact Us
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Have questions about our terms? Contact us for more details.
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

export default TermsAndServices;
