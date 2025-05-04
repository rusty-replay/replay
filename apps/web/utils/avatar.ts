export function getInitials(name: string) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getAvatarColor(name: string) {
  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-green-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-pink-500',
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
