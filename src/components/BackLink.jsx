import { Link } from 'react-router-dom';

export default function BackLink({ to, children }) {
  return (
    <Link to={to} className="font-roboto text-[11.5px] tracking-wide font-medium text-teal-deep border border-[#6FB7B0] bg-[#6FB7B0]/10 hover:bg-[#6FB7B0]/20 rounded-lg px-3 py-1.5 inline-flex items-center gap-1.5 mb-4 transition-all shadow-sm">
      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
      {children}
    </Link>
  );
}
