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

    // Get environment variables
    const runtime = locals.runtime;
    const resendApiKey = runtime?.env?.RESEND_API_KEY || import.meta.env.RESEND_API_KEY;

    // Format the email content
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

    // If Resend API key is configured, send email
    if (resendApiKey) {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Retailaer Website <noreply@retailaer.com>',
          to: ['sales@retailaer.com'],
          reply_to: data.email,
          subject: emailSubject,
          html: emailHtml,
        }),
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error('Resend API error:', errorText);
        // Don't fail the request - log the data anyway
      }
    } else {
      // Log the submission if no email service configured
      console.log('=== CONTACT FORM SUBMISSION ===');
      console.log('No RESEND_API_KEY configured - logging submission:');
      console.log(JSON.stringify(data, null, 2));
      console.log('===============================');
    }

    // Return success
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
