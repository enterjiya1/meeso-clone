const sendJson = (res, status, payload) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
};

const readJsonBody = (req) =>
  new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 100_000) reject(new Error('Request body is too large'));
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });

const normalizePhone = (value) => {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`;
  return undefined;
};

const createHandler = ({ keyId, keySecret }) => async (req, res, next) => {
  if (req.url !== '/api/razorpay/payment-link') return next();
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Method not allowed' });

  if (!keyId || !keySecret) {
    return sendJson(res, 503, {
      error: 'Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env, then restart the server.'
    });
  }

  try {
    const input = await readJsonBody(req);
    const amount = Number(input.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return sendJson(res, 400, { error: 'A valid payment amount is required.' });
    }

    const referenceId = String(input.orderId || `ETH-${Date.now()}`)
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .slice(0, 40);
    const phone = normalizePhone(input.customer?.phone);
    const email = String(input.customer?.email || '').trim() || undefined;
    const name = String(input.customer?.name || '').trim().slice(0, 50) || undefined;

    const customer = {};
    if (name) customer.name = name;
    if (phone) customer.contact = phone;
    if (email) customer.email = email;

    const requestBody = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      accept_partial: false,
      reference_id: referenceId,
      description: String(input.description || `Ethnicora order ${referenceId}`).slice(0, 2048),
      notify: { sms: false, email: false },
      reminder_enable: false,
      notes: { order_id: referenceId }
    };
    if (Object.keys(customer).length) requestBody.customer = customer;

    const authorization = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/payment_links', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authorization}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok || !result.short_url) {
      return sendJson(res, response.status || 502, {
        error: result.error?.description || 'Razorpay could not create the payment link.'
      });
    }

    return sendJson(res, 201, {
      id: result.id,
      shortUrl: result.short_url,
      amount: result.amount,
      status: result.status
    });
  } catch (error) {
    return sendJson(res, 500, { error: error.message || 'Unable to create payment link.' });
  }
};

export const razorpayPaymentLinkPlugin = (options) => {
  const handler = createHandler(options);
  return {
    name: 'ethnicora-razorpay-payment-links',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    }
  };
};
