import { Zap, Shield, BarChart3, Coins, ArrowRight, Check, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => navigate('/login');

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Coins className="w-8 h-8 text-emerald-600" />
              <span className="text-xl font-bold text-gray-900">TokenPap</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#benefits" className="text-gray-600 hover:text-gray-900 transition-colors">Benefits</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <button 
                onClick={handleGetStarted}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                Get Started
              </button>
            </div>

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-600 hover:text-gray-900">Features</a>
              <a href="#benefits" className="block text-gray-600 hover:text-gray-900">Benefits</a>
              <a href="#pricing" className="block text-gray-600 hover:text-gray-900">Pricing</a>
              <button 
                onClick={handleGetStarted}
                className="w-full bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Simplify Your Token
                <span className="text-emerald-600"> Utility System</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                TokenPap provides enterprise-grade token management, analytics, and security tools
                to help you scale your digital asset operations with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Everything you need to manage, analyze, and secure your token ecosystem
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Lightning Fast</h3>
                <p className="text-gray-600 leading-relaxed">
                  Process thousands of transactions per second with our optimized infrastructure and real-time updates.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Bank-Grade Security</h3>
                <p className="text-gray-600 leading-relaxed">
                  Multi-layer encryption, cold storage options, and compliance with industry standards to keep assets safe.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Advanced Analytics</h3>
                <p className="text-gray-600 leading-relaxed">
                  Comprehensive dashboards and reports to track performance, identify trends, and make data-driven decisions.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <Coins className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Multi-Token Support</h3>
                <p className="text-gray-600 leading-relaxed">
                  Manage multiple token types and standards from a single unified platform with seamless integration.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Automation</h3>
                <p className="text-gray-600 leading-relaxed">
                  Automate recurring tasks, set up custom workflows, and reduce manual intervention with intelligent rules.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">API Integration</h3>
                <p className="text-gray-600 leading-relaxed">
                  Robust REST and WebSocket APIs for seamless integration with your existing systems and workflows.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Built for Teams That Demand Excellence
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  TokenPap empowers organizations to handle complex token operations with ease,
                  providing the tools and insights needed to succeed in the digital economy.
                </p>
                <div className="space-y-4">
                  {[
                    'Reduce operational costs by up to 60%',
                    'Real-time monitoring and alerts',
                    'Comprehensive audit trails',
                    'Dedicated support team',
                    'Scalable infrastructure',
                    '99.99% uptime guarantee'
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-8 shadow-xl">
                  <div className="bg-white rounded-lg p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500">Total Value Locked</span>
                      <span className="text-emerald-600 text-sm font-medium">+12.5%</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">$24.8M</div>
                  </div>
                  <div className="bg-white rounded-lg p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500">Active Tokens</span>
                      <span className="text-blue-600 text-sm font-medium">Live</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">847</div>
                  </div>
                  <div className="bg-white rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500">Transactions Today</span>
                      <span className="text-amber-600 text-sm font-medium">+8.2%</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">15,432</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Token Management?
            </h2>
            <p className="text-xl text-emerald-50 mb-8">
              Join thousands of teams already using TokenPap to streamline their operations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleGetStarted}
                className="bg-white text-emerald-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-all transform hover:scale-105 font-medium flex items-center justify-center gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-colors font-medium">
                Schedule a Demo
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Watermark */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[3rem] sm:text-[5rem] lg:text-[8rem] font-black text-white/10 whitespace-nowrap pointer-events-none select-none z-0 tracking-tighter">
          TOKENPAP SYSTEM
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Coins className="w-6 h-6 text-emerald-600" />
                <span className="text-lg font-bold text-white">TokenPap</span>
              </div>
              <p className="text-sm">
                Enterprise-grade token utility management for modern businesses.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            <p>&copy; 2024 TokenPap. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
