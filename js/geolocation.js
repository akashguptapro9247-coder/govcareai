// Geolocation JavaScript for GovCareAI

// DOM Elements
const useLocationButton = document.getElementById('use-location');
const latitudeInput = document.getElementById('latitude');
const longitudeInput = document.getElementById('longitude');
const streetInput = document.getElementById('street');

// Initialize geolocation handlers
document.addEventListener('DOMContentLoaded', function() {
  initializeGeolocationHandlers();
});

// Initialize Geolocation Handlers
function initializeGeolocationHandlers() {
  // Use Location Button
  if (useLocationButton) {
    useLocationButton.addEventListener('click', getCurrentLocation);
  }
}

// Get Current Location
function getCurrentLocation() {
  // Show loading state
  useLocationButton.innerHTML = '<div class="loading-spinner"></div> Getting Location...';
  useLocationButton.disabled = true;
  
  // Check if geolocation is supported
  if (!navigator.geolocation) {
    GovCareAI.showNotification('Geolocation is not supported by your browser', 'error');
    resetLocationButton();
    return;
  }
  
  // Get current position
  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      
      // Update form fields
      if (latitudeInput) latitudeInput.value = lat.toFixed(6);
      if (longitudeInput) longitudeInput.value = lng.toFixed(6);
      
      // Reverse geocode to get street address
      reverseGeocode(lat, lng);
    },
    error => {
      handleLocationError(error);
      resetLocationButton();
    },
    {
      enableHighAccuracy: false, // Reduced accuracy for faster response
      timeout: 5000, // Reduced timeout to 5 seconds
      maximumAge: 300000 // Cache for 5 minutes
    }
  );
}

// Reverse Geocode to Get Address
async function reverseGeocode(lat, lng) {
  try {
    GovCareAI.showNotification('Getting your address...', 'info');
    
    // Using OpenStreetMap Nominatim API for reverse geocoding
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`, {
      headers: {
        'User-Agent': 'GovCareAI/1.0 (https://govcareai.com)'
      }
    });
    
    if (!response.ok) {
      throw new Error('Geocoding service unavailable');
    }
    
    const data = await response.json();
    
    if (data && data.display_name) {
      if (streetInput) streetInput.value = data.display_name;
      GovCareAI.showNotification('Location acquired successfully!', 'success');
    } else {
      // Fallback to coordinates if address not found
      if (streetInput) streetInput.value = `Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      GovCareAI.showNotification('Location acquired. Address not found, showing coordinates.', 'info');
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    // Fallback to coordinates if geocoding fails
    if (streetInput) streetInput.value = `Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    GovCareAI.showNotification('Location acquired. Could not get address.', 'warning');
  } finally {
    resetLocationButton();
  }
}

// Handle Location Errors
function handleLocationError(error) {
  let errorMessage = '';
  
  switch(error.code) {
    case error.PERMISSION_DENIED:
      errorMessage = "Location access denied. Please enable location services.";
      break;
    case error.POSITION_UNAVAILABLE:
      errorMessage = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      errorMessage = "The request to get your location timed out.";
      break;
    default:
      errorMessage = "An unknown error occurred while getting your location.";
      break;
  }
  
  GovCareAI.showNotification(errorMessage, 'error');
}

// Reset Location Button
function resetLocationButton() {
  useLocationButton.innerHTML = 'USE MY LOCATION';
  useLocationButton.disabled = false;
}

// Export functions
window.Geolocation = {
  getCurrentLocation
};