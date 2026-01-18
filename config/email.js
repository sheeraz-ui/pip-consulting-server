import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export async function sendEmail({ to, subject, html, text }) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@pipconsulting.com',
      to,
      subject,
      text,
      html
    })
    console.log('Email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Email send failed:', error.message)
    return { success: false, error: error.message }
  }
}

export async function sendContactNotification(contact) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e3a5f;">New Contact Form Submission</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Phone:</strong> ${contact.phone || 'Not provided'}</p>
        <p><strong>Company:</strong> ${contact.company || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${contact.subject || 'General Inquiry'}</p>
        <p><strong>Service Interest:</strong> ${contact.service_interest || 'Not specified'}</p>
        <hr style="border: 1px solid #dee2e6; margin: 20px 0;">
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${contact.message}</p>
      </div>
      <p style="color: #6c757d; font-size: 12px; margin-top: 20px;">
        This email was sent from the PIP Consulting website contact form.
      </p>
    </div>
  `

  return sendEmail({
    to: process.env.SMTP_USER,
    subject: `New Contact: ${contact.subject || 'General Inquiry'} - ${contact.name}`,
    html,
    text: `New contact from ${contact.name} (${contact.email}): ${contact.message}`
  })
}

export async function sendApplicationNotification(application, job) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e3a5f;">New Job Application</h2>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
        <h3 style="color: #2c5282;">${job.title}</h3>
        <p><strong>Applicant:</strong> ${application.name}</p>
        <p><strong>Email:</strong> ${application.email}</p>
        <p><strong>Phone:</strong> ${application.phone || 'Not provided'}</p>
        <p><strong>Experience:</strong> ${application.experience_years || 'Not specified'} years</p>
        <p><strong>Current Company:</strong> ${application.current_company || 'Not provided'}</p>
        <p><strong>Current Role:</strong> ${application.current_role || 'Not provided'}</p>
        <p><strong>Expected Salary:</strong> ${application.expected_salary || 'Not specified'}</p>
        <p><strong>Notice Period:</strong> ${application.notice_period || 'Not specified'}</p>
        ${application.linkedin_url ? `<p><strong>LinkedIn:</strong> <a href="${application.linkedin_url}">${application.linkedin_url}</a></p>` : ''}
        ${application.portfolio_url ? `<p><strong>Portfolio:</strong> <a href="${application.portfolio_url}">${application.portfolio_url}</a></p>` : ''}
        <hr style="border: 1px solid #dee2e6; margin: 20px 0;">
        <p><strong>Cover Letter:</strong></p>
        <p style="white-space: pre-wrap;">${application.cover_letter || 'Not provided'}</p>
      </div>
    </div>
  `

  return sendEmail({
    to: process.env.SMTP_USER,
    subject: `New Application: ${job.title} - ${application.name}`,
    html,
    text: `New application for ${job.title} from ${application.name} (${application.email})`
  })
}

export async function sendApplicationConfirmation(application, job) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e3a5f;">Thank You for Your Application</h2>
      <p>Dear ${application.name},</p>
      <p>Thank you for applying for the <strong>${job.title}</strong> position at PIP Consulting.</p>
      <p>We have received your application and our team will review it carefully. If your qualifications match our requirements, we will be in touch to schedule the next steps.</p>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #2c5282; margin-top: 0;">Position Details</h3>
        <p><strong>Title:</strong> ${job.title}</p>
        <p><strong>Department:</strong> ${job.department || 'N/A'}</p>
        <p><strong>Location:</strong> ${job.location || 'N/A'}</p>
      </div>
      <p>Best regards,<br>The PIP Consulting Team</p>
      <hr style="border: 1px solid #dee2e6; margin: 20px 0;">
      <p style="color: #6c757d; font-size: 12px;">
        This is an automated email. Please do not reply directly to this message.
      </p>
    </div>
  `

  return sendEmail({
    to: application.email,
    subject: `Application Received: ${job.title} - PIP Consulting`,
    html,
    text: `Thank you for applying for ${job.title} at PIP Consulting. We will review your application and get back to you soon.`
  })
}

export default transporter

