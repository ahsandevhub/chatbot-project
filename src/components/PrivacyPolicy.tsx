import { ArrowLeftIcon, DownloadIcon, Shield } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const PrivacyPolicy: React.FC = () => {
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

      <main className="px-4 py-6 max-w-5xl mx-auto fade-in-section">
        <button
          onClick={() => navigate("/")}
          className="flex w-max text-sm mr-auto items-center gap-2 hover:gap-1 transition-all text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 mb-6"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Go Back</span>
        </button>

        <div className="text-center mb-10">
          <Shield className="w-16 h-16 mx-auto mb-6 text-gray-600 dark:text-gray-400" />
          <h1 className="text-5xl font-bold gradient-text mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            We value your trust and are committed to protecting your privacy.
            Learn how we handle your data with care.
          </p>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Last updated March 20th, 2025
          </p>
        </div>

        <div className="text-gray-700 text-justify dark:text-gray-300 space-y-6">
          <p>
            <b>Stonk-hub</b> ("Stonk-hub") respects your privacy and is
            committed to protecting it through our compliance with this policy.
          </p>
          <p>
            This policy describes how and why Stonk-hub might collect, store,
            use, and/or share ("process") your information when you register for
            Stonk-hub's services ("Services"), such as when you visit our
            website at{" "}
            <a
              href="https://stonk-hub.com/"
              className="text-blue-500 hover:underline"
            >
              https://stonk-hub.com/
            </a>{" "}
            (our "Site"). By reading this privacy policy, you will understand
            your privacy rights and choices.
          </p>
          <p>
            This policy collects information about you through your use of our
            Site and through other electronic communications between you and
            Stonk-hub.
          </p>
          <p>
            Please read this policy carefully to understand Stonk-hub's policies
            and practices surrounding your information and how Stonk-hub will
            handle it. If you disagree with Stonk-hub's policies and procedures,
            you should not use our Site. You agree to this privacy policy by
            accessing or using our Site. This policy is subject to modification
            at any time. Your continued use of our Site following changes is
            deemed acceptance of such changes, so please check the policy
            periodically for updates.
          </p>
          <ol className="ml-6">
            <li className="font-semibold">1. YOUR INFORMATION</li>
            <li className="font-semibold">
              2. Information you disclose to Stonk-hub
            </li>
          </ol>
          <p>
            When you use our Services, Stonk-hub may ask you to provide
            personally identifiable information that can be used to contact you
            or identify you. Personally identifiable information includes, but
            is not limited to:
          </p>
          <ul className="list-disc list-inside ml-6">
            <li>First Name</li>
            <li>Last Name</li>
            <li>Contact preferences</li>
            <li>
              Billing addresses and other payment information (such as your
              debit or credit card details)
            </li>
            <li>
              A device you are using to access our Service, and/or other
              information about a request or inquiry you make.
            </li>
          </ul>
          <p>
            Purpose: Stonk-hub collects your personal data for legal purposes,
            including for the execution of client contracts. This collection is
            necessary to fulfill Stonk-hub's contractual obligations and to
            ensure compliance with applicable legal requirements.
          </p>
          <p>
            Payment Data. Stonk-hub will not collect data necessary to process
            your payment such as payment instrument number, and the security
            code associated with your payment instrument. All payment data is
            stored by Stripe. You may find their privacy notice link here:{" "}
            <a
              href="https://stripe.com/in/privacy"
              className="text-blue-500 hover:underline"
            >
              https://stripe.com/in/privacy
            </a>
            .
          </p>
          <h2 className="text-xl font-semibold">
            Information automatically collected
          </h2>
          <p>
            Stonk-hub will automatically collect certain information when you
            visit, use, or browse the Services. This information does not reveal
            your unique identity (such as your name or contact information), but
            may include information about your device and usage, such as your IP
            address, browser and device features, operating system, language,
            communication URL, country, location, information about how and when
            you use our Services and other technical information. This
            information is essential to maintain the security and operation of
            our services and for internal analysis and reporting purposes.
          </p>
          <p>The information Stonk-hub collect includes:</p>
          <ul className="list-disc list-inside ml-6">
            <li>
              <b>Log and Usage Data.</b> Log and usage data is service,
              analytics, usage, and performance information that our servers
              automatically collect and write to log files when you access or
              use our Services. Depending on how you interact with Stonk- hub,
              this log data may include your IP address, device information,
              browser type, settings, and information about your activity on
              this Service's platform.
            </li>
            <li>
              <b>Device Data.</b> Stonk-hub collects device data such as
              information about your computer, phone, tablet, or other device
              you use to access the Services. Depending on the device used, this
              device data may include information such as your IP address (or
              proxy server), device and application identification numbers,
              location, browser type, hardware model, internet service provider
              and/or mobile carrier, operating system, and system configuration
              information.
            </li>
            <li>
              <b>Location Data.</b> Stonk-hub collects location data such as
              information about your device's location, which can be either
              precise or imprecise.
            </li>
          </ul>
          <p>
            You warrant that all personal information that you provide to
            Stonk-hub will be true, complete, and accurate, and you will notify
            Stonk-hub of any changes to such personal information.
          </p>
          <h2 className="text-xl font-semibold">
            Tracking Technologies and Cookies
          </h2>
          <p>
            Stonk-hub uses Cookies and similar tracking technologies to track
            the activity on our Platform and for analytics. The data Stonk- hub
            collects through tracking technologies is anonymous and does not
            identify individual users. Stonk-hub aggregates this information to
            analyze trends and user behavior on our Site. This means that while
            Stonk-hub can see the overall patterns of usage, Stonk-hub cannot
            trace this data back to any specific individual. Tracking
            technologies used are beacons, tags, and scripts to collect and
            track information and to improve and analyze our Service. The
            technologies Stonk-hub use may include:
          </p>
          <ul className="list-disc list-inside ml-6">
            <li>
              <b>Cookies or Browser Cookies.</b> A "Cookie" is a small file
              placed on your device. You can instruct your browser to refuse all
              Cookies or to indicate when a Cookie is being sent. However, if
              you do not accept Cookies, you may not be able to use some parts
              of our Service. Unless you have adjusted your browser setting so
              that it will refuse Cookies, our Service may use Cookies.
            </li>
            <li>
              <b>Web Beacons.</b> Certain sections of our Service and our emails
              may contain small electronic files known as web beacons (also
              referred to as clear gifs, pixel tags, and single-pixel gifs) that
              permit us, for example, to count users who have visited those
              pages or opened an email and for other related website statistics
              (for example, recording the popularity of a certain section and
              verifying system and server integrity).
            </li>
          </ul>
          <p>
            Stonk-hub utilizes PostHog to analyze and improve the performance of
            our Site. PostHog helps Stonk-hub track and understand user
            behavior, providing insights into how visitors interact with our
            Site, which allows Stonk-hub to enhance user experience and optimize
            its content. The tool uses Cookies to collect data such as IP
            addresses, pages visited, and time spent on the site. This
            information is aggregated and anonymized, ensuring that individual
            users cannot be personally identified. Stonk-hub is committed to
            safeguard your privacy and only use this data to improve Stonk-hub's
            Services and deliver a more tailored experience.
          </p>
          <h2 className="text-xl font-semibold">2. USE OF YOUR INFORMATION</h2>
          <p>Stonk-hub may use your information for the following purposes:</p>
          <ul className="list-disc list-inside ml-6">
            <li>
              <b>To contact you.</b> To contact you by email, telephone calls,
              SMS, or other equivalent forms of electronic communication, such
              as a mobile application's push notifications regarding updates or
              informative communications related to the functionalities, or
              contracted services, including the security updates, when
              necessary or reasonable for their implementation.
            </li>
            <li>
              <b>To provide you with news, special offers</b> and general
              information about other services, and events which Stonk-hub
              offers that are similar to those that you have already subscribed
              or inquired about unless you have opted not to receive such
              information.
            </li>
            <li>
              <b>To manage your requests.</b> To attend and manage your requests
              to Stonk-hub.
            </li>
            <li>
              <b>For other purposes.</b> Stonk-hub may use your information for
              other purposes, such as data analysis, identifying usage trends,
              determining the effectiveness of our promotional campaigns and to
              evaluate and improve our Service, and your experience.
            </li>
          </ul>
          <h2 className="text-xl font-semibold">3. OUR COMPLIANCE</h2>
          <h2 className="text-xl font-semibold">
            Legal basis for processing personal information under General Data
            Protection Regulation ("GDPR")
          </h2>
          <p>
            Stonk-hub may process personal information under the following
            conditions:
          </p>
          <ul className="list-disc list-inside ml-6">
            <li>
              <b>Consent.</b> You have consented to Stonk-hub processing your
              personal information for a specific purpose.
            </li>
            <li>
              <b>Performance of a contract.</b> The provision of personal
              information is necessary for the execution of a contract with you
              and/or for pre-contractual obligations.
            </li>
            <li>
              <b>Legal obligations.</b> The processing of personal information
              is necessary for the fulfillment of a legal obligation to which
              Stonk-hub is subject.
            </li>
            <li>
              <b>Vital interests.</b> The processing of personal information is
              necessary to protect your important interests or the important
              interests of another natural person.
            </li>
            <li>
              <b>Legitimate and Public interests.</b> The processing of personal
              information is related to an activity carried out in the public
              interest, in legitimate interests and or in the exercise of the
              official power vested in Stonk-hub.
            </li>
          </ul>
          <h2 className="text-xl font-semibold">Your Rights under the GDPR</h2>
          <p>
            Stonk-hub undertakes to respect the privacy of your personal
            information and to ensure that you can exercise your rights.
          </p>
          <p>You have the right under this privacy policy, to:</p>
          <ul className="list-disc list-inside ml-6">
            <li>
              <b>Request access to your personal information.</b> The right to
              access, update or delete the information Stonk-hub has about you.
              Whenever possible, you can request access to, update or request
              deletion of your personal information directly with Stonk-hub.
            </li>
            <li>
              <b>
                Request the correction of the personal information Stonk- hub
                holds about you.
              </b>{" "}
              You have the right to correct any inaccurate or incorrect
              information Stonk-hub has about you.
            </li>
            <li>
              <b>Objection to the processing of your personal information.</b>
              This right remains when Stonk-hub relies on legitimate interests
              as a legal basis for processing and in certain circumstances
              related to your situation that require you to object to the
              processing of your personal information on this basis. You also
              have the right to object to the processing of your personal
              information for legitimate marketing purposes.
            </li>
            <li>
              <b>Request that your personal information be deleted.</b> You have
              the right to ask Stonk-hub to remove or delete personal
              information without compelling reasons for Stonk-hub to continue
              to do so.
            </li>
            <li>
              <b>Withdraw your consent.</b> You have the right to withdraw your
              consent to our use of your personal information. If you withdraw
              your consent, Stonk-hub may not be able to provide you with access
              to certain features of the Service.
            </li>
          </ul>
          <h2 className="text-xl font-semibold">
            Exercising of Your GDPR Data Protection Rights
          </h2>
          <p>
            You can exercise your right of access, rectification, cancellation,
            and opposition by contacting Stonk-hub. Please note that Stonk-hub
            may ask you to verify your identity before responding to such
            requests. Stonk-hub will do our best to respond to your request as
            soon as possible.
          </p>
          <h2 className="text-xl font-semibold">
            Your Rights under California Consumer Protection Act ("CCPA")
          </h2>
          <p>
            This section applies only to California residents. Under CCPA, you
            have the rights listed below.
          </p>
          <p>The California Code of Regulations defines a "resident" as:</p>
          <ol className="list-decimal list-inside ml-6">
            <li>
              every individual who is in the State of California for other than
              a temporary or transitory purpose; and
            </li>
            <li>
              every individual who is domiciled in the State of California who
              is outside the State of California for a temporary or transitory
              purpose.
            </li>
          </ol>
          <p>All other individuals are defined as "non-residents".</p>
          <p>
            If this definition of "resident" applies to you, Stonk-hub must
            adhere to certain rights and obligations regarding your personal
            information.
          </p>
          <h2 className="text-xl font-semibold">
            Your rights with respect to your personal data
          </h2>
          <ul className="list-disc list-inside ml-6">
            <li>
              <b>Right to request deletion of the data - Request to delete.</b>{" "}
              You can ask for the deletion of your personal information. If you
              ask Stonk-hub to delete your personal information, Stonk-hub will
              respect your request and delete your personal information, subject
              to certain exceptions provided by law, such as (but not limited
              to) the exercise by another consumer of his or her right to free
              speech, Stonk-hub's compliance requirements resulting from a legal
              obligation, or any processing that may be required to protect
              against illegal activities.
            </li>
            <li>
              <b>
                Right to Non-Discrimination for the Exercise of a Consumer's
                Privacy Rights.
              </b>{" "}
              Stonk-hub will not discriminate against you if you exercise your
              privacy rights.
            </li>
          </ul>
          <h2 className="text-xl font-semibold">Verification process</h2>
          <p>
            Upon receiving your request, Stonk-hub will need to verify your
            identity to determine you are the same person about whom Stonk-hub
            has the information in our system. These verification efforts
            require Stonk-hub to ask you to provide information so that
            Stonk-hub can match it with information you have previously provided
            Stonk-hub. For instance, depending on the type of request you
            submit, Stonk-hub may ask you to provide certain information so that
            Stonk-hub can match the information you provide with the information
            Stonk-hub already have on file, or Stonk-hub may contact you through
            a communication method (e.g., phone or email) that you have
            previously provided to Stonk-hub. Stonk-hub may also use other
            verification methods as the circumstances dictate.
          </p>
          <h2 className="text-xl font-semibold">Cookie Consent Banner</h2>
          <p>
            Stonk-hub uses Cookies to enhance your browsing experience. Our Site
            uses cookies and similar technologies to improve functionality,
            analyze traffic, and personalize content. By clicking "Accept All
            Cookies," you consent to Stonk-hub's use of cookies.
          </p>
          <h2 className="text-xl font-semibold">Manage Your Preferences:</h2>
          <ul className="list-disc list-inside ml-6">
            <li>
              <b>Essential Cookies.</b> These Cookies are necessary for the Site
              to function and cannot be disabled.
            </li>
            <li>
              <b>Performance Cookies.</b> These Cookies help Stonk-hub
              understand how visitors interact with our Site by collecting and
              reporting information anonymously.
            </li>
            <li>
              <b>Functional Cookies.</b> These Cookies enable the Site to
              provide enhanced functionality and personalization.
            </li>
            <li>
              <b>Targeting Cookies.</b> These Cookies may be set through our
              Site by our advertising partners to build a profile of your
              interests and show you relevant ads on other sites.
            </li>
          </ul>
          <p>
            You can manage your cookie preferences at any time by clicking on
            "Cookie Settings".
          </p>
          <h2 className="text-xl font-semibold">
            4. SHARING OF YOUR PERSONAL INFORMATION
          </h2>
          <p>
            Stonk-hub respects your privacy and understands that your
            information is important for you. Stonk-hub may share your personal
            information in the following situations:
          </p>
          <ul className="list-disc list-inside ml-6">
            <li>
              <b>For compliance with law.</b> Stonk-hub may share or transfer
              your personal information to authorized entities when necessary to
              comply with applicable laws, regulations, or legal requests. This
              includes, but is not limited to, responding to subpoenas, court
              orders, or other legal processes, as well as cooperating with law
              enforcement agencies. Stonk-hub ensures that any sharing of your
              information is conducted in accordance with the law and with the
              utmost respect for your privacy rights.
            </li>
            <li>
              <b>With your consent.</b> Stonk-hub may disclose your personal
              information for other purposes with your consent.
            </li>
          </ul>
          <p>
            Stonk-hub do not share, sell, or otherwise disclose your personal
            information for any purpose other than as described in this privacy
            policy.
          </p>
          <h2 className="text-xl font-semibold">5. DATA RETENTION</h2>
          <p>
            Stonk-hub will retain your personal information only for as long as
            is necessary for the purposes set out in this privacy policy and to
            comply with our legal obligations (for example, if Stonk- hub is
            required to retain your data to comply with applicable laws),
            resolve disputes, tax purposes and enforce our legal agreements and
            policies.
          </p>
          <p>
            Stonk-hub will also retain your personal information for internal
            analysis purposes. Personal information is generally retained for a
            shorter period of time, except when this data is used to strengthen
            the security or to improve the functionality of our Service, or
            Stonk-hub are legally obligated to retain this data for longer time
            periods.
          </p>
          <p>
            In Stonk-hub's commitment to transparency and compliance with
            privacy regulations, Stonk-hub would like to inform you that any
            tracking data collected through our Site, including data from
            PostHog, is retained in accordance with their respective privacy
            policies. This data may include information about your interactions
            with our site and advertisements, which helps us analyze and improve
            our services. Stonk-hub encourages you to review PostHog's privacy
            policiy for detailed information on how they handle and retain
            tracking data. By using our Site, you acknowledge and agree to the
            retention of this data as outlined in those policies.
          </p>
          <h2 className="text-xl font-semibold">
            6. SECURITY OF YOUR PERSONAL INFORMATION
          </h2>
          <p>
            At Stonk-hub, we take the protection of your personal data seriously
            and implement a variety of security measures including, but not
            limited to, encryption, secure servers, data minimization, to
            safeguard it against unauthorized access, alteration, disclosure, or
            destruction.
          </p>
          <p>
            Stonk-hub prioritizes the security and confidentiality of your
            personal data. When Stonk-hub processes and stores your information,
            Stonk-hub employs Secure Sockets Layer ("SSL") encryption to ensure
            that your data is transmitted securely over the internet. This
            technology creates a secure connection between your browser and our
            servers, safeguarding your information from unauthorized access
            during transmission. Stonk-hub is committed to implementing
            industry-standard security measures to protect your data and
            maintain your trust.
          </p>
          <p>
            Stonk-hub implements appropriate technical security measures and
            procedures to protect the security of all personal information
            Stonk-hub processes. However, despite Stonk-hub's assurances and
            efforts to protect your information, no electronic transmission over
            the internet or information storage technology can guarantee 100%
            security. They may compromise our security and improperly collect,
            access, steal or modify your information. Although Stonk-hub does
            its best to protect your personal information, sending personal
            information to and from our Services is at your own risk. You must
            only access the Services in a secure environment.
          </p>
          <h2 className="text-xl font-semibold">
            7. TRANSFER OF YOUR INFORMATION
          </h2>
          <p>
            Your information, including your personal data, is processed at our
            operating offices and in any other places where the parties involved
            in the processing are located. It means that this information may be
            transferred to and maintained on computers located outside of your
            state, province, country or other governmental jurisdiction where
            the data protection laws may differ from those of your jurisdiction.
          </p>
          <p>
            Your consent to this Privacy Policy followed by your submission of
            such information represents your agreement to that transfer.
          </p>
          <p>
            Stonk-hub will take all steps reasonably necessary to ensure that
            your data is treated securely and in accordance with this Privacy
            Policy and no transfer of your personal data will take place to an
            organization or a country unless there are adequate controls in
            place including the security of your data and other personal
            information.
          </p>
          <h2 className="text-xl font-semibold">8. THIRD-PARTY SERVICES</h2>
          <p>
            Our Site utilizes third-party services to enhance user experience
            and analyze website traffic. Specifically, Stonk-hub employs PostHog
            for these purposes.
          </p>
          <p>
            For more information on how PostHog handles your data, please refer
            to their Privacy Policy:{" "}
            <a
              href="https://posthog.com/privacy"
              className="text-blue-500 hover:underline"
            >
              https://posthog.com/privacy
            </a>
          </p>
          <p>
            For more information on how Stripe handles your data, please refer
            to their Privacy Policy:{" "}
            <a
              href="https://stripe.com/privacy"
              className="text-blue-500 hover:underline"
            >
              https://stripe.com/privacy
            </a>
          </p>
          <p>
            For more information on how Supabase handles your data, please refer
            to their Privacy Policy:{" "}
            <a
              href="https://supabase.com/privacy"
              className="text-blue-500 hover:underline"
            >
              https://supabase.com/privacy
            </a>
          </p>
          <p>
            Please note that Stonk-hub will not share your personal data with
            any other third parties. The information collected by these services
            is used solely for the purposes outlined above and in accordance
            with their respective privacy policies.
          </p>
          <h2 className="text-xl font-semibold">9. CHANGES TO THIS POLICY</h2>
          <p>
            Stonk-hub may update our privacy policy from time to time. Stonk-hub
            will notify you of any changes by posting the new privacy policy on
            this page.
          </p>
          <p>
            Before any changes become effective, Stonk-hub will notify you by
            email and/or through a prominent notice on our Services and post a
            "Revised update" The date appears at the top of this privacy policy.
          </p>
          <p>
            You are advised to review this Privacy Policy periodically for any
            changes. Changes to this privacy policy will be effective when
            posted on this page.
          </p>
          <h2 className="text-xl font-semibold">10. CONTACT US</h2>
          <p>
            If you have any questions about this privacy policy, you can contact
            Stonk-hub:
          </p>
          <p>
            By visiting our website-{" "}
            <a
              href="https://stonk-hub.com/"
              className="text-blue-500 hover:underline"
            >
              https://stonk-hub.com/
            </a>
          </p>
          <p>
            By sending us an email-{" "}
            <a
              href="mailto:support@stonk-hub.com"
              className="text-blue-500 hover:underline"
            >
              support@stonk-hub.com
            </a>
          </p>
        </div>

        <div className="my-12 text-center">
          <a
            href="/downloads/Privacy-Policy.pdf"
            download
            className="inline-flex items-center gap-2 px-6 py-2 text-white bg-gray-600 hover:bg-gray-700 rounded-md"
          >
            <DownloadIcon className="w-5 h-5" /> Download Policy
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
