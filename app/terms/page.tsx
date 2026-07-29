"use client"
import React from 'react'
import SiteHeader from '../../components/SiteHeader'

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: '1. Acceptance of Terms',
    body: (
      <p>
        By accessing or using the Wambaza platform, including the anonymous AI chat feature and the
        published article library, you agree to the terms outlined on this page. If you do not agree,
        please do not use the platform.
      </p>
    ),
  },
  {
    title: '2. Purpose and Nature of the Service',
    body: (
      <p>
        Wambaza is an AI-powered platform providing general information on adolescent sexual and
        reproductive health (ASRH) topics in English, Kinyarwanda, and Luganda, intended for adolescents
        in Rwanda and Uganda. Wambaza is an informational tool, not a substitute for professional medical
        advice, diagnosis, or treatment.
      </p>
    ),
  },
  {
    title: '3. Important Disclaimer: AI-Generated Responses',
    body: (
      <p>
        Responses provided through the AI chat feature are generated automatically and may, on occasion,
        be inaccurate, incomplete, or address a topic other than the one asked. Users should not rely
        solely on chat responses for medical decisions and are encouraged to consult a qualified health
        professional for any specific health concern. Wambaza and its developers accept no liability for
        decisions made based on AI-generated content.
      </p>
    ),
  },
  {
    title: '4. Acceptable Use',
    body: (
      <p>
        Users agree not to use the platform to submit harmful, abusive, or illegal content, to attempt to
        disrupt or reverse-engineer the underlying model or platform, or to misuse the anonymous chat
        feature to harass others. Health professional accounts (used for publishing articles) may only be
        used by the individual to whom the account was issued, and are provisioned solely by platform
        administrators.
      </p>
    ),
  },
  {
    title: '5. Age and Vulnerable User Considerations',
    body: (
      <p>
        Wambaza is designed for use by adolescents. No age verification or account creation is required to
        use the anonymous chat feature or read published articles, in order to preserve user privacy and
        reduce barriers to access. Given the sensitivity of ASRH content and the platform's target
        audience, content is written in plain, non-judgmental, age-appropriate language, and all AI
        responses are subject to the disclaimer in Section 3.
      </p>
    ),
  },
  {
    title: '6. Data We Collect',
    body: (
      <ul className="space-y-3">
        <li>
          <span className="font-semibold text-gray-800">Anonymous chat users: </span>
          No personally identifiable information (name, email, phone number, location, or account
          details) is collected. Questions submitted to the chat feature are processed to generate a
          response but are not linked to any identifying information about the user.
        </li>
        <li>
          <span className="font-semibold text-gray-800">Article readers: </span>
          No account or personal data is required to browse or read published articles.
        </li>
        <li>
          <span className="font-semibold text-gray-800">Registered accounts (health professional authors and administrators): </span>
          Name, email address, and a securely hashed password are collected to enable authenticated
          access to the content management system. Administrator accounts are created directly by
          platform administrators; individuals cannot self-register as authors.
        </li>
        <li>
          <span className="font-semibold text-gray-800">Feedback submissions: </span>
          If a user submits feedback on a chat response or an article, the feedback text is collected.
          Feedback submitted through the anonymous chat interface is not linked to any personal
          identifier.
        </li>
      </ul>
    ),
  },
  {
    title: '7. How We Use Data',
    body: (
      <p>
        Registered account data is used solely to authenticate access to the content management system
        and attribute published articles to their author. Feedback data is used to identify and improve
        inaccurate, unhelpful, or unclear content and responses over time.
      </p>
    ),
  },
  {
    title: '8. Third-Party Services',
    body: (
      <>
        <p>Wambaza relies on the following third-party infrastructure to operate:</p>
        <ul className="mt-3 space-y-2">
          <li><span className="font-semibold text-gray-800">Hugging Face</span> — hosts the underlying AI model and processes chat questions to generate responses.</li>
          <li><span className="font-semibold text-gray-800">Railway</span> — hosts the platform's backend, frontend, and database.</li>
          <li><span className="font-semibold text-gray-800">Cloudinary</span> — hosts and serves images used in published articles.</li>
        </ul>
        <p className="mt-3">
          These providers may process data as part of delivering their services; Wambaza does not sell or
          share user data with third parties for advertising or unrelated commercial purposes.
        </p>
      </>
    ),
  },
  {
    title: '9. Data Retention and Security',
    body: (
      <p>
        Registered account data is retained for as long as the account remains active and is protected
        using password hashing and authenticated access controls. Chat interactions are not linked to
        identifying information and therefore cannot be used to identify individual users after
        submission.
      </p>
    ),
  },
  {
    title: '10. Your Rights',
    body: (
      <p>
        Registered account holders (authors and administrators) may request correction or deletion of
        their account information by contacting the platform administrator. As anonymous chat and
        article-reading use collects no personal data, there is no personal data associated with
        anonymous use to access, correct, or delete.
      </p>
    ),
  },
  {
    title: '11. Governing Frameworks',
    body: (
      <p>
        This policy is informed by Rwanda's Law No. 058/2021 on the Protection of Personal Data and
        Privacy, Uganda's Data Protection and Privacy Act, 2019, and the African Union Convention on Cyber
        Security and Personal Data Protection (Malabo Convention, 2014), reflecting Wambaza's operation
        across both countries.
      </p>
    ),
  },
  {
    title: '12. Changes to This Policy',
    body: (
      <p>
        This policy may be updated as the platform evolves. Continued use of Wambaza after changes are
        posted constitutes acceptance of the revised terms.
      </p>
    ),
  },
  {
    title: '13. Contact',
    body: (
      <p>
        For questions about this policy, data handling, or to request account-related changes, contact us
        at{' '}
        <a href="mailto:wambazarwanda@gmail.com" className="text-purple-700 font-semibold hover:underline">
          wambazarwanda@gmail.com
        </a>
        .
      </p>
    ),
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-30 pointer-events-none" />

      <SiteHeader className="relative z-10 border-b bg-white/80 backdrop-blur-sm" />

      <main className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Wambaza — Terms of Use, End User License Agreement, and Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: 29 July 2026</p>

        <div className="mt-8 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-10 space-y-10">
          {SECTIONS.map(section => (
            <section key={section.title}>
              <h2 className="text-lg font-bold text-purple-700">{section.title}</h2>
              <div className="mt-2 text-gray-600 text-sm leading-relaxed">{section.body}</div>
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}
