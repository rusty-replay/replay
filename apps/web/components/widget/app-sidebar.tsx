'use client';

import * as React from 'react';
import {
  Activity,
  AlertCircle,
  BarChart3,
  Bell,
  Bug,
  Clock,
  Code,
  Command,
  Cpu,
  Gauge,
  LineChart,
  List,
  Settings2,
  Shield,
  Users2,
  Zap,
  AudioWaveform,
} from 'lucide-react';

import { TeamSwitcher } from '@workspace/ui/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@workspace/ui/components/sidebar';
import { NavProjects } from './nav-projects';
import { NavMain } from './nav-main';
import { useQueryProfile } from '@/api/auth/use-query-profile';
import { NavUser } from './nav-user';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Frontend Team',
      logo: Code,
      plan: 'Enterprise',
    },
    {
      name: 'Backend Team',
      logo: Command,
      plan: 'Enterprise',
    },
    {
      name: 'DevOps Team',
      logo: Cpu,
      plan: 'Free',
    },
  ],
  projects: [
    {
      name: 'Projects',
      url: '/project',
      icon: Activity,
    },
    {
      name: 'Issues',
      url: '#',
      icon: Shield,
    },
    {
      name: 'Traces',
      url: '/traces/1',
      icon: AudioWaveform,
    },
  ],
  navMain: [
    {
      title: '대시보드',
      url: '#',
      icon: Gauge,
      isActive: true,
      items: [
        {
          title: '실시간 모니터링',
          url: '#',
        },
        {
          title: '서비스 상태',
          url: '#',
        },
        {
          title: '성능 지표',
          url: '#',
        },
      ],
    },
    {
      title: '이슈 트래킹',
      url: '#',
      icon: Bug,
      items: [
        {
          title: '모든 이슈',
          url: '#',
        },
        {
          title: '해결되지 않은 이슈',
          url: '#',
        },
        {
          title: '중요 이슈',
          url: '#',
        },
        {
          title: '나에게 할당된 이슈',
          url: '#',
        },
      ],
    },
    {
      title: '성능',
      url: '#',
      icon: Zap,
      items: [
        {
          title: '트랜잭션',
          url: '#',
        },
        {
          title: '웹 성능',
          url: '#',
        },
        {
          title: 'API 성능',
          url: '#',
        },
        {
          title: '백엔드 성능',
          url: '#',
        },
      ],
    },
    {
      title: '분석',
      url: '#',
      icon: LineChart,
      items: [
        {
          title: '트래픽 분석',
          url: '#',
        },
        {
          title: '에러 발생률',
          url: '#',
        },
        {
          title: '사용자 세션',
          url: '#',
        },
        {
          title: '커스텀 리포트',
          url: '#',
        },
      ],
    },
    {
      title: '알림',
      url: '#',
      icon: Bell,
      items: [
        {
          title: '알림 설정',
          url: '#',
        },
        {
          title: '알림 이력',
          url: '#',
        },
        {
          title: '알림 룰',
          url: '#',
        },
      ],
    },
    {
      title: '설정',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: '프로젝트 설정',
          url: '#',
        },
        {
          title: '팀 관리',
          url: '#',
        },
        {
          title: 'SDK 설정',
          url: '#',
        },
        {
          title: '통합 설정',
          url: '#',
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: profile, isPending: isPendingProfile } = useQueryProfile();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />

        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser profile={profile} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
