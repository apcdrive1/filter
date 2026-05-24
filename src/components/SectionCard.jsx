const SectionCard = ({ title, icon, badge, children }) => (
  <section className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm">
    <div className="flex items-center gap-3 mb-4">
      {icon}
      <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-3">
        {title}
        {badge !== undefined && (
          <span className="rounded-full bg-slate-800 px-3 py-0.5 text-xs text-slate-300 font-medium">
            {badge}
          </span>
        )}
      </h2>
    </div>
    {children}
  </section>
);

export default SectionCard;
