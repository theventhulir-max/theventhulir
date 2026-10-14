/**
 * VENTHULIR — LUXURY ORGANIC WHATSAPP NOTIFICATION ENGINE
 * High-converting, professional transactional WhatsApp messaging templates with rich emojis & clean formatting
 */

/**
 * Normalizes an Indian or international phone number for WhatsApp wa.me links
 * @param {string} rawPhone 
 * @returns {string} Clean numeric phone with country code (defaults to 91)
 */
export function formatWhatsAppPhone(rawPhone) {
  if (!rawPhone) return '';
  let clean = String(rawPhone).replace(/\D/g, '');

  if (clean.length === 10) {
    clean = '91' + clean;
  }
  if (clean.length === 11 && clean.startsWith('0')) {
    clean = '91' + clean.slice(1);
  }

  return clean;
}

/**
 * Builds a professional English WhatsApp message based on order status
 * @param {object} order - The order document
 * @param {string} status - 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled'
 * @param {object} extras - Optional trackingNumber, courierPartner
 * @returns {string} Professional English message text
 */
export function generateWhatsAppMessage(order, status = 'Confirmed', extras = {}) {
  if (!order) return '';

  const customerName = order.customerName || order.shippingAddress?.fullName || 'Valued Customer';
  const orderRef = (order.orderId || order._id || 'ORDER').toString().slice(-8).toUpperCase();
  const totalAmount = order.totalAmount || order.amount || 0;
  const paymentMethod = order.paymentMethod || 'Cash on Delivery';

  const items = order.items || order.orderItems || [];
  const itemsSummary = items.length > 0
    ? items
        .map((item) => {
          const name = item.name || 'Organic Product';
          const qty = item.quantity || 1;
          const variant = item.variant?.label || item.variant || '';
          return `  ▫️ *${name}*${variant ? ` (${variant})` : ''} × *${qty}*`;
        })
        .join('\n')
    : '  ▫️ Fresh Farm Heritage Items';

  const addressObj = order.deliveryAddress || order.shippingAddress || {};
  const deliveryAddress = [
    addressObj.address || addressObj.street,
    addressObj.city,
    addressObj.state,
    addressObj.zipCode
  ].filter(Boolean).join(', ') || 'Address on file';

  const normalizedStatus = (status || order.status || 'Confirmed').toLowerCase();
  const trackingUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/profile`;

  switch (normalizedStatus) {
    case 'shipped': {
      const trackingNumber = extras.trackingNumber || order.trackingNumber || '';
      const courierPartner = extras.courierPartner || order.courierPartner || 'Express Courier';
      const trackingLine = trackingNumber
        ? `\n▫️ *Courier Partner:* ${courierPartner} 🚚\n▫️ *Tracking AWB:* \`${trackingNumber}\` 🔍`
        : `\n▫️ *Courier Partner:* ${courierPartner} 🚚`;

      return `🌿 *VENTHULIR ORGANIC HARVEST* 🌿
_Pure • Traditional • Wood Cold-Pressed_
━━━━━━━━━━━━━━━━━━━━━

Namaste *${customerName}* 🙏,

🚚 *YOUR ORDER HAS BEEN DISPATCHED!*
Great news! Your fresh farm harvest is en route to your doorstep.

📦 *SHIPMENT SUMMARY:*
▫️ *Order ID:* #${orderRef}
▫️ *Total Payable:* ₹${totalAmount} (${paymentMethod})${trackingLine}
▫️ *Delivery To:* 📍 ${deliveryAddress}

⏳ *Estimated Delivery:* 2 to 3 Business Days

📍 *Track Live Order Status:*
👉 ${trackingUrl}

━━━━━━━━━━━━━━━━━━━━━
💬 *Need assistance?* Just reply directly to this message.
_Thank you for choosing pure chemical-free living!_ 🌾✨

Warm regards,
*Team Venthulir* 🌱`;
    }

    case 'delivered': {
      return `🌿 *VENTHULIR ORGANIC HARVEST* 🌿
_Pure • Traditional • Wood Cold-Pressed_
━━━━━━━━━━━━━━━━━━━━━

Namaste *${customerName}* 🙏,

🎉 *ORDER DELIVERED SUCCESSFULLY!*
Your Venthulir harvest package (*#${orderRef}*) has arrived at your address.

We hope you and your family enjoy the authentic taste, deep aroma, and wholesome nutrition of our single-origin farm harvest! ✨

💚 *How was your harvest?*
Your feedback means the world to our traditional farming collective. Reply to this chat to share your experience with us! 💬

🛒 *Order Fresh Heritage Produce Again:*
👉 https://venthulir.com/products

Thank you for supporting indigenous farmers! 🌾🙏

Warm regards,
*Team Venthulir* 🌱`;
    }

    case 'cancelled': {
      return `🌿 *VENTHULIR ORGANIC HARVEST* 🌿
━━━━━━━━━━━━━━━━━━━━━

Dear *${customerName}*,

⚠️ *ORDER UPDATE: CANCELLED*
Your order *#${orderRef}* (₹${totalAmount}) has been cancelled as per request.

If this was made in error or if you need any help with refunds or rescheduling, please reply directly to this message.

We look forward to serving you again soon! 🌿

Warm regards,
*Team Venthulir* 🌱`;
    }

    case 'pending':
    case 'confirmed':
    default: {
      return `🌿 *VENTHULIR ORGANIC HARVEST* 🌿
_Pure • Traditional • Heritage Farm Produce_
━━━━━━━━━━━━━━━━━━━━━

Namaste *${customerName}* 🙏,

✅ *ORDER CONFIRMED SUCCESSFULLY!*
Thank you for choosing certified, chemical-free living from our heritage farms.

📋 *ORDER SUMMARY:*
▫️ *Order Reference:* #${orderRef}
▫️ *Total Amount:* ₹${totalAmount} (${paymentMethod})
▫️ *Delivery Address:* 📍 ${deliveryAddress}

🛒 *ITEMS BOOKED:*
${itemsSummary}

🚚 *DISPATCH UPDATE:*
Our farm team is hand-packing your batch with care under strict hygiene standards. It will be dispatched within *24–48 hours*.

📍 *Track Live Status Online:*
👉 ${trackingUrl}

━━━━━━━━━━━━━━━━━━━━━
💬 Have any special delivery instructions? Just reply to this message!
_Thank you for supporting traditional, sustainable farming._ 🌾✨

Warm regards,
*Team Venthulir* 🌱`;
    }
  }
}

