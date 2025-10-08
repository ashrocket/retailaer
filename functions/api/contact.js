/**
 * Cloudflare Pages Function - Contact Form Handler
 * Endpoint: /api/contact
 */

export async function onRequestPost(context) {
  try {
    // Parse form data
    const formData = await context.request.formData();

    const name = formData.get('name');
    const email = formData.get('email');
    const company = formData.get('company');
    const role = formData.get('role') || 'Not specified';
    const interest = formData.get('interest') || 'Not specified';
    const message = formData.get('message') || 'No message provided';

    // Validate required fields
    if (!name || !email || !company) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid email address'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Prepare email content
    const emailContent = `
New Contact Form Submission from RetailAer Website

From: ${name} (${email})
Company: ${company}
Role: ${role}
Interest: ${interest}

Message:
${message}

---
Submitted: ${new Date().toISOString()}
IP: ${context.request.headers.get('CF-Connecting-IP') || 'Unknown'}
    `.trim();

    // Send email using MailChannels (free for Cloudflare)
    console.log('Contact form submission:', {
      name,
      email,
      company,
      role,
      interest,
      message
    });

    // Send email via MailChannels
    const emailResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: 'sales@retailair.com', name: 'RetailAer Sales' }],
          reply_to: { email: email, name: name }
        }],
        from: {
          email: 'noreply@retailaer.us',
          name: 'RetailAer Contact Form'
        },
        subject: `New Contact Form: ${name} from ${company}`,
        content: [{
          type: 'text/plain',
          value: emailContent
        }]
      })
    });

    if (!emailResponse.ok) {
      console.error('Email send failed:', await emailResponse.text());
      // Don't throw error - still show success to user even if email fails
    }

    // Return success response with redirect
    return new Response(null, {
      status: 303,
      headers: {
        'Location': '/contact-figma.html?success=true'
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);

    return new Response(JSON.stringify({
      success: false,
      error: 'An error occurred. Please try again.'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// Handle OPTIONS for CORS preflight
export async function onRequestOptions(context) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
