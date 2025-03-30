import { cn } from "@/lib/utils";
import { ArrowLeftIcon, FileText } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const TermsOfService: React.FC = () => {
  const navigate = useNavigate();

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
    <div className="h-screen overflow-auto flex flex-col font-inter bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <main className="px-4 py-6 max-w-5xl mx-auto flex-grow fade-in-section">
        <button
          onClick={() => navigate("/")}
          className="flex w-max text-sm mr-auto items-center gap-2 hover:gap-1 transition-all text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 mb-6"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Go Back</span>
        </button>

        <div className="text-center mb-10">
          <FileText className="w-16 h-16 mx-auto mb-6 text-gray-600 dark:text-gray-400" />
          <h1
            className={cn(
              "text-5xl font-bold",
              "bg-clip-text text-transparent",
              "bg-gray-800",
              "mb-6"
            )}
          >
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Please read these terms carefully before using Stonk-hub.
          </p>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Effective Date: March 20<sup>th</sup> 2025
          </p>
        </div>

        <div className="text-gray-700 text-justify dark:text-gray-300 space-y-6">
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            Welcome to Stonk-Hub. These Terms of Service ("Terms") govern your
            use of our services, including but not limited to our chatbot
            providing access to historical financial and market data and
            downloadable reports (collectively, the "Services").
          </p>
          <p>
            By accessing or using our Services, you agree to be bound by these
            Terms. If you do not agree, do not use the Services.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Eligibility</h2>
          <p>
            You must be at least 18 years old to use our Services. By agreeing
            to these Terms, you represent and warrant that you meet this age
            requirement.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            3. Description of Services
          </h2>
          <p>
            Stonk-Hub provides users with access to historical financial and
            market data via a conversational chatbot interface. Users may
            request data and receive a download link for reports and datasets.
          </p>
          <p>
            The Services are provided solely for educational, informational, and
            internal business purposes.
          </p>
          <p>
            Commercial use, redistribution, resale, automated scraping, or
            republication of any data obtained through Stonk-Hub is strictly
            prohibited.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            4. Subscription and Payment
          </h2>
          <h3 className="text-xl font-semibold mt-4 mb-2">4.1. Subscription</h3>
          <p>
            Access to the Services is provided on a subscription basis. Details
            of subscription plans, including pricing and features, are made
            available on our website and may be subject to change at our
            discretion.
          </p>

          <h3 className="text-xl font-semibold mt-4 mb-2">4.2. Billing</h3>
          <p>
            Payments are processed via Stripe. Stonk-Hub reserves the right to
            modify billing procedures in compliance with German and EU tax
            regulations.
          </p>

          <h3 className="text-xl font-semibold mt-4 mb-2">4.3. No Refunds</h3>
          <p>
            All payments made are non-refundable, including cases of early
            termination or cancellation of subscriptions by the user.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            5. User Accounts and Security
          </h2>
          <p>
            You may be required to create an account to access the Services. You
            agree to provide accurate, current, and complete information during
            registration and to update such information as necessary.
          </p>
          <p>
            You are responsible for safeguarding your login credentials. You
            agree not to disclose your password to any third party and to notify
            Stonk-Hub immediately of any unauthorized use of your account.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            6. Acceptable Use Policy
          </h2>
          <p>
            You agree to use the Services only for lawful purposes and in
            accordance with these Terms. You specifically agree not to:
          </p>
          <ul className="list-disc list-inside ml-6 space-y-2">
            <li>
              Resell, redistribute, sublicense, or make the data or Services
              available to third parties.
            </li>
            <li>
              Use the Services in any manner that violates applicable laws or
              regulations.
            </li>
            <li>
              Engage in data mining, scraping, or similar data gathering or
              extraction methods.
            </li>
            <li>
              Reverse engineer, decompile, or disassemble any part of the
              Services.
            </li>
          </ul>
          <p>
            Stonk-Hub reserves the right to terminate or suspend your access
            immediately if you violate this Acceptable Use Policy.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            7. Intellectual Property
          </h2>
          <h3 className="text-xl font-semibold mt-4 mb-2">7.1. Ownership</h3>
          <p>
            All content, data, software, and other materials available through
            the Services are the property of Stonk-Hub or its third-party
            licensors and are protected by applicable intellectual property
            laws.
          </p>

          <h3 className="text-xl font-semibold mt-4 mb-2">7.2. License</h3>
          <p>
            Stonk-Hub grants you a limited, non-exclusive, non-transferable,
            revocable license to access and use the Services for your personal,
            non-commercial purposes, in accordance with these Terms.
          </p>
          <p>
            You acquire no ownership rights by using the Services or downloading
            content.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Disclaimers</h2>
          <h3 className="text-xl font-semibold mt-4 mb-2">
            8.1. No Financial Advice
          </h3>
          <p>
            The information and data provided by Stonk-Hub are for educational
            and informational purposes only and should not be construed as
            financial, investment, or other professional advice.
          </p>
          <p>
            Disclaimer (as shown on the Service interface): "Mistakes can happen
            and all provided information is for educational purposes only."
          </p>

          <h3 className="text-xl font-semibold mt-4 mb-2">
            8.2. Accuracy of Information
          </h3>
          <p>
            While Stonk-Hub strives to provide accurate and up-to-date data, we
            make no representations or warranties of any kind regarding the
            accuracy, completeness, timeliness, or reliability of the data
            provided.
          </p>
          <p>
            You acknowledge that use of any data or information obtained from
            the Service is at your own risk.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            9. Limitation of Liability
          </h2>
          <p>
            To the fullest extent permitted by law, Stonk-Hub, its affiliates,
            and their respective officers, directors, employees, agents, and
            licensors shall not be liable for:
          </p>
          <ul className="list-disc list-inside ml-6 space-y-2">
            <li>
              Any indirect, incidental, special, consequential, or punitive
              damages.
            </li>
            <li>Any loss of profits, revenue, data, or use.</li>
            <li>
              Any claims arising from your use or inability to use the Services
              or reliance on the data provided.
            </li>
          </ul>
          <p>
            Stonk-Hub's total liability for all claims under these Terms shall
            not exceed the total amount paid by you for the Services in the
            twelve (12) months preceding the event giving rise to the claim.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            10. Indemnification
          </h2>
          <p>
            You agree to indemnify and hold harmless Stonk-Hub and its
            affiliates from and against any and all claims, liabilities,
            damages, losses, and expenses, including legal fees, arising out of
            or in any way connected with your use of the Services or violation
            of these Terms.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">11. Privacy</h2>
          <p>
            Your use of the Services is subject to our Privacy Policy, which
            explains how we collect, use, and protect your personal information.
            By using the Services, you consent to the practices described in our
            Privacy Policy.
          </p>
          <p>
            <a
              href="https://stonk-hub.com/privacy-policy"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://stonk-hub.com/privacy-policy
            </a>
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">12. Termination</h2>
          <p>
            Stonk-Hub may suspend or terminate your access to the Services,
            without notice or liability, if you violate these Terms or
            applicable laws. Upon termination, your right to use the Services
            will immediately cease, and any licenses granted shall be revoked.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            13. Governing Law and Jurisdiction
          </h2>
          <p>
            These Terms shall be governed by and construed in accordance with
            the laws of Germany, without regard to conflict of laws principles.
          </p>
          <p>
            You agree that any legal action or proceeding arising under or
            relating to these Terms shall be subject to the exclusive
            jurisdiction of the courts located in Germany.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            14. Changes to the Terms
          </h2>
          <p>
            Stonk-Hub reserves the right to update or modify these Terms at any
            time. If we make material changes, we will notify you by email or by
            posting a notice on our website prior to the effective date.
            Continued use of the Services after such changes constitutes your
            consent to the updated Terms.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            15. Miscellaneous
          </h2>
          <ul className="list-disc list-inside ml-6 space-y-2">
            <li>
              <b>Entire Agreement:</b> These Terms, together with our Privacy
              Policy, constitute the entire agreement between you and Stonk-Hub
              regarding your use of the Services.
            </li>
            <li>
              <b>Severability:</b> If any provision of these Terms is found to
              be unenforceable, the remaining provisions shall remain in full
              force and effect.
            </li>
            <li>
              <b>No Waiver:</b> Failure to enforce any right or provision shall
              not be deemed a waiver of such right or provision.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Contact Information
          </h2>
          <p>
            If you have any questions about these Terms, please contact us at:{" "}
            <a
              href="mailto:support@stonk-hub.com"
              className="text-blue-500 hover:underline"
            >
              support@stonk-hub.com
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