/**
 * Creates the direct wa.me URL for the order notification
 * @param {object} order 
 * @param {string} status 
 * @param {object} extras 
 * @returns {string} WhatsApp direct launch link
 */
export function getWhatsAppOrderUrl(order, status = 'Confirmed', extras = {}) {
  const rawPhone = order?.phone || order?.shippingAddress?.phone || '';
  const cleanPhone = formatWhatsAppPhone(rawPhone);
  const message = generateWhatsAppMessage(order, status, extras);

  // Use direct api.whatsapp.com to prevent wa.me 302 redirect from corrupting UTF-8 emoji bytes on Windows
  const encodedText = encodeURIComponent(message);

  if (!cleanPhone) {
    return `https://api.whatsapp.com/send?text=${encodedText}`;
  }

  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
}

/**
 * VENTHULIR Primary WhatsApp ordering number
 */
export const VENTHULIR_WHATSAPP_NUMBER = '919486145001';

/**
 * Creates direct WhatsApp order link for a single product (Buy Now)
 */
export function getWhatsAppProductOrderUrl(product, variant = null, quantity = 1) {
  const phone = VENTHULIR_WHATSAPP_NUMBER;
  const name = product?.name || 'Organic Product';
  const variantLabel = variant?.label ? ` (${variant.label})` : '';
  const price = variant?.price ?? product?.price ?? 0;
  const total = price * (quantity || 1);
  const prodId = product?.slug || product?._id || product?.id || '';
  const prodUrl = prodId ? `https://theventhulir.com/products/${prodId}` : 'https://theventhulir.com';

  const message = `🌿 *VENTHULIR ORGANIC ORDER* 🌿
_Pure • Traditional • Wood Cold-Pressed_
━━━━━━━━━━━━━━━━━━━━━

Hello Venthulir, I would like to order:

📦 *Product:* ${name}${variantLabel}
🔢 *Quantity:* ${quantity}
💰 *Price:* ₹${total}${quantity > 1 ? ` (₹${price} each)` : ''}
🔗 *Product Link:* ${prodUrl}

Please confirm availability and dispatch details! 🙏`;

  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
}

/**
 * Creates direct WhatsApp order link for cart items
 */
export function getWhatsAppCartOrderUrl(cartItems = [], grandTotal = 0) {
  const phone = VENTHULIR_WHATSAPP_NUMBER;
  const itemsText = (cartItems || [])
    .map(item => {
      const v = item.variant?.label ? ` (${item.variant.label})` : '';
      return `▫️ *${item.name}*${v} × ${item.quantity} = ₹${(item.price || 0) * item.quantity}`;
    })
    .join('\n');

  const message = `🌿 *VENTHULIR ORGANIC ORDER* 🌿
_Pure • Traditional • Wood Cold-Pressed_
━━━━━━━━━━━━━━━━━━━━━

Hello Venthulir, I would like to order the following items from my cart:

${itemsText || '▫️ Fresh Organic Harvest Items'}

💰 *Total Amount:* ₹${grandTotal}

Please confirm my order and share delivery details! 🙏`;

  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
}

