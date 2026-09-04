export default function SkillBadge({ skill, type = 'teach' }) {
  const isTeach = type === 'teach';
  
  // Custom design themes depending on whether they can teach or want to learn the skill
  const themeClasses = isTeach
    ? 'bg-blue-50 text-primary border border-blue-150'
    : 'bg-yellow-50 text-amber-800 border border-yellow-150';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${themeClasses}`}>
      {skill}
    </span>
  );
}
