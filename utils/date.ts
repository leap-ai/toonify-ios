/**
 * Formats a date string to a relative time from now
 * Handles both past and future dates
 */
export const formatRelativeDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const isFuture = diffTime < 0;
    const absDiffTime = Math.abs(diffTime);
    const diffDays = Math.floor(absDiffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(absDiffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(absDiffTime / (1000 * 60));
  
    if (diffDays === 0) {
      if (diffHours === 0) {
        if (diffMinutes < 2) {
          return isFuture ? 'Just now' : 'Just now';
        }
        return isFuture ? `In ${diffMinutes} minutes` : `${diffMinutes} minutes ago`;
      }
      return isFuture 
        ? `In ${diffHours} ${diffHours === 1 ? 'hour' : 'hours'}`
        : `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays === 1) {
      return isFuture ? 'Tomorrow' : 'Yesterday';
    } else if (diffDays < 7) {
      return isFuture 
        ? `In ${diffDays} days`
        : `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  }; 