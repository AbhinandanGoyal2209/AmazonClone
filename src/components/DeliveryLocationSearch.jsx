import { useState } from 'react'

const INDIAN_LOCATIONS = [
  { city: 'Mumbai', state: 'MH', postal: '400001', region: 'Mumbai, Maharashtra' },
  { city: 'Delhi', state: 'DL', postal: '110001', region: 'Delhi' },
  { city: 'Bangalore', state: 'KA', postal: '560001', region: 'Bangalore, Karnataka' },
  { city: 'Hyderabad', state: 'TG', postal: '500001', region: 'Hyderabad, Telangana' },
  { city: 'Chennai', state: 'TN', postal: '600001', region: 'Chennai, Tamil Nadu' },
  { city: 'Kolkata', state: 'WB', postal: '700001', region: 'Kolkata, West Bengal' },
  { city: 'Pune', state: 'MH', postal: '411001', region: 'Pune, Maharashtra' },
  { city: 'Ahmedabad', state: 'GJ', postal: '380001', region: 'Ahmedabad, Gujarat' },
  { city: 'Jaipur', state: 'RJ', postal: '302001', region: 'Jaipur, Rajasthan' },
  { city: 'Lucknow', state: 'UP', postal: '226001', region: 'Lucknow, Uttar Pradesh' },
  { city: 'Chandigarh', state: 'CH', postal: '160001', region: 'Chandigarh' },
  { city: 'Indore', state: 'MP', postal: '452001', region: 'Indore, Madhya Pradesh' },
  { city: 'Kochi', state: 'KL', postal: '682001', region: 'Kochi, Kerala' },
  { city: 'Bhopal', state: 'MP', postal: '462001', region: 'Bhopal, Madhya Pradesh' },
  { city: 'Vadodara', state: 'GJ', postal: '390001', region: 'Vadodara, Gujarat' },
  { city: 'Gurgaon', state: 'HR', postal: '122001', region: 'Gurgaon, Haryana' },
  { city: 'Noida', state: 'UP', postal: '201301', region: 'Noida, Uttar Pradesh' },
  { city: 'Surat', state: 'GJ', postal: '395001', region: 'Surat, Gujarat' },
  { city: 'Visakhapatnam', state: 'AP', postal: '530001', region: 'Visakhapatnam, Andhra Pradesh' },
  { city: 'Nagpur', state: 'MH', postal: '440001', region: 'Nagpur, Maharashtra' },
]

export function DeliveryLocationSearch({ onSelect }) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedLocation, setSelectedLocation] = useState(null)

  const filteredLocations = INDIAN_LOCATIONS.filter(
    (loc) =>
      loc.city.toLowerCase().includes(search.toLowerCase()) ||
      loc.state.toLowerCase().includes(search.toLowerCase()) ||
      loc.region.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (location) => {
    setSelectedLocation(location)
    setIsOpen(false)
    setSearch('')
    if (onSelect) onSelect(location)
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: 6,
          cursor: 'pointer',
          color: '#fff',
          fontSize: 12,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
        }}
      >
        <span style={{ fontSize: 14 }}>📍</span>
        <div style={{ textAlign: 'left', minWidth: 0 }}>
          <div style={{ fontSize: 11, opacity: 0.8 }}>Deliver to</div>
          <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {selectedLocation ? selectedLocation.city : 'Select location'}
          </div>
        </div>
        <span style={{ marginLeft: 'auto', opacity: 0.7 }}>▼</span>
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            zIndex: 100,
            maxHeight: 300,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <input
            type="text"
            placeholder="Search city, state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '10px 12px',
              border: 'none',
              borderBottom: '1px solid #eee',
              fontSize: 13,
              outline: 'none',
              fontFamily: 'inherit',
            }}
            autoFocus
          />
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filteredLocations.length > 0 ? (
              filteredLocations.map((loc, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelect(loc)}
                  style={{
                    padding: '12px',
                    borderBottom: '1px solid #f5f5f5',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0066c0' }}>
                    {loc.region}
                  </div>
                  <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
                    {loc.postal}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: 12, textAlign: 'center', color: '#999', fontSize: 12 }}>
                No locations found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
