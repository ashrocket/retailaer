import type { APIRoute } from 'astro';
import { EmailMessage } from 'cloudflare:email';
import { createMimeMessage } from 'mimetext';

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

export const POST: APIRoute = async ({ request, locals }) => {
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

    // Send via Cloudflare Email Routing
    const runtime = locals.runtime;
    const emailBinding = runtime?.env?.EMAIL;

    if (emailBinding) {
      try {
        const msg = createMimeMessage();
        msg.setSender({ name: 'Retailaer Website', addr: 'contact@retailaer.com' });
        msg.setRecipient('sales@retailaer.com');
        msg.setHeader('Reply-To', { name: `${data.firstName} ${data.lastName}`, addr: data.email });
        msg.setSubject(emailSubject);
        msg.addMessage({ contentType: 'text/html', data: emailHtml });

        const message = new EmailMessage('contact@retailaer.com', 'sales@retailaer.com', msg.asRaw());
        await emailBinding.send(message);
      } catch (emailError) {
        console.error('Email send error:', emailError);
        // Log submission as fallback
        console.log('=== CONTACT FORM SUBMISSION (email failed) ===');
        console.log(JSON.stringify(data, null, 2));
        console.log('==============================================');
      }
    } else {
      // Log submission if email binding not configured
      console.log('=== CONTACT FORM SUBMISSION ===');
      console.log('EMAIL binding not configured - logging submission');
      console.log(JSON.stringify(data, null, 2));
      console.log('===============================');
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
