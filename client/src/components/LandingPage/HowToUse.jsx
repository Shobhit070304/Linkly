import { ArrowRight, AtSignIcon, ChartBar, Share, Stars } from "lucide-react";

function HowToUse() {
  const steps = [
    {
      step: "1",
      title: "Create Account",
      description: "Sign up for your free Linkly account in seconds",
      icon: <AtSignIcon className="text-sm" />,
    },
    {
      step: "2",
      title: "Shorten URL",
      description: "Paste long URL and customize your short link",
      icon: <Stars className="text-sm" />,
    },
    {
      step: "3",
      title: "Share & Track",
      description: "Share your link and monitor performance",
      icon: <Share className="text-sm" />,
    },
    {
      step: "4",
      title: "Manage Links",
      description: "Organize, edit, or delete from dashboard",
      icon: <ChartBar className="text-sm" />,
    },
  ];

  return (
    <section id="how-to-use" className="relative py-20">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20 mb-5">
            SIMPLE PROCESS
          </div>
          <h2 className="text-3xl md:text-4xl font-light text-white mb-5">
            How to use{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Linkly
            </span>
          </h2>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto">
            Getting started with our platform is quick and straightforward
          </p>
        </div>

        {/* Steps with connecting lines */}
        <div className="relative">
          {/* Horizontal connecting line */}
          <div className="absolute left-10 right-10 top-7 h-0.5 bg-gray-800/50 hidden md:block"></div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Step connector dots */}

                <div className="hidden md:block absolute left-0 top-7 w-full h-0.5">
                  <div className="absolute left-0 top-0 w-full h-full bg-indigo-500/30 scale-0 group-hover:scale-100 transition-transform origin-left duration-500"></div>
                </div>

                {/* Step Number */}
                <div className="relative z-10 w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-600/10 flex items-center justify-center text-indigo-400 text-lg font-medium border border-indigo-500/20 group-hover:border-indigo-500/40 group-hover:scale-110 transition-all duration-300 mb-4">
                  {step.step}
                </div>

                {/* Icon */}
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-lg flex items-center justify-center text-indigo-400 mb-3 group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-sm font-medium text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-xs">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <button className="px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-sm hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 flex items-center justify-center gap-2 group mx-auto">
            Get Started Now
            <ArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default HowToUse;
