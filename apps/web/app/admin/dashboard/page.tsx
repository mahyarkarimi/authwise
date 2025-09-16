import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function AdminDashboard() {
  const cards = [
    {
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      title: 'User Management',
      description: 'Manage users',
      linkHref: '/admin/dashboard/users',
      linkText: 'Manage Users',
      colorClass: 'bg-red-500',
      hoverColorClass: 'bg-red-700'
    },
    {
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      title: 'Client Management',
      description: 'Manage OAuth clients',
      linkHref: '/admin/dashboard/clients',
      linkText: 'Manage Clients',
      colorClass: 'bg-orange-500',
      hoverColorClass: 'bg-orange-700'
    },
    {
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'System Stats',
      description: 'View analytics',
      linkHref: '#',
      linkText: 'View Stats',
      colorClass: 'bg-purple-500',
      hoverColorClass: 'bg-purple-700'
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <Card hover key={index} className="p-6">
            <div className="flex items-center mb-4">
              <div className={`w-12 h-12 ${card.colorClass} rounded-lg flex items-center justify-center shadow-md`}>
                {card.icon}
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{card.title}</h3>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-4">{card.description}</p>
            <Link href={card.linkHref}>
              <Button variant="primary" className={`w-full ${card.colorClass} hover:${card.hoverColorClass}`}>
                {card.linkText}
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}