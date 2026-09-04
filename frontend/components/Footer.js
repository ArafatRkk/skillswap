export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <span className="text-base font-bold text-dark tracking-tight">SkillSwap</span>
            <p className="text-xs text-muted mt-1">
              Share what you know. Learn what you need.
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-dark font-medium">
              Created by Arafat Amin
            </p>
            <p className="text-xs text-muted mt-1">
              Final Year Exam Project &copy; {currentYear}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
