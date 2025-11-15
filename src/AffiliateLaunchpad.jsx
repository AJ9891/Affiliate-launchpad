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

const SENDSHARK_API_URL = import.meta.env.VITE_SENDSHARK_API_URL || "https://api.sendshark.com/v1";
const SENDSHARK_API_KEY = import.meta.env.VITE_SENDSHARK_API_KEY || "57ca8faec828e66810724911ee7c798e7";
const SENDSHARK_LIST_ID = import.meta.env.VITE_SENDSHARK_LIST_ID || "Launchpad";
const FROM_NAME = import.meta.env.VITE_FROM_NAME || "Abbigal";
const FROM_EMAIL = import.meta.env.VITE_FROM_EMAIL || "irwinabby004@gmail.com";
const LEAD_MAGNET_LINK = import.meta.env.VITE_LEAD_MAGNET_DOWNLOAD || "#";

export default function AffiliateLaunchpad() {
  const sampleProducts = [
    {
      id: "ebook-1",
      title: "Fix It Fast: Home Repair Basics",
      price: 17,
      bullets: ["Plumbing quick fixes", "Wall patching checklist", "Tool guide"],
      img: "https://images.unsplash.com/photo-1581574208731-6a9b2c3b7a2b?q=80&w=800&auto=format&fit=crop",
      color: "bg-amber-50",
    },
    {
      id: "ebook-2",
      title: "Auto Care for Beginners",
      price: 27,
      bullets: ["MAF sensor & diagnostics", "Oil change walkthrough", "Safety checklist"],
      img: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=800&auto=format&fit=crop",
      color: "bg-sky-50",
    },
    {
      id: "bundle-1",
      title: "DIY Repair Academy Bundle",
      price: 47,
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
      const pdfInfo = await generateSamplePDF(p);
      downloads.push({ productId: p.id, url: pdfInfo.url, filename: pdfInfo.filename });
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
    const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]);
    const { width, height } = page.getSize();

    // Try to embed cover image
    let cover;
    try {
      const resp = await fetch(product.img, { mode: 'cors' });
      const buf = new Uint8Array(await resp.arrayBuffer());
      const isPng = buf.length > 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47 && buf[4] === 0x0D && buf[5] === 0x0A && buf[6] === 0x1A && buf[7] === 0x0A;
      cover = isPng ? await pdfDoc.embedPng(buf) : await pdfDoc.embedJpg(buf);
    } catch (e) {
      // If image fetch or embed fails, continue without cover
      cover = null;
    }

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    let y = height - 40;

    if (cover) {
      const maxW = width - 100; // 50pt margins left/right
      const maxH = 300; // cap cover height
      const scale = Math.min(maxW / cover.width, maxH / cover.height);
      const imgW = cover.width * scale;
      const imgH = cover.height * scale;
      page.drawImage(cover, { x: (width - imgW) / 2, y: y - imgH, width: imgW, height: imgH });
      y = y - imgH - 24;
    }

    page.drawText(product.title, { x: 50, y, size: 22, font, color: rgb(0.1, 0.1, 0.1) });
    y -= 32;
    page.drawText('Included:', { x: 50, y, size: 14, font, color: rgb(0, 0, 0) });
    y -= 20;
    product.bullets.forEach((b) => {
      page.drawText('\u2022 ' + b, { x: 62, y, size: 12, font });
      y -= 16;
    });
    y -= 20;
    page.drawText('Thank you for purchasing!', { x: 50, y, size: 12, font, color: rgb(0, 0.2, 0) });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    return { url, filename: `${product.id}.pdf` };
  }

  // ...existing code...
}
