export function formatCurrency(value, compact = false) {
  if (compact && value >= 1000) {
    return '$' + (value / 1000).toFixed(1) + 'k'
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPercent(value, decimals = 1) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`
}

export function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function scoreToGrade(score) {
  if (score >= 90) return { grade: 'A', label: 'Excellent' }
  if (score >= 80) return { grade: 'B', label: 'Good' }
  if (score >= 70) return { grade: 'C', label: 'Fair' }
  if (score >= 60) return { grade: 'D', label: 'Needs Work' }
  return { grade: 'F', label: 'Critical' }
}
