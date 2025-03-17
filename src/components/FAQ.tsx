
import React, { useState, useEffect, useRef } from 'react';
import { Minus, Plus } from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from '@/components/ui/accordion';

type FAQItem = {
  question: string;
  answer: React.ReactNode;
};

const faqs: FAQItem[] = [
  {
    question: "Which timeframes are available?",
    answer: (
      <div>
        <p>You can request data in the following standard timeframes (candles):</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>Monthly</li>
          <li>Weekly</li>
          <li>Daily</li>
          <li>4 Hour</li>
          <li>2 Hour</li>
          <li>1 Hour</li>
          <li>45 Minutes</li>
          <li>30 Minutes</li>
          <li>15 Minutes</li>
          <li>5 Minutes</li>
          <li>1 Minute</li>
        </ul>
      </div>
    )
  },
  {
    question: "What can I get with 1 credit?",
    answer: (
      <div>
        <p>You can get a lot of data with just 1 credit! Here's an overview of how much data you can access on different time scales:</p>
        <ul className="list-disc pl-6 mt-2 space-y-1">
          <li>1 Month candles: 416 years</li>
          <li>1 Week candles: 96 years</li>
          <li>1 Day candles: 20 years</li>
          <li>4 Hour candles: 12 years</li>
          <li>2 Hour candles: 6 years</li>
          <li>1 Hour candles: 3 years</li>
          <li>45 Minute candles: 2 years</li>
          <li>30 Minute candles: 1.5 years</li>
          <li>15 Minute candles: 9 months</li>
          <li>5 Minute candles: 3 months</li>
          <li>1 Minute candles: 12 days</li>
        </ul>
        <p className="mt-2 text-sm italic">Please note: These are theoretical maximums. Actual data availability may vary due to historical coverage and other factors.</p>
      </div>
    )
  },
  {
    question: "When is a credit used?",
    answer: (
      <p>A credit is used each time a download link is created for you. Some requests may require more than 1 credit if you're downloading large amounts of data. Don't worry—before finalizing your request, we'll tell you exactly how many credits will be used and give you the option to proceed.</p>
    )
  },
  {
    question: "Do my credits roll over into the next month?",
    answer: <p>No. Credits reset each month according to your subscription plan.</p>
  },
  {
    question: "Which stock exchanges are covered in the Equity Analyst & Global Macro plans?",
    answer: (
      <div>
        <p>The Equity Analyst and Global Macro plans currently cover the following exchanges:</p>
        <div className="overflow-x-auto mt-2">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left border-b border-gray-300 pb-2">Exchange</th>
                <th className="text-center border-b border-gray-300 pb-2">Equity Analyst</th>
                <th className="text-center border-b border-gray-300 pb-2">Global Macro</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-1">New York Stock Exchange (NYSE)</td>
                <td className="text-center py-1">✓</td>
                <td className="text-center py-1">✓</td>
              </tr>
              <tr>
                <td className="py-1">NASDAQ</td>
                <td className="text-center py-1">✓</td>
                <td className="text-center py-1">✓</td>
              </tr>
              <tr>
                <td className="py-1">Shanghai Stock Exchange (SSE)</td>
                <td className="text-center py-1">✓</td>
                <td className="text-center py-1">✓</td>
              </tr>
              <tr>
                <td className="py-1">Japan Exchange Group (Tokyo Stock Exchange)</td>
                <td className="text-center py-1">✓</td>
                <td className="text-center py-1">✓</td>
              </tr>
              <tr>
                <td className="py-1">National Stock Exchange of India (NSE)</td>
                <td className="text-center py-1">✓</td>
                <td className="text-center py-1">✓</td>
              </tr>
              <tr>
                <td className="py-1">Euronext</td>
                <td className="text-center py-1">–</td>
                <td className="text-center py-1">✓</td>
              </tr>
              <tr>
                <td className="py-1">Hong Kong Exchanges and Clearing (HKEX)</td>
                <td className="text-center py-1">–</td>
                <td className="text-center py-1">✓</td>
              </tr>
              <tr>
                <td className="py-1">Shenzhen Stock Exchange (SZSE)</td>
                <td className="text-center py-1">–</td>
                <td className="text-center py-1">✓</td>
              </tr>
              <tr>
                <td className="py-1">TMX Group (Toronto Stock Exchange)</td>
                <td className="text-center py-1">–</td>
                <td className="text-center py-1">✓</td>
              </tr>
              <tr>
                <td className="py-1">Saudi Exchange (Tadawul)</td>
                <td className="text-center py-1">–</td>
                <td className="text-center py-1">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2">If you're interested in additional exchanges, please feel free to reach out! We're always open to feedback and suggestions.</p>
      </div>
    )
  },
  {
    question: "What is a CSV file and why is it the preferred format?",
    answer: (
      <p>CSV stands for Comma-Separated Values. It's the gold standard for data files in the finance industry. CSV files are lightweight compared to Excel files and preserve the intended formatting. If you're new to working with CSV files, we've got you covered! Check out our quick 40-second video tutorial to get started.</p>
    )
  },
  {
    question: "Which crypto exchanges are covered by the Global Macro plan?",
    answer: (
      <p>Currently, we cover Binance, the largest exchange by traded volume. We plan to add more exchanges in the future. If you have suggestions, we'd love to hear from you! Just send us an email.</p>
    )
  },
  {
    question: "Can I get more historical data?",
    answer: (
      <p>We're always working to expand our historical data coverage. However, financial data often comes with licensing costs. As our community grows, we aim to provide more data while keeping your costs as low as possible.</p>
    )
  }
];

const FAQ: React.FC = () => {
  const faqRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      },
      { threshold: 0.1 }
    );
    
    if (faqRef.current) {
      observer.observe(faqRef.current);
    }
    
    return () => {
      if (faqRef.current) {
        observer.unobserve(faqRef.current);
      }
    };
  }, []);

  return (
    <section className="py-24 font-inter" id="faq">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight font-inter">FAQ</h2>
        </div>
        <div 
          ref={faqRef} 
          className="max-w-3xl mx-auto fade-in-section font-inter"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200 py-4 first:border-t">
                <AccordionTrigger className="flex w-full items-start justify-between text-left font-inter">
                  <span className="text-xl font-medium font-inter">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pr-12 font-inter">
                  <div className="font-inter">{faq.answer}</div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
