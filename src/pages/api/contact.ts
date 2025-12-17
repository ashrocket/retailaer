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

// Get Microsoft Graph access token using client credentials
async function getMsGraphToken(tenantId: string, clientId: string, clientSecret: string): Promise<string> {
  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'https://graph.microsoft.com/.default',
      grant_type: 'client_credentials',
    }),
  });

  if (!response.ok) {
    throw new Error(`Token request failed: ${await response.text()}`);
  }

  const data = await response.json();
  return data.access_token;
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

    // Get Microsoft Graph credentials
    const runtime = locals.runtime;
    const tenantId = runtime?.env?.MS_TENANT_ID || import.meta.env.MS_TENANT_ID;
    const clientId = runtime?.env?.MS_CLIENT_ID || import.meta.env.MS_CLIENT_ID;
    const clientSecret = runtime?.env?.MS_CLIENT_SECRET || import.meta.env.MS_CLIENT_SECRET;
    // Use sales@retailaer.com as both sender and recipient
    const salesEmail = 'sales@retailaer.com';

    if (tenantId && clientId && clientSecret) {
      try {
        const accessToken = await getMsGraphToken(tenantId, clientId, clientSecret);

        // Send email via Microsoft Graph
        const sendMailUrl = `https://graph.microsoft.com/v1.0/users/${salesEmail}/sendMail`;

        const emailResponse = await fetch(sendMailUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: {
              subject: emailSubject,
              body: {
                contentType: 'HTML',
                content: emailHtml,
              },
              toRecipients: [
                { emailAddress: { address: salesEmail } }
              ],
              replyTo: [
                { emailAddress: { address: data.email, name: `${data.firstName} ${data.lastName}` } }
              ],
            },
          }),
        });

        if (!emailResponse.ok) {
          const errorText = await emailResponse.text();
          console.error('Microsoft Graph error:', errorText);
        }
      } catch (emailError) {
        console.error('Email send error:', emailError);
        console.log('=== CONTACT FORM SUBMISSION (email failed) ===');
        console.log(JSON.stringify(data, null, 2));
        console.log('==============================================');
      }
    } else {
      // Log submission if MS Graph not configured
      console.log('=== CONTACT FORM SUBMISSION ===');
      console.log('Microsoft Graph not configured - logging submission');
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
