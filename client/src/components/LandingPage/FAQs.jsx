import { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

function FAQs() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Is Linkly completely free to use?",
      answer:
        "Yes, Linkly offers a free plan with all essential features. Premium plans are available with advanced analytics and customization options.",
    },
    {
      question: "Can I customize my short URLs?",
      answer:
        "Absolutely! You can create custom aliases for your shortened URLs, making them more memorable and brand-friendly.",
    },
    {
      question: "How long do my shortened links remain active?",
      answer:
        "Your links remain active indefinitely unless you set an expiration date or manually delete them.",
    },
    {
      question: "Can I track clicks on my shortened links?",
      answer:
        "Yes, Linkly provides detailed analytics including click counts, geographic locations, referral sources, and device information.",
    },
    {
      question: "Is there a limit to how many links I can create?",
      answer:
        "Free accounts have a limit of 100 links per month. Premium users enjoy unlimited link creation.",
    },
  ];

  return (
    <section id="faq" className="relative py-20 bg-gradient-to-b">
      <div className="container mx-auto px-6 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20 mb-5">
            FAQ
          </div>
          <h2 className="text-3xl md:text-4xl font-light text-white mb-5">
            Common{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              questions
            </span>
          </h2>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            Find answers to frequently asked questions about Linkly
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-xl overflow-hidden">
              <button
                className="flex items-center justify-between w-full px-5 py-4 text-left bg-gray-800/40 rounded-xl border border-gray-700/40 hover:border-indigo-500/30 transition-colors duration-300"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-sm font-medium text-white pr-4">
                  {faq.question}
                </span>
                <span className="text-indigo-400 flex-shrink-0 transform transition-transform duration-300 text-xs">
                  {activeIndex === index ? (
                    <FaChevronDown />
                  ) : (
                    <FaChevronRight />
                  )}
                </span>
              </button>
              <div
                className="overflow-hidden transition-all duration-500 ease-in-out"
                style={{
                  maxHeight: activeIndex === index ? "200px" : "0px",
                  opacity: activeIndex === index ? 1 : 0.7,
                }}
              >
                <div className="px-5 py-4 bg-gray-800/20 rounded-b-xl border border-gray-700/30 border-t-0">
                  <p className="text-gray-400 text-sm">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Support */}
        <div className="text-center mt-12">
          <div className="max-w-2xl mx-auto bg-gray-800/30 rounded-xl p-6 border border-gray-700/40">
            <h3 className="text-lg font-medium text-white mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Our support team is here to help you with any questions
            </p>
            <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-sm hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQs;