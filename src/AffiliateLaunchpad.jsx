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
  const [subscribed, setSubscribed] = useState(false);
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("al_cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("al_cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(product) {
    setCart((c) => [...c, product]);
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

    try {
      const buyerRes = await sendToSendShark({ email: order.buyer.email, first_name: order.buyer.name }, ["buyer"]);
      if (!buyerRes.ok) {
        orderRecord.apiError = "Could not tag buyer in SendShark.";
      }
    } catch (e) { 
      console.warn(e); 
      orderRecord.apiError = "SendShark error during purchase.";
    }

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
    setLoading(true);
    setApiError(null);
    setSubscribed(true);
    localStorage.setItem("al_subscribed", JSON.stringify({ email, date: new Date().toISOString() }));
    const res = await sendToSendShark({ email, first_name: "" }, ["affiliate-lead"]);
    if (res.ok) {
      window.open(LEAD_MAGNET_LINK, "_blank");
    } else {
      setApiError("Subscription failed. Please try again later.");
    }
    setLoading(false);
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
              This demo captures emails, adds them to your SendShark list, and triggers your automation sequence.
            </p>
            <ul className="mt-4 grid gap-2 text-sm">
              <li>• Email capture with SendShark integration</li>
              <li>• Add to cart + mock checkout</li>
              <li>• Client-side downloads created per product</li>
            </ul>

            <div className="mt-6 flex gap-3">
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your email" className="px-4 py-2 border rounded w-72" />
              <button onClick={subscribe} className="px-4 py-2 rounded bg-emerald-600 text-white">
                Get the Affiliate Quickstart Guide
              </button>
            </div>
            {loading && <p className="mt-2 text-sm text-gray-500">Processing...</p>}
            {subscribed && !apiError && <p className="mt-2 text-sm text-green-700">Subscribed! Check SendShark to confirm the new contact.</p>}
            {apiError && <p className="mt-2 text-sm text-red-600">{apiError}</p>}
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
          {orderSuccess.apiError && <p className="text-xs text-red-600 mt-1">{orderSuccess.apiError}</p>}
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
    </div>
  );
}
