export const useLocation = () => {
  const parseAddress = (address: string): [number, number] | null => {
    if (!address) return null
    
    const parts = address.split(',').map(eachPart => parseFloat(eachPart.trim()))
    
    const lat = parts[0]
    const lng = parts[1]
    
    if (
      parts.length === 2 && 
      typeof lat === 'number' && !isNaN(lat) &&
      typeof lng === 'number' && !isNaN(lng)
    ) {
      return [lat, lng]
    }
    return null
  }
  
  const formatLocation = (location: [number, number]): string => {
    return `${location[0].toFixed(6)}, ${location[1].toFixed(6)}`
  }
  
  return {
    parseAddress,
    formatLocation
  }
}