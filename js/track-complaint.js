// Track Complaint JavaScript

// API Configuration - Use the base URL from main.js
const API_BASE_URL = window.API_BASE_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? '' // Empty string means relative URLs for local development
  : 'https://your-backend-domain.com'); // Replace with your actual backend domain

class TrackComplaint {
  constructor() {
    this.complaints = [];
    this.filteredComplaints = [];
    this.init();
  }

  async init() {
    await this.loadComplaints();
    this.setupEventListeners();
    this.renderComplaints();
  }
  
  toggleComplaintDetails(complaintId) {
    const contentElement = document.getElementById(`complaint-details-${complaintId}`);
    if (contentElement) {
      if (contentElement.style.display === 'none') {
        contentElement.style.display = 'block';
      } else {
        contentElement.style.display = 'none';
      }
    }
  }
  
  viewMap(complaintId) {
    // Find the complaint by ID
    const complaint = this.complaints.find(c => c.complaint_id == complaintId);
    
    if (!complaint || !complaint.latitude || !complaint.longitude) {
      alert('Location coordinates not available for this complaint.');
      return;
    }
    
    // Open Google Maps in a new tab with the coordinates
    const googleMapsUrl = `https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}&ll=${complaint.latitude},${complaint.longitude}&z=15`;
    window.open(googleMapsUrl, '_blank');
  }
  
  async viewMessages(complaintId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/complaints/my-complaints/${complaintId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const messages = await response.json();
        
        if (messages.length === 0) {
          alert('No messages found for this complaint.');
          return;
        }
        
        // Create a modal to display messages
        let messagesHtml = '<div class="messages-container">';
        messagesHtml += '<h3 class="messages-title">Complaint Messages</h3>';
        messagesHtml += '<div class="messages-list">';
        messages.forEach((message, index) => {
          const timestamp = new Date(message.timestamp).toLocaleString();
          const isFromAdmin = message.sender_type === 'ADMIN';
          const senderClass = isFromAdmin ? 'admin-message' : 'citizen-message';
          messagesHtml += `<div class="message ${senderClass}">
            <div class="message-header">
              <strong class="message-sender">${isFromAdmin ? 'Administrator' : 'Citizen'}</strong>
              <span class="message-timestamp">${timestamp}</span>
            </div>
            <p class="message-text">${message.message_text}</p>
          </div>`;
        });
        messagesHtml += '</div></div>';
        
        // Show messages in a popup/modal
        const modal = document.createElement('div');
        modal.className = 'messages-modal-overlay';
        modal.innerHTML = `
          <div class="messages-modal">
            <button class="messages-close-btn" onclick="this.closest('.messages-modal-overlay').remove()">×</button>
            ${messagesHtml}
          </div>
        `;
        
        document.body.appendChild(modal);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch messages:', errorData);
        alert(`Failed to fetch messages for this complaint: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      alert('Error fetching messages. Please try again. Check console for details.');
    }
  }
  
  async deleteComplaint(complaintId) {
    if (confirm('Are you sure you want to delete this complaint? This action cannot be undone.')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/complaints/${complaintId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          // Remove the complaint from the local array
          this.complaints = this.complaints.filter(c => c.complaint_id != complaintId);
          this.filteredComplaints = this.filteredComplaints.filter(c => c.complaint_id != complaintId);
          
          // Re-render the complaints
          this.renderComplaints();
          
          // Reload stats to update counts
          await this.loadComplaintStats();
          
          console.log('Complaint deleted successfully');
          alert('Complaint deleted successfully');
        } else {
          const errorData = await response.json();
          console.error('Failed to delete complaint:', errorData);
          alert(`Failed to delete complaint: ${errorData.message || response.statusText}`);
        }
      } catch (error) {
        console.error('Error deleting complaint:', error);
        alert('Error deleting complaint. Please try again. Check console for details.');
      }
    }
  }

  loadComplaintStats() {
    // Calculate stats from the loaded complaints
    const stats = {
      highPriorityCount: 0,
      moderatePriorityCount: 0,
      lowPriorityCount: 0,
      resolvedCount: 0,
      inProgressCount: 0,
      pendingCount: 0
    };
    
    this.complaints.forEach(complaint => {
      switch(complaint.priority) {
        case 'HIGH':
          stats.highPriorityCount++;
          break;
        case 'MODERATE':
          stats.moderatePriorityCount++;
          break;
        case 'LOW':
          stats.lowPriorityCount++;
          break;
      }
      
      switch(complaint.status) {
        case 'RESOLVED':
          stats.resolvedCount++;
          break;
        case 'IN PROGRESS':
          stats.inProgressCount++;
          break;
        case 'PENDING':
          stats.pendingCount++;
          break;
      }
    });
    
    this.updateComplaintStats(stats);
  }
  
  updateComplaintStats(stats) {
    // Update high priority count
    const highPriorityElement = document.querySelector('.stat-high');
    if (highPriorityElement) {
      highPriorityElement.textContent = stats.highPriorityCount;
      // Add class to parent stat card
      const highPriorityCard = highPriorityElement.closest('.priority-stat-card');
      if (highPriorityCard) {
        highPriorityCard.classList.add('high-priority');
      }
    }
    
    // Update moderate priority count
    const moderatePriorityElement = document.querySelector('.stat-moderate');
    if (moderatePriorityElement) {
      moderatePriorityElement.textContent = stats.moderatePriorityCount;
      // Add class to parent stat card
      const moderatePriorityCard = moderatePriorityElement.closest('.priority-stat-card');
      if (moderatePriorityCard) {
        moderatePriorityCard.classList.add('moderate-priority');
      }
    }
    
    // Update low priority count
    const lowPriorityElement = document.querySelector('.stat-low');
    if (lowPriorityElement) {
      lowPriorityElement.textContent = stats.lowPriorityCount;
      // Add class to parent stat card
      const lowPriorityCard = lowPriorityElement.closest('.priority-stat-card');
      if (lowPriorityCard) {
        lowPriorityCard.classList.add('low-priority');
      }
    }
    
    // Show the stats container
    const statsContainer = document.getElementById('priority-stats');
    if (statsContainer) {
      statsContainer.style.display = 'grid';
    }
  }
  
  async loadComplaints() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/complaints/my-complaints`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        this.complaints = await response.json();
        this.filteredComplaints = [...this.complaints];
        console.log('Complaints loaded:', this.complaints);
        
        // Load stats after complaints are loaded
        this.loadComplaintStats();
      } else {
        console.error('Failed to load complaints');
      }
    } catch (error) {
      console.error('Error loading complaints:', error);
    }
  }

