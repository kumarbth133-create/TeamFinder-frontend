const EmptyState = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="text-5xl mb-4 opacity-60">{icon}</div>}
      <h3 className="text-base font-semibold text-gray-400 mb-1">{title}</h3>
      {description && <p className="text-gray-600 text-sm mb-5 max-w-xs">{description}</p>}
      {action && action}
    </div>
  );
};

export default EmptyState;
