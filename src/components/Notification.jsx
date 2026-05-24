const Notification = ({ message }) => {
  if (!message) return null;
  return (
    <div className="fixed bottom-5 right-5 z-50 rounded-3xl bg-slate-900 border border-slate-700 px-5 py-3 text-sm text-white shadow-lg shadow-slate-950/40">
      {message}
    </div>
  );
};

export default Notification;