  setupEventListeners() {
    // Search functionality
    const searchInput = document.querySelector('input[placeholder="Search complaints..."]');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.filterComplaints());
    }

    // Priority filter
    const priorityFilter = document.getElementById('priority-filter');
    if (priorityFilter) {
      priorityFilter.addEventListener('change', (e) => this.filterComplaints());
    }

    // Status filter
    const statusFilter = document.getElementById('status-filter');
    if (statusFilter) {
      statusFilter.addEventListener('change', (e) => this.filterComplaints());
    }
  }

  filterComplaints() {
    const searchTerm = document.querySelector('input[placeholder="Search complaints..."]').value.toLowerCase();
    const priorityFilter = document.getElementById('priority-filter').value;
    const statusFilter = document.getElementById('status-filter').value;

    this.filteredComplaints = this.complaints.filter(complaint => {
      // Search filter
      const matchesSearch = !searchTerm || 
        complaint.title.toLowerCase().includes(searchTerm) ||
        complaint.description.toLowerCase().includes(searchTerm) ||
        complaint.street.toLowerCase().includes(searchTerm);

      // Priority filter
      const matchesPriority = !priorityFilter || complaint.priority === priorityFilter;

      // Status filter
      const matchesStatus = !statusFilter || complaint.status === statusFilter;

      return matchesSearch && matchesPriority && matchesStatus;
    });

    this.renderComplaints();
  }

  renderComplaints() {
    const complaintsContainer = document.querySelector('.card-grid');
    if (!complaintsContainer) return;

    if (this.filteredComplaints.length === 0) {
      complaintsContainer.innerHTML = '<p>No complaints found matching your criteria.</p>';
      return;
    }

    complaintsContainer.innerHTML = this.filteredComplaints.map(complaint => this.createComplaintCard(complaint)).join('');
  }

  createComplaintCard(complaint) {
    // Format date
    const createdAt = new Date(complaint.created_at).toLocaleDateString();
    
    // Priority badge class
    const priorityClass = `priority-${complaint.priority.toLowerCase()}`;
    
    // Status badge style
    let statusStyle = '';
    switch(complaint.status) {
      case 'PENDING':
        statusStyle = 'background: rgba(255, 0, 170, 0.2); color: var(--neon-red);';
        break;
      case 'IN PROGRESS':
        statusStyle = 'background: rgba(255, 107, 0, 0.2); color: var(--neon-orange);';
        break;
      case 'RESOLVED':
        statusStyle = 'background: rgba(0, 255, 157, 0.2); color: var(--neon-green);';
        break;
      default:
        statusStyle = 'background: rgba(189, 0, 255, 0.2); color: var(--neon-purple);';
    }

    // Add priority and status classes to the complaint card for styling
    const cardPriorityClass = `priority-${complaint.priority.toLowerCase()}`;
    const cardStatusClass = `status-${complaint.status.toLowerCase().replace(' ', '-')}`;
    
    return `
      <div class="complaint-card ${cardPriorityClass} ${cardStatusClass}" data-complaint-id="${complaint.complaint_id}" style="--index: ${this.complaints.indexOf(complaint)}">
        <!-- Collapsible Header -->
        <div class="collapsible-header" onclick="trackComplaint.toggleComplaintDetails(${complaint.complaint_id})">
          <div class="card-header">
            <h3 class="card-title">${complaint.title}</h3>
            <span class="priority-badge ${priorityClass}">${complaint.priority}</span>
          </div>
          <div class="card-preview">
            <p>${complaint.description.substring(0, 100)}${complaint.description.length > 100 ? '...' : ''}</p>
          </div>
        </div>
        
        <!-- Collapsible Content -->
        <div class="collapsible-content" id="complaint-details-${complaint.complaint_id}" style="display: none;">
          <div class="card-content">
            <div class="complaint-details">
              <p><strong>Date:</strong> ${createdAt}</p>
              <p><strong>Gmail:</strong> ${complaint.Citizen ? complaint.Citizen.gmail : 'Not available'}</p>
              <p><strong>Description:</strong> ${complaint.description}</p>
              <p><strong>Location:</strong> ${complaint.street || 'Not provided'}</p>
              <p><strong>Coordinates:</strong> ${complaint.latitude}, ${complaint.longitude}</p>
            </div>
            
            <div class="action-buttons">
              <button class="neon-button green" onclick="trackComplaint.viewMap(${complaint.complaint_id})">VIEW MAP</button>
              <button class="neon-button blue" onclick="trackComplaint.viewMessages(${complaint.complaint_id})">VIEW MESSAGES</button>
              <button class="neon-button red" onclick="trackComplaint.deleteComplaint(${complaint.complaint_id})">DELETE</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

// Initialize the track complaint page when the page loads
document.addEventListener('DOMContentLoaded', () => {
  window.trackComplaint = new TrackComplaint();
});