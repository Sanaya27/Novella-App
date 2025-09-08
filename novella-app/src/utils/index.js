// src/utils/index.js
export const createPageUrl = (pageName) => {
  return `/${pageName.toLowerCase()}`;
};

export const formatDistance = (distance) => {
  if (distance < 1000) {
    return `${distance}m away`;
  }
  return `${(distance / 1000).toFixed(1)}km away`;
};

export const formatLastSeen = (timestamp) => {
  const now = new Date();
  const lastSeen = new Date(timestamp);
  const diffMs = now - lastSeen;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Active now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days ago`;
};