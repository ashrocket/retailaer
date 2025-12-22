import type { APIRoute } from 'astro';

export const prerender = false;

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  role?: string;
  interest?: string;
  message: string;
  consent: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data: ContactFormData = await request.json();

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'company', 'message'];
    for (const field of requiredFields) {
      if (!data[field as keyof ContactFormData]) {
        return new Response(JSON.stringify({ error: `${field} is required` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Format email content
    const emailSubject = `New Contact: ${data.interest || 'General Inquiry'} from ${data.company}`;

    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${data.firstName} ${data.lastName}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
          <td style="padding: 10px; border: 1px solid #ddd;"><a href="mailto:${data.email}">${data.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Company</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${data.company}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Role</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${data.role || 'Not specified'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Interest</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${data.interest || 'Not specified'}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Message</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${data.message.replace(/\n/g, '<br>')}</td>
        </tr>
      </table>
      <p style="margin-top: 20px; color: #666; font-size: 12px;">
        Submitted at: ${new Date().toISOString()}<br>
        Consent given: ${data.consent ? 'Yes' : 'No'}
      </p>
    `;

    const emailText = `
New Contact Form Submission

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Company: ${data.company}
Role: ${data.role || 'Not specified'}
Interest: ${data.interest || 'Not specified'}

Message:
${data.message}

---
Submitted: ${new Date().toISOString()}
Consent given: ${data.consent ? 'Yes' : 'No'}
    `.trim();

    // Send email via MailChannels (free for Cloudflare)
    const emailResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: 'sales@retailaer.com', name: 'Retailaer Sales' }]
        }],
        from: {
          email: 'contact@retailaer.com',
          name: 'Retailaer Contact Form'
        },
        reply_to: {
          email: data.email,
          name: `${data.firstName} ${data.lastName}`
        },
        subject: emailSubject,
        content: [
          {
            type: 'text/plain',
            value: emailText
          },
          {
            type: 'text/html',
            value: emailHtml
          }
        ]
      })
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('MailChannels error:', emailResponse.status, errorText);
      // Return error for debugging - we can change this back later
      return new Response(JSON.stringify({
        success: false,
        error: `Email failed: ${emailResponse.status} - ${errorText}`
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Thank you for your message. We will get back to you within 24 hours.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process your request. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
