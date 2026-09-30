import { Link } from 'react-router-dom'
import {
  BookOpen,
  FileText,
  Users,
  ShieldCheck,
  Scale,
  ArrowRight,
  CheckCircle,
  ExternalLink,
  Code2,
  Sparkles,
  Globe,
} from 'lucide-react'
import './ResourcePage.css'

const RESOURCE_META = {
  documentation: {
    icon: <BookOpen size={28} />,
    label: 'Documentation',
    eyebrow: 'Resources',
    title: 'Documentation',
    color: '#4A90D9',
    summary: 'Learn the FCFC platform, how it works, and how to integrate with the coupon ecosystem confidently.',
    sections: [
      {
        heading: 'Getting Started',
        items: [
          'Understand the FCFC lifecycle: generate, transfer, redeem, and renew coupons.',
          'Use the platform to create trust-driven funding journeys built around coupon support.',
          'Follow the FCFC flow to bring supporters into a transparent, trackable community experience.',
        ],
      },
      {
        heading: 'Core Concepts',
        items: [
          'FCFC coupons are unique, verifiable and designed to support community-driven funding.',
          'Every coupon can be tracked, verified and monitored through the FCFC ecosystem.',
          'Members can generate, submit, renew or search coupons with a consistent user journey.',
        ],
      },
      {
        heading: 'Best Practices',
        items: [
          'Keep coupon messaging clear so supporters understand the funding goal and value exchange.',
          'Promote each coupon with memorable reward and renewal details to improve trust and adoption.',
          'Use the platform analytics and coupon pages to monitor activity and improve participation.',
        ],
      },
    ],
  },
  'api-reference': {
    icon: <Code2 size={28} />,
    label: 'API Reference',
    eyebrow: 'Development',
    color: '#6C63FF',
    title: 'API Reference',
    summary: 'Reference endpoints and integration patterns for FCFC services, coupon processing, and ecosystem automation.',
    sections: [
      {
        heading: 'Primary API Domains',
        items: [
          'Generate coupon data and validate new FCFC requests before issuance.',
          'Submit or renew coupon records while preserving transparent lifecycle tracking.',
          'Search existing coupon data and retrieve status updates across the FCFC ecosystem.',
        ],
      },
      {
        heading: 'Request Model',
        items: [
          'Use secure requests with explicit validation for coupon ids, submission payloads and wallet actions.',
          'Standardize your responses around trusted status values, error codes and verification details.',
          'Prefer human-readable identifiers with consistent patterns for smoother integrations.',
        ],
      },
      {
        heading: 'Developer Guidelines',
        items: [
          'Implement graceful retry logic for coupon lookup, submission and renewal workflows.',
          'Validate all state transitions before sending or consuming data from FCFC endpoints.',
          'Log and monitor coupon lifecycle activity to reduce support issues and improve reliability.',
        ],
      },
    ],
  },
  whitepaper: {
    icon: <FileText size={28} />,
    label: 'Whitepaper',
    eyebrow: 'Protocol',
    color: '#27ae60',
    title: 'Whitepaper',
    summary: 'Explore the technical and economic model behind the FCFC system, including how value circulates and scales.',
    sections: [
      {
        heading: 'Core Thesis',
        items: [
          'FCFC is designed to create exponential audience growth through coupon-based support loops.',
          'The protocol aims to make funding more transparent, community-led and resilient.',
          'Every redemption is intended to create a sustainable loop of shared value and participation.',
        ],
      },
      {
        heading: 'Tokenomics & Value Flow',
        items: [
          'The value model is rooted in distributing new coupon opportunities through verified support flows.',
          'Community participation creates a multiplier effect across the ecosystem instead of a single one-way transfer.',
          'Every member can contribute to the network while benefiting from the wider growth cycle.',
        ],
      },
      {
        heading: 'System Principles',
        items: [
          'Security and traceability underpin every transaction and issuance process.',
          'The design favors scalable participation and meaningful community retention.',
          'The FCFC model rewards participation without sacrificing transparency or trust.',
        ],
      },
    ],
  },
  community: {
    icon: <Users size={28} />,
    label: 'Community',
    color: '#e67e22',
    eyebrow: 'Connect',
    title: 'Community',
    summary: 'Connect with FCFC supporters, builders, creators and partners across the broader ecosystem.',
    sections: [
      {
        heading: 'Why Join',
        items: [
          'Meet people building together around dream funding, support and shared success.',
          'Discover practical examples of FCFC in action across communities, campaigns and creators.',
          'Stay informed through platform updates, growth stories and shared momentum.',
        ],
      },
      {
        heading: 'What You Can Do',
        items: [
          'Ask questions, share ideas and contribute to the FCFC growth narrative.',
          'Promote your own campaign or support someone else’s funding journey.',
          'Take part in conversations that shape the experience of the FCFC network.',
        ],
      },
      {
        heading: 'Community Signals',
        items: [
          'The FCFC community is built on trust, visibility and meaningful participation.',
          'Every member helps grow the ecosystem through action, referral and engagement.',
          'The stronger the community, the more powerful the support loops become for everyone.',
        ],
      },
    ],
  },
  'privacy-policy': {
    icon: <ShieldCheck size={28} />,
    label: 'Privacy Policy',
    color: '#9b59b6',
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    summary: 'Learn how FCFC handles personal information, platform usage and community data responsibly.',
    sections: [
      {
        heading: 'Information We Handle',
        items: [
          'Basic contact, usage and activity information needed to support platform features and access.',
          'Coupon and transaction metadata required to maintain a trusted and verifiable support flow.',
          'Security and system data used to improve reliability, prevent misuse and support compliance work.',
        ],
      },
      {
        heading: 'How We Use Data',
        items: [
          'To provide the FCFC platform experience and maintain reliable service for users and supporters.',
          'To improve security, manage support requests and support operational accuracy across the ecosystem.',
          'To maintain records that help preserve integrity and trust across coupon issuance and redemption activity.',
        ],
      },
      {
        heading: 'Your Rights',
        items: [
          'You may request clarification about information held by FCFC and how it is used.',
          'You can contact the team to ask questions about your data practices and how supports are handled.',
          'The platform is designed to use the minimum information needed to maintain transparency and safe operation.',
        ],
      },
    ],
  },
  'terms-of-service': {
    icon: <Scale size={28} />,
    color: '#e74c3c',
    label: 'Terms of Service',
    eyebrow: 'Legal',
    title: 'Terms of Service',
    summary: 'Read the platform terms that govern FCFC usage, participation and coupon-related activities.',
    sections: [
      {
        heading: 'Acceptance of Terms',
        items: [
          'By using FCFC, you agree to the terms and conditions that govern platform participation and activities.',
          'The platform is intended for legitimate community support, coupon generation and responsible engagement.',
          'FCFC reserves the right to review, restrict or manage misuse of the platform as needed.',
        ],
      },
      {
        heading: 'Platform Use',
        items: [
          'Users are responsible for truthful coupon generation, valid submission and correct support communications.',
          'Activities that involve fraud, impersonation or misleading claims may be restricted or removed.',
          'All coupon lifecycle activity should be conducted with integrity and transparency.',
        ],
      },
      {
        heading: 'Liability & Updates',
        items: [
          'FCFC provides the platform as a support tool and community ecosystem, but services may evolve over time.',
          'Terms may be updated with notice to reflect changes in policies, technology or regulatory requirements.',
          'Continued platform use after updates constitutes acceptance of the revised policies and conditions.',
        ],
      },
    ],
  },
}

