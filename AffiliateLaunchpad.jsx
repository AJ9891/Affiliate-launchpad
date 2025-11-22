import React, { useState, useEffect } from "react";

/*
SendShark-integrated Affiliate Launchpad
- Uses Vite environment variables:
  VITE_SENDSHARK_API_URL (e.g. https://api.sendshark.com/v1/ )
  VITE_SENDSHARK_API_KEY
  VITE_SENDSHARK_LIST_ID (your "Launchpad" list id)
  VITE_FROM_NAME
  VITE_FROM_EMAIL
  VITE_LEAD_MAGNET_DOWNLOAD (link)
*/

const SENDSHARK_API_URL = import.meta.env.VITE_SENDSHARK_API_URL || "";
const SENDSHARK_API_KEY = import.meta.env.VITE_SENDSHARK_API_KEY || "";
const SENDSHARK_LIST_ID = import.meta.env.VITE_SENDSHARK_LIST_ID || "";
const FROM_NAME = import.meta.env.VITE_FROM_NAME || "Abby";
const FROM_EMAIL = import.meta.env.VITE_FROM_EMAIL || "noreply@example.com";
const LEAD_MAGNET_LINK = import.meta.env.VITE_LEAD_MAGNET_DOWNLOAD || "#";

const SUBSCRIPTION_TIERS = {
  basic: {
    id: 'basic',
    name: 'Affiliate Starter',
    price: 29.99,
    features: [
      'Access to affiliate network',
      'Direct messaging with members',
      'Basic analytics dashboard',
      'AI-powered monthly action plan',
      'Monthly group coaching call',
      'Resource library access'
    ]
  },
  premium: {
    id: 'premium',
    name: 'Affiliate Pro',
    price: 59.99,
    features: [
      'Everything in Starter tier',
      'Advanced analytics & tracking',
      'Enhanced action plan (16 tasks)',
      '1-on-1 mentorship calls (2/month)',
      'Exclusive premium content library',
      'Priority support (24h response)',
      'Custom landing page templates',
      'A/B testing tools',
      'Advanced automation workflows'
    ]
  }
};

