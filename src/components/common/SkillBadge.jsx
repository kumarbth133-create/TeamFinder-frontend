const SkillBadge = ({ skill, onRemove }) => {
  return (
    <span className="inline-flex items-center gap-1 bg-primary-100 dark:bg-primary-800/40 text-primary-700 dark:text-primary-300 text-xs font-medium px-2.5 py-1 rounded-full border border-primary-200 dark:border-primary-700/40">
      {skill}
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(skill)}
          className="ml-0.5 hover:text-green-200 font-bold leading-none"
          aria-label={`Remove ${skill}`}
        >
          ×
        </button>
      )}
    </span>
  );
};

export default SkillBadge;