export default function ResourcePage({ resource = 'documentation' }) {
  const meta = RESOURCE_META[resource] || RESOURCE_META.documentation

  return (
    <main className="resource-page" style={{ '--resource-color': meta.color }}>
      <section className="resource-hero" style={{
        background: `radial-gradient(circle at top left, ${meta.color}22, transparent 28%), radial-gradient(circle at bottom right, ${meta.color}18, transparent 18%), linear-gradient(180deg, rgba(13, 20, 38, 0.98), rgba(11, 18, 34, 0.9))`
      }}>
        <div className="page-wrapper resource-hero-inner">
          <div className="resource-badge" style={{
            background: `${meta.color}1A`,
            borderColor: `${meta.color}55`,
            color: meta.color,
          }}>
            <Sparkles size={14} /> {meta.eyebrow}
          </div>
          <h1>{meta.title}</h1>
          <p>{meta.summary}</p>
          <div className="resource-hero-actions">
            <Link
              to="/"
              className="resource-btn resource-btn-primary"
              style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}CC)` }}
            >
              Back to Home <ArrowRight size={15} />
            </Link>
            <Link to="/links" className="resource-btn resource-btn-secondary">
              View Links
            </Link>
          </div>
        </div>
      </section>

      <section className="section resource-section">
        <div className="page-wrapper">
          <div className="resource-grid">
            {meta.sections.map((section) => (
              <div key={section.heading} className="resource-card">
                <div className="resource-card-header">
                  <div className="resource-icon" style={{ color: '#fff', background: `linear-gradient(135deg, ${meta.color}, ${meta.color}dd)` }}>
                    {meta.icon}
                  </div>
                  <h3>{section.heading}</h3>
                </div>

                <ul className="resource-list">
                  {section.items.map((item) => (
                    <li key={item}>
                      <CheckCircle size={16} color={meta.color} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section resource-footer-section">
        <div className="page-wrapper">
          <div
            className="resource-cta"
            style={{
              background: `linear-gradient(135deg, ${meta.color}22, rgba(39, 174, 96, 0.08))`,
              borderColor: `${meta.color}55`,
            }}
          >
            <div>
              <div className="resource-cta-eyebrow" style={{ color: meta.color }}>Need More Help?</div>
              <h3>Explore the FCFC ecosystem and start your next step with confidence.</h3>
            </div>
            <div className="resource-cta-actions">
              <Link
                to="/coupon/generate"
                className="resource-btn resource-btn-primary"
                style={{ background: `linear-gradient(135deg, ${meta.color}, ${meta.color}CC)` }}
              >
                Generate Coupon <ExternalLink size={15} />
              </Link>
              <Link to="/faq" className="resource-btn resource-btn-secondary">
                Read FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
