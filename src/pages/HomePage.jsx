import { Link } from 'react-router-dom'

const CASE_STUDY_URL = 'https://www.eniola.design/homeward-healthcare'

function ChevronRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden className="shrink-0 text-ds-icon-base">
      <path
        d="M7.5 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PatientIntakeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden className="shrink-0 text-ds-button-primary">
      <rect x="4" y="3" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.25" />
      <path d="M8 8h6M8 11h6M8 14h4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}

function SchedulingMapIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden className="shrink-0 text-ds-button-primary">
      <path
        d="M11 19s6-4.5 6-10a6 6 0 1 0-12 0c0 5.5 6 10 6 10z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <circle cx="11" cy="9" r="2" fill="currentColor" />
    </svg>
  )
}

function CaseStudyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden className="shrink-0 text-ds-button-primary">
      <path
        d="M5 4h12v14H5V4z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M8 8h6M8 11h6M8 14h4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}

const linkCardClass =
  'group flex w-full items-center justify-between gap-ds-4 rounded-ds-m border border-ds-border-base bg-ds-canvas-base px-ds-6 py-ds-5 shadow-ds-sm outline-none transition duration-200 hover:border-ds-icon-light hover:bg-ds-canvas-light hover:shadow-ds-md focus-visible:ring-2 focus-visible:ring-ds-button-primary/25'

function DestinationCard({ to, href, title, description, icon: Icon, external }) {
  const inner = (
    <>
      <div className="flex min-w-0 flex-1 items-center gap-ds-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-ds-s border border-ds-border-base bg-ds-canvas-light transition group-hover:border-ds-button-primary/20 group-hover:bg-ds-button-primary-light">
          <Icon />
        </span>
        <div className="min-w-0 text-left">
          <p className="text-[15px] font-medium leading-[23px] tracking-[-0.3px] text-ds-text-dark">{title}</p>
          {description ? (
            <p className="mt-ds-1 text-[13px] font-normal leading-[21px] tracking-[-0.26px] text-ds-text-base">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      <ChevronRightIcon />
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={linkCardClass}
      >
        {inner}
      </a>
    )
  }

  return (
    <Link to={to} className={linkCardClass}>
      {inner}
    </Link>
  )
}

export default function HomePage() {
  return (
    <main className="dot-grid-bg flex min-h-screen items-center justify-center px-ds-8 py-ds-9">
      <div
        className="w-full max-w-[600px] overflow-hidden rounded-ds-l border border-ds-border-base bg-ds-canvas-base shadow-ds-md"
        aria-labelledby="home-destination-title"
      >
        <div className="border-b border-ds-border-base px-ds-8 py-ds-8">
          <p className="text-[12px] font-medium uppercase leading-[18px] tracking-[-0.24px] text-ds-text-base">
            Homeward Healthcare
          </p>
          <h1
            id="home-destination-title"
            className="mt-ds-2 text-[20px] font-medium leading-[28px] tracking-[-0.2px] text-ds-text-dark"
          >
            Where would you like to go?
          </h1>
        </div>

        <div className="flex flex-col gap-ds-5 bg-ds-canvas-light px-ds-8 py-ds-5">
          <DestinationCard
            to="/patients/new"
            title="Patient Intake Form"
            description="Register a new patient and capture care preferences."
            icon={PatientIntakeIcon}
          />
          <DestinationCard
            to="/scheduling/map"
            title="Staff Scheduling / Map"
            description="Assign staff with map-assisted routing and availability."
            icon={SchedulingMapIcon}
          />
          <DestinationCard
            href={CASE_STUDY_URL}
            external
            title="View Full Case Study"
            description="Explore the product design story and flows."
            icon={CaseStudyIcon}
          />
        </div>
      </div>
    </main>
  )
}
