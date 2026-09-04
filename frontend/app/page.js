import Link from 'next/link';
import { Compass, UserPlus, GraduationCap, Users, RefreshCw } from 'lucide-react';

export default function Home() {
  const steps = [
    {
      num: '01',
      title: 'Create Your Profile',
      desc: 'Create an account and tell us a bit about your background and location.',
      icon: <UserPlus className="h-6 w-6 text-primary" />
    },
    {
      num: '02',
      title: 'List Your Skills',
      desc: 'Specify the skills you can teach and what you are eager to learn.',
      icon: <GraduationCap className="h-6 w-6 text-primary" />
    },
    {
      num: '03',
      title: 'Discover Matches',
      desc: 'Our matching system automatically identifies people with complementary needs.',
      icon: <RefreshCw className="h-6 w-6 text-primary" />
    },
    {
      num: '04',
      title: 'Connect & Swap',
      desc: 'Send connection requests, get in touch, and start learning from each other.',
      icon: <Users className="h-6 w-6 text-primary" />
    }
  ];

  const popularSkills = [
    'React', 'UI/UX Design', 'JavaScript', 'Photoshop',
    'Node.js', 'Python', 'SEO', 'Photography', 'Video Editing'
  ];

  return (
    <div className="flex flex-col flex-grow">
      {/* Hero Section */}
      <section className="bg-white py-20 border-b border-border">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-black text-dark tracking-tight leading-none mb-6">
            Share what you know.<br />
            <span className="text-primary">Learn what you need.</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted leading-relaxed max-w-2xl mx-auto mb-10">
            SkillSwap is a peer-to-peer skill exchange platform for students. Connect with classmates, share your expertise, and learn new skills cash-free.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/explore"
              className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-md text-base font-semibold shadow-sm text-center transition"
            >
              Find Your Skill Match
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto bg-background hover:bg-border text-dark border border-border px-8 py-3 rounded-md text-base font-semibold text-center transition"
            >
              Join SkillSwap
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-dark tracking-tight">How SkillSwap Works</h2>
            <p className="text-muted mt-2 text-base">Four simple steps to start exchanging knowledge with peers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="bg-white rounded-lg border border-border p-6 relative flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-muted uppercase tracking-wider">Step {step.num}</span>
                    <div className="bg-blue-50 p-2 rounded-md border border-blue-100">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-dark mb-2">{step.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Skills / Category Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-dark mb-4">Popular Skills to Exchange</h2>
          <p className="text-sm text-muted mb-8 max-w-md mx-auto">
            From frontend programming to graphic editing, discover students ready to teach you.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {popularSkills.map((skill, idx) => (
              <span 
                key={idx} 
                className="bg-background text-dark px-4 py-2 rounded-md text-sm font-semibold border border-border shadow-sm hover:border-primary/45 transition duration-150"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