export default function AffiliateLaunchpad() {
  const sampleProducts = [
    {
      id: "ebook-1",
      title: "Fix It Fast: Home Repair Basics",
      price: 27,
      bullets: ["Plumbing quick fixes", "Wall patching checklist", "Tool guide"],
      img: "https://images.unsplash.com/photo-1581574208731-6a9b2c3b7a2b?q=80&w=800&auto=format&fit=crop",
      color: "bg-amber-50",
    },
    {
      id: "ebook-2",
      title: "Auto Care for Beginners",
      price: 37,
      bullets: ["MAF sensor & diagnostics", "Oil change walkthrough", "Safety checklist"],
      img: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=800&auto=format&fit=crop",
      color: "bg-sky-50",
    },
    {
      id: "bundle-1",
      title: "DIY Repair Academy Bundle",
      price: 67,
      bullets: ["All guides + checklists", "Printable templates", "Lifetime updates"],
      img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop",
      color: "bg-emerald-50",
    },
  ];

  const [products] = useState(sampleProducts);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  
  // Tier system state
  const [selectedTier, setSelectedTier] = useState('basic');
  const [currentUserTier, setCurrentUserTier] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showContentLibrary, setShowContentLibrary] = useState(false);
  const [showABTesting, setShowABTesting] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Action Plan state
  const [showActionPlan, setShowActionPlan] = useState(false);
  const [actionPlan, setActionPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("al_cart");
    if (saved) setCart(JSON.parse(saved));
    
    const savedTier = localStorage.getItem("al_current_tier");
    if (savedTier) {
      setCurrentUserTier(savedTier);
      setSelectedTier(savedTier);
    }
    
    const savedSubscribed = localStorage.getItem("al_subscribed");
    if (savedSubscribed) {
      setSubscribed(true);
    }
    
    const plan = localStorage.getItem("al_action_plan");
    if (plan) setActionPlan(JSON.parse(plan));
  }, []);

  useEffect(() => {
    localStorage.setItem("al_cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(product) {
    setCart((c) => [...c, product]);
  }
  
  // Generate AI-powered monthly action plan
  async function generateActionPlan(tier) {
    setPlanLoading(true);
    
    // Simulate AI generation (in production, call OpenAI API)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const now = new Date();
    const planMonth = now.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    const baseTasks = [
      { id: 1, week: 1, task: 'Set up your affiliate dashboard and tracking tools', completed: false, priority: 'high' },
      { id: 2, week: 1, task: 'Research and select your first 3 affiliate programs', completed: false, priority: 'high' },
      { id: 3, week: 1, task: 'Create social media profiles for affiliate marketing', completed: false, priority: 'medium' },
      { id: 4, week: 2, task: 'Write your first product review or comparison article', completed: false, priority: 'high' },
      { id: 5, week: 2, task: 'Create 5 social media posts promoting affiliate products', completed: false, priority: 'medium' },
      { id: 6, week: 2, task: 'Join 2 affiliate marketing communities for networking', completed: false, priority: 'low' },
      { id: 7, week: 3, task: 'Launch your first email campaign to subscribers', completed: false, priority: 'high' },
      { id: 8, week: 3, task: 'Experiment with 2 traffic sources (SEO, ads, or social)', completed: false, priority: 'high' },
      { id: 9, week: 3, task: 'Analyze your first week of traffic and conversion data', completed: false, priority: 'medium' },
      { id: 10, week: 4, task: 'Optimize top-performing content based on analytics', completed: false, priority: 'high' },
      { id: 11, week: 4, task: 'Scale successful campaigns with increased budget/effort', completed: false, priority: 'medium' },
      { id: 12, week: 4, task: 'Document lessons learned and plan next month', completed: false, priority: 'medium' }
    ];
    
    const premiumTasks = tier === 'premium' ? [
      { id: 13, week: 1, task: 'Schedule your 1-on-1 mentorship call', completed: false, priority: 'high' },
      { id: 14, week: 2, task: 'Set up A/B tests for your top 3 landing pages', completed: false, priority: 'high' },
      { id: 15, week: 3, task: 'Build custom automation workflow for email sequences', completed: false, priority: 'medium' },
      { id: 16, week: 4, task: 'Review advanced analytics and create custom reports', completed: false, priority: 'high' }
    ] : [];
    
    const plan = {
      month: planMonth,
      tier: tier,
      generated: now.toISOString(),
      lastUpdated: now.toISOString(),
      tasks: [...baseTasks, ...premiumTasks],
      stats: {
        total: baseTasks.length + premiumTasks.length,
        completed: 0,
        progress: 0
      }
    };
    
    setActionPlan(plan);
    localStorage.setItem('al_action_plan', JSON.stringify(plan));
    setPlanLoading(false);
    return plan;
  }
  
  // Toggle task completion
  function toggleTask(taskId) {
    if (!actionPlan) return;
    
    const updatedTasks = actionPlan.tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    const completedCount = updatedTasks.filter(t => t.completed).length;
    const progress = Math.round((completedCount / updatedTasks.length) * 100);
    
    const updatedPlan = {
      ...actionPlan,
      tasks: updatedTasks,
      lastUpdated: new Date().toISOString(),
      stats: {
        total: updatedTasks.length,
        completed: completedCount,
        progress: progress
      }
    };
    
    setActionPlan(updatedPlan);
    localStorage.setItem('al_action_plan', JSON.stringify(updatedPlan));
  }
  
  // Regenerate plan for new month
  async function regeneratePlan() {
    if (currentUserTier) {
      await generateActionPlan(currentUserTier);
    }
  }

  async function sendToSendShark(subscriber, tags=[]) {
    if (!SENDSHARK_API_URL || !SENDSHARK_API_KEY || !SENDSHARK_LIST_ID) {
      console.warn("SendShark details missing; skipping API call.");
      return { ok: false, msg: "config_missing" };
    }
    const url = `${SENDSHARK_API_URL.replace(/\/+$/,'')}/lists/${SENDSHARK_LIST_ID}/subscribers`;
    const payload = {
      email: subscriber.email,
      first_name: subscriber.first_name || "",
      tags: tags,
      source: "affiliate-launchpad"
    };
    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SENDSHARK_API_KEY}`
        },
        body: JSON.stringify(payload)
      });
      const data = await resp.json().catch(() => ({}));
      return { ok: resp.ok, status: resp.status, data };
    } catch (e) {
      console.error("SendShark API error", e);
      return { ok: false, msg: e.message };
    }
  }

  async function generateTierPDF(name, tier) {
    try {
      setPdfReady(false);
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]);
      const { width, height} = page.getSize();
      
      const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      page.drawText('Affiliate Marketing Success Guide', {
        x: 50, y: height - 100, size: 24, font: boldFont, color: rgb(0, 0.2, 0.8)
      });
      
      page.drawText(`Welcome to ${SUBSCRIPTION_TIERS[tier]?.name || 'Affiliate Launchpad'}, ${name}!`, {
        x: 50, y: height - 140, size: 16, font: regularFont, color: rgb(0.2, 0.2, 0.2)
      });
      
      const content = tier === 'premium' ? [
        'PREMIUM AFFILIATE SUCCESS STRATEGIES:', '', '1. Advanced Revenue Optimization',
        '   • Multi-channel funnel strategies', '   • Advanced split testing methodologies',
        '   • Premium conversion tactics', '', '2. Data-Driven Decision Making',
        '   • Analytics setup and interpretation', '   • KPI tracking and optimization',
        '   • ROI maximization techniques', '', '3. Exclusive Network Access',
        '   • Premium member networking events', '   • 1-on-1 mentorship opportunities',
        '   • Insider industry connections', '', '4. Advanced Automation Systems',
        '   • Email sequence optimization', '   • Behavioral trigger campaigns',
        '   • Advanced customer segmentation', '', 'Your Premium Benefits:',
        '✓ Priority support (24h response)', '✓ Monthly 1-on-1 mentorship calls',
        '✓ Exclusive content library access', '✓ Advanced analytics dashboard',
        '✓ A/B testing tools', '', 'Ready to 10x your affiliate income? Let\'s get started!'
      ] : [
        'AFFILIATE MARKETING FUNDAMENTALS:', '', '1. Getting Started Right',
        '   • Choosing profitable niches', '   • Setting up tracking systems',
        '   • Building your first funnel', '', '2. Essential Tools & Resources',
        '   • Free traffic generation methods', '   • Content creation strategies',
        '   • Email list building basics', '', '3. Network Growth Strategies',
        '   • Connecting with other affiliates', '   • Sharing best practices',
        '   • Collaborative opportunities', '', '4. Monthly Action Plan',
        '   • Week 1: Setup and foundation', '   • Week 2: Content creation',
        '   • Week 3: Traffic generation', '   • Week 4: Optimization and scaling',
        '', 'Your Starter Benefits:', '✓ Access to affiliate network',
        '✓ Monthly group coaching calls', '✓ Basic analytics dashboard',
        '✓ Resource library access', '', 'Ready to upgrade to Premium for advanced features?'
      ];
      
      let yPos = height - 180;
      content.forEach((line) => {
        const isHeading = line.endsWith(':') && !line.startsWith(' ');
        const isCheckmark = line.startsWith('✓');
        const fontSize = isHeading ? 14 : 11;
        const font = isHeading ? boldFont : regularFont;
        const color = isCheckmark ? rgb(0, 0.6, 0) : rgb(0.1, 0.1, 0.1);
        page.drawText(line, { x: 50, y: yPos, size: fontSize, font, color });
        yPos -= isHeading ? 20 : 15;
      });
      
      page.drawText('Generated by Affiliate Launchpad • Your Success Starts Here', {
        x: 50, y: 50, size: 10, font: regularFont, color: rgb(0.5, 0.5, 0.5)
      });
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setPdfReady(true);
      return url;
    } catch (error) {
      console.error('PDF generation error:', error);
      return null;
    }
  }

  function upgradeTier(newTier) {
    setCurrentUserTier(newTier);
    setSelectedTier(newTier);
    localStorage.setItem('al_current_tier', newTier);
  }

  async function completePurchase(billingName) {
    const order = {
      id: "ORD-" + Date.now(),
      items: cart,
      buyer: { name: billingName || "Anonymous", email },
      date: new Date().toISOString(),
    };

    const downloads = [];
    for (const p of cart) {
      const pdfUrl = await generateSamplePDF(p);
      downloads.push({ productId: p.id, url: pdfUrl });
    }

    const orderRecord = { ...order, downloads };
    const orders = JSON.parse(localStorage.getItem("al_orders") || "[]");
    orders.push(orderRecord);
    localStorage.setItem("al_orders", JSON.stringify(orders));

    // Tag buyer in SendShark as 'buyer'
    try {
      await sendToSendShark({ email: order.buyer.email, first_name: order.buyer.name }, ["buyer"]);
    } catch (e) { console.warn(e); }

    setOrderSuccess(orderRecord);
    setCart([]);
    setShowCheckout(false);
  }

  async function generateSamplePDF(product) {
    const title = product.title;
    const content = [`${product.title}`, "", "Included:", ...product.bullets.map((b) => `- ${b}`), "", "Thank you for purchasing!"].join("\\n");
    const blob = new Blob([title + "\\n\\n" + content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    return url;
  }

  async function subscribe() {
    if (!email || !email.includes("@")) return alert("Please enter a valid email");
    if (!firstName || !firstName.trim()) return alert("Please enter your first name");
    
    setLoading(true);
    try {
      await sendToSendShark({ email, first_name: firstName.trim() }, ["affiliate-lead"]);
      setCurrentUserTier(selectedTier);
      setSubscribed(true);
      localStorage.setItem("al_subscribed", JSON.stringify({ email, firstName, tier: selectedTier, date: new Date().toISOString() }));
      localStorage.setItem('al_current_tier', selectedTier);
      
      // Generate action plan for new subscriber
      await generateActionPlan(selectedTier);
      
      const pdfUrl = await generateTierPDF(firstName.trim(), selectedTier);
      if (pdfUrl) {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `affiliate-success-guide-${selectedTier}.pdf`;
        link.click();
      }
      
      setEmail('');
      setFirstName('');
    } catch (error) {
      console.error('Subscription error:', error);
      alert('There was an issue. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <header className="max-w-6xl mx-auto flex items-center justify-between py-6">
        <div>
          <h1 className="text-3xl font-extrabold">Affiliate Launchpad</h1>
          <p className="text-sm text-gray-600">High-converting demo storefront for digital products</p>
        </div>
        <nav className="flex items-center gap-4">
          <button className="px-4 py-2 rounded shadow bg-white border" onClick={() => window.scrollTo({ top: 400, behavior: "smooth" })}>
            Products
          </button>
          <button className="px-4 py-2 rounded bg-indigo-600 text-white shadow" onClick={() => setShowCheckout(true)}>
            Checkout ({cart.length})
          </button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto grid gap-8 pb-12">
        <section className="grid md:grid-cols-2 gap-6 items-center bg-white p-8 rounded shadow">
          <div>
            <h2 className="text-2xl font-bold">Turn traffic into buyers — without the headache</h2>
            <p className="mt-3 text-gray-700">
              {subscribed 
                ? `Welcome to ${SUBSCRIPTION_TIERS[currentUserTier]?.name}!` 
                : "Choose your plan and start earning commissions today."}
            </p>

            {!subscribed ? (
              <>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {Object.values(SUBSCRIPTION_TIERS).map(tier => (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedTier(tier.id)}
                      className={`cursor-pointer p-4 rounded border-2 transition ${
                        selectedTier === tier.id 
                          ? 'border-indigo-600 bg-indigo-50' 
                          : 'border-gray-300 bg-white hover:border-indigo-300'
                      }`}
                    >
                      {tier.id === 'premium' && (
                        <span className="inline-block px-2 py-1 text-xs font-bold bg-emerald-500 text-white rounded mb-2">POPULAR</span>
                      )}
                      <h3 className="font-bold text-lg">{tier.name}</h3>
                      <p className="text-2xl font-extrabold text-indigo-600 my-2">${tier.price}<span className="text-sm text-gray-600 font-normal">/mo</span></p>
                      <ul className="text-xs space-y-1 text-gray-700">
                        {tier.features.slice(0, 3).map((f, i) => (
                          <li key={i}>✓ {f}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-3">
                  <input 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)} 
                    placeholder="Your first name" 
                    className="w-full px-4 py-2 border rounded" 
                  />
                  <input 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Your email address" 
                    className="w-full px-4 py-2 border rounded" 
                  />
                  <button 
                    onClick={subscribe} 
                    disabled={loading}
                    className="w-full px-4 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:bg-gray-400"
                  >
                    {loading ? 'Processing...' : `Join ${SUBSCRIPTION_TIERS[selectedTier].name} - $${SUBSCRIPTION_TIERS[selectedTier].price}/mo`}
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-sm font-bold bg-indigo-100 text-indigo-800">
                    {SUBSCRIPTION_TIERS[currentUserTier]?.name}
                  </span>
                  {pdfReady && pdfUrl && (
                    <a 
                      href={pdfUrl} 
                      download={`affiliate-success-guide-${currentUserTier}.pdf`}
                      className="text-sm text-indigo-600 underline"
                    >
                      📥 Download PDF Again
                    </a>
                  )}
                </div>
                
                {/* Action Plan button for all subscribed users */}
                <div className="mt-4">
                  <button 
                    onClick={() => {
                      if (!actionPlan) {
                        generateActionPlan(currentUserTier);
                      }
                      setShowActionPlan(true);
                    }}
                    className="w-full px-4 py-2 bg-emerald-600 text-white rounded font-semibold hover:bg-emerald-700 flex items-center justify-center gap-2"
                  >
                    📋 My Monthly Action Plan
                    {actionPlan && actionPlan.stats.progress > 0 && (
                      <span className="px-2 py-0.5 bg-emerald-800 rounded text-xs">{actionPlan.stats.progress}%</span>
                    )}
                  </button>
                </div>
                
                {currentUserTier === 'basic' && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded border border-indigo-200">
                    <h4 className="font-bold text-indigo-900 mb-2">🚀 Ready to Level Up?</h4>
                    <p className="text-sm text-gray-700 mb-3">Upgrade to {SUBSCRIPTION_TIERS.premium.name} for advanced tools and personal support.</p>
                    <button 
                      onClick={() => upgradeTier('premium')}
                      className="w-full px-4 py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700"
                    >
                      Upgrade to Premium - ${SUBSCRIPTION_TIERS.premium.price}/mo
                    </button>
                  </div>
                )}
                
                {currentUserTier === 'premium' && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button onClick={() => setShowAnalytics(true)} className="px-3 py-2 border rounded text-sm hover:bg-gray-50">📊 Analytics</button>
                    <button onClick={() => setShowContentLibrary(true)} className="px-3 py-2 border rounded text-sm hover:bg-gray-50">📚 Content</button>
                    <button onClick={() => setShowABTesting(true)} className="px-3 py-2 border rounded text-sm hover:bg-gray-50">🧪 A/B Tests</button>
                    <button onClick={() => setShowSupport(true)} className="px-3 py-2 border rounded text-sm hover:bg-gray-50">🚀 Support</button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="shadow rounded overflow-hidden">
            <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop" alt="hero" className="w-full h-64 object-cover" />
          </div>
        </section>

        <section id="products" className="grid gap-6">
          <h3 className="text-xl font-bold">Products</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {products.map((p) => (
              <article key={p.id} className={`rounded shadow p-4 ${p.color}`}>
                <img src={p.img} alt={p.title} className="w-full h-36 object-cover rounded" />
                <h4 className="mt-3 font-semibold">{p.title}</h4>
                <p className="text-sm text-gray-600 mt-1">${p.price.toFixed(2)}</p>
                <ul className="mt-2 text-sm space-y-1 text-gray-700">
                  {p.bullets.map((b, i) => (
                    <li key={i}>• {b}</li>
                  ))}
                </ul>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => addToCart(p)} className="flex-1 px-3 py-2 rounded bg-indigo-600 text-white">
                    Add to cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {showCheckout && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded shadow max-w-xl w-full p-6">
            <h4 className="font-bold text-lg">Checkout</h4>
            <p className="text-sm text-gray-600">This is a demo checkout — no real payment is processed.</p>
            <div className="mt-4">
              <label className="text-sm">Name</label>
              <input className="w-full px-3 py-2 border rounded mt-1" placeholder="Billing name" id="billingName" />
              <label className="text-sm mt-2 block">Email</label>
              <input className="w-full px-3 py-2 border rounded mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              <button onClick={() => setShowCheckout(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={() => completePurchase(document.getElementById("billingName").value)} className="px-4 py-2 bg-emerald-600 text-white rounded">Complete Purchase</button>
            </div>
          </div>
        </div>
      )}

      {orderSuccess && (
        <div className="fixed bottom-6 right-6 bg-white p-4 rounded shadow">
          <strong>Order complete</strong>
          <p className="text-sm text-gray-600">Order {orderSuccess.id} created. Download links:</p>
          <ul className="mt-2">
            {orderSuccess.downloads.map((d, i) => (
              <li key={i}><a className="underline text-sm" href={d.url} target="_blank" rel="noreferrer">Download {d.productId}</a></li>
            ))}
          </ul>
          <div className="mt-2 text-right">
            <button onClick={() => setOrderSuccess(null)} className="text-sm text-indigo-600">Close</button>
          </div>
        </div>
      )}

      {/* Premium Feature Modals */}
      {showAnalytics && currentUserTier === 'premium' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded shadow max-w-4xl w-full p-6 max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-xl">📊 Advanced Analytics Dashboard</h4>
              <button onClick={() => setShowAnalytics(false)} className="text-2xl">&times;</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-indigo-50 rounded border border-indigo-200">
                <h5 className="text-sm font-semibold text-indigo-700">Total Revenue</h5>
                <p className="text-2xl font-bold mt-1">$2,847.50</p>
                <p className="text-xs text-gray-600">+23% vs last month</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded border border-emerald-200">
                <h5 className="text-sm font-semibold text-emerald-700">Conversion Rate</h5>
                <p className="text-2xl font-bold mt-1">4.2%</p>
                <p className="text-xs text-gray-600">+0.8% improvement</p>
              </div>
              <div className="p-4 bg-amber-50 rounded border border-amber-200">
                <h5 className="text-sm font-semibold text-amber-700">Click-through Rate</h5>
                <p className="text-2xl font-bold mt-1">12.7%</p>
                <p className="text-xs text-gray-600">+2.1% this month</p>
              </div>
              <div className="p-4 bg-purple-50 rounded border border-purple-200">
                <h5 className="text-sm font-semibold text-purple-700">Active Campaigns</h5>
                <p className="text-2xl font-bold mt-1">7</p>
                <p className="text-xs text-gray-600">2 new this week</p>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded">
              <h5 className="font-semibold mb-3">Performance Trends</h5>
              <div className="h-48 bg-white rounded border flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-2">📈</div>
                  <div>Advanced Chart Visualization</div>
                  <div className="text-sm">Revenue trends & conversion tracking</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showContentLibrary && currentUserTier === 'premium' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded shadow max-w-4xl w-full p-6 max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-xl">📚 Exclusive Content Library</h4>
              <button onClick={() => setShowContentLibrary(false)} className="text-2xl">&times;</button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border rounded p-4">
                <h5 className="font-semibold text-indigo-700 mb-3">🎯 Advanced Strategies</h5>
                <ul className="text-sm space-y-2 text-gray-700">
                  <li>💎 High-Converting Email Templates</li>
                  <li>🚀 Advanced Funnel Architectures</li>
                  <li>📊 Data-Driven Optimization</li>
                  <li>🎪 Psychology of Persuasion</li>
                </ul>
                <button className="mt-3 w-full px-3 py-2 border rounded text-sm hover:bg-gray-50">Access Content</button>
              </div>
              <div className="border rounded p-4">
                <h5 className="font-semibold text-emerald-700 mb-3">📈 Case Studies</h5>
                <ul className="text-sm space-y-2 text-gray-700">
                  <li>💰 $10K/Month in 90 Days</li>
                  <li>📱 Mobile-First Campaign Success</li>
                  <li>🎯 Niche Market Domination</li>
                  <li>📊 Split-Test Victory Stories</li>
                </ul>
                <button className="mt-3 w-full px-3 py-2 border rounded text-sm hover:bg-gray-50">Read Cases</button>
              </div>
              <div className="border rounded p-4">
                <h5 className="font-semibold text-amber-700 mb-3">🛠️ Tools & Templates</h5>
                <ul className="text-sm space-y-2 text-gray-700">
                  <li>📋 Campaign Planning Worksheets</li>
                  <li>🎨 Landing Page Templates</li>
                  <li>📧 Email Sequence Blueprints</li>
                  <li>📊 Performance Tracking Sheets</li>
                </ul>
                <button className="mt-3 w-full px-3 py-2 border rounded text-sm hover:bg-gray-50">Download Tools</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showABTesting && currentUserTier === 'premium' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded shadow max-w-4xl w-full p-6 max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-xl">🧪 A/B Testing Lab</h4>
              <button onClick={() => setShowABTesting(false)} className="text-2xl">&times;</button>
            </div>
            <div className="space-y-4">
              <div className="border rounded p-4">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-semibold">Landing Page Headlines</h5>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded">RUNNING</span>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="p-3 bg-indigo-50 rounded">
                    <strong className="text-sm">Version A:</strong> "Start Earning Today"
                    <div className="text-indigo-600 font-bold mt-1">Conversion: 3.2%</div>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded">
                    <strong className="text-sm">Version B:</strong> "Double Your Income"
                    <div className="text-emerald-600 font-bold mt-1">Conversion: 4.7% 🏆</div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">Test Progress: 847 visitors | Statistical significance: 95%</p>
              </div>
              <div className="border rounded p-4">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-semibold">Email Subject Lines</h5>
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded">PENDING</span>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="p-3 bg-indigo-50 rounded">
                    <strong className="text-sm">Version A:</strong> "Your Exclusive Invitation"
                    <div className="text-indigo-600 font-bold mt-1">Open Rate: 22.1%</div>
                  </div>
                  <div className="p-3 bg-amber-50 rounded">
                    <strong className="text-sm">Version B:</strong> "[URGENT] Don't Miss Out"
                    <div className="text-amber-600 font-bold mt-1">Open Rate: 18.9%</div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">Need 200 more sends for significance</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSupport && currentUserTier === 'premium' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded shadow max-w-2xl w-full p-6 max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-xl">🚀 Priority Support Center</h4>
              <button onClick={() => setShowSupport(false)} className="text-2xl">&times;</button>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-emerald-50 rounded">
                <div className="text-2xl font-bold text-emerald-600">12h</div>
                <div className="text-xs text-gray-600">Avg Response Time</div>
              </div>
              <div className="text-center p-3 bg-indigo-50 rounded">
                <div className="text-2xl font-bold text-indigo-600">98%</div>
                <div className="text-xs text-gray-600">Satisfaction Rate</div>
              </div>
              <div className="text-center p-3 bg-amber-50 rounded">
                <div className="text-2xl font-bold text-amber-600">24/7</div>
                <div className="text-xs text-gray-600">Availability</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button className="px-4 py-3 bg-emerald-600 text-white rounded font-semibold hover:bg-emerald-700">💬 Live Chat Support</button>
              <button className="px-4 py-3 border rounded hover:bg-gray-50">📞 Schedule Call</button>
              <button className="px-4 py-3 border rounded hover:bg-gray-50">📧 Email Support</button>
              <button className="px-4 py-3 border rounded hover:bg-gray-50">📋 Submit Ticket</button>
            </div>
            <div className="p-4 bg-emerald-50 rounded border border-emerald-200">
              <h5 className="font-bold text-emerald-900 mb-2">🎯 1-on-1 Mentorship</h5>
              <p className="text-sm mb-3">You have <strong>2 sessions remaining</strong> this month</p>
              <button className="w-full px-4 py-2 bg-emerald-600 text-white rounded font-semibold hover:bg-emerald-700">Book Next Session</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Monthly Action Plan Modal - Available for both Basic and Premium */}
      {showActionPlan && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded shadow max-w-4xl w-full p-6 max-h-[85vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-bold text-xl">📋 Your Monthly Action Plan</h4>
                <p className="text-sm text-gray-600">{actionPlan?.month || 'Loading...'} • {actionPlan?.tier === 'premium' ? 'Premium' : 'Basic'} Tier</p>
              </div>
              <button onClick={() => setShowActionPlan(false)} className="text-2xl hover:text-gray-600">&times;</button>
            </div>
            
            {planLoading ? (
              <div className="py-12 text-center">
                <div className="text-5xl mb-4">🤖</div>
                <p className="text-gray-600">AI is generating your personalized action plan...</p>
              </div>
            ) : actionPlan ? (
              <>
                {/* Progress Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-indigo-50 rounded border border-indigo-200 text-center">
                    <div className="text-2xl font-bold text-indigo-600">{actionPlan.stats.total}</div>
                    <div className="text-xs text-gray-600">Total Tasks</div>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded border border-emerald-200 text-center">
                    <div className="text-2xl font-bold text-emerald-600">{actionPlan.stats.completed}</div>
                    <div className="text-xs text-gray-600">Completed</div>
                  </div>
                  <div className="p-4 bg-amber-50 rounded border border-amber-200 text-center">
                    <div className="text-2xl font-bold text-amber-600">{actionPlan.stats.progress}%</div>
                    <div className="text-xs text-gray-600">Progress</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                      style={{ width: `${actionPlan.stats.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    Last updated: {new Date(actionPlan.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
                
                {/* Weekly Task Lists */}
                <div className="space-y-6">
                  {[1, 2, 3, 4].map(week => {
                    const weekTasks = actionPlan.tasks.filter(t => t.week === week);
                    const completedInWeek = weekTasks.filter(t => t.completed).length;
                    
                    return (
                      <div key={week} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h5 className="font-bold text-lg">Week {week}</h5>
                          <span className="text-sm text-gray-600">
                            {completedInWeek}/{weekTasks.length} completed
                          </span>
                        </div>
                        <div className="space-y-2">
                          {weekTasks.map(task => (
                            <div 
                              key={task.id}
                              onClick={() => toggleTask(task.id)}
                              className={`flex items-start gap-3 p-3 rounded cursor-pointer transition ${
                                task.completed 
                                  ? 'bg-emerald-50 border border-emerald-200' 
                                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                              }`}
                            >
                              <div className="mt-0.5">
                                {task.completed ? (
                                  <span className="text-emerald-600 text-xl">✓</span>
                                ) : (
                                  <span className="text-gray-400 text-xl">○</span>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                  {task.task}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-xs px-2 py-0.5 rounded ${
                                    task.priority === 'high' ? 'bg-red-100 text-red-700' :
                                    task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {task.priority}
                                  </span>
                                  {task.id >= 13 && (
                                    <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                                      Premium
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Action Buttons */}
                <div className="mt-6 flex gap-3">
                  <button 
                    onClick={regeneratePlan}
                    disabled={planLoading}
                    className="flex-1 px-4 py-2 border rounded hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    🔄 Regenerate Plan
                  </button>
                  <button 
                    onClick={() => setShowActionPlan(false)}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Close
                  </button>
                </div>
                
                {/* Premium Upgrade CTA for Basic users */}
                {actionPlan.tier === 'basic' && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded border border-purple-200">
                    <h5 className="font-bold text-purple-900 mb-2">🚀 Get 4 Additional Premium Tasks</h5>
                    <p className="text-sm text-gray-700 mb-3">Upgrade to Premium for personalized mentorship, A/B testing, automation, and advanced analytics tasks!</p>
                    <button 
                      onClick={() => {
                        upgradeTier('premium');
                        setShowActionPlan(false);
                      }}
                      className="w-full px-4 py-2 bg-purple-600 text-white rounded font-semibold hover:bg-purple-700"
                    >
                      Upgrade to Premium - ${SUBSCRIPTION_TIERS.premium.price}/mo
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 text-center">
                <div className="text-5xl mb-4">📋</div>
                <p className="text-gray-600 mb-4">No action plan yet</p>
                <button 
                  onClick={() => generateActionPlan(currentUserTier)}
                  className="px-6 py-3 bg-emerald-600 text-white rounded font-semibold hover:bg-emerald-700"
                >
                  Generate My Action Plan
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
