import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkHref: string;
  linkText: string;
  colorClass: string;
}

function DashboardCard({
  icon,
  title,
  description,
  linkHref,
  linkText,
  colorClass,
}: DashboardCardProps) {
  return (
    <Card hover className="p-6">
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center shadow-md`}>
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        </div>
      </div>
      <p className="text-slate-600 dark:text-slate-400 mb-4">{description}</p>
      <Link href={linkHref}>
        <Button variant="primary" className={`w-full ${colorClass} hover:brightness-110`}>
          {linkText}
        </Button>
      </Link>
    </Card>
  );
}

export default function DashboardPage() {
  const cards = [
    {
      icon: '🔐',
      title: 'Authorized Applications',
      description: 'Manage your authorized applications.',
      linkHref: '/dashboard/applications',
      linkText: 'View Applications',
      colorClass: 'bg-blue-500',
    },
    {
      icon: '📊',
      title: 'Active Sessions',
      description: 'View and manage active sessions.',
      linkHref: '/dashboard/tokens',
      linkText: 'View Sessions',
      colorClass: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
}