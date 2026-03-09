// View Complaint JavaScript

// API Configuration - Use the base URL from main.js
const API_BASE_URL = window.API_BASE_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? '' // Empty string means relative URLs for local development
  : 'https://your-backend-domain.com'); // Replace with your actual backend domain

class ViewComplaint {
  constructor() {
    this.complaintId = null;
    this.init();
  }

  async init() {
    // Get complaint ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    this.complaintId = urlParams.get('id');
    
    if (this.complaintId) {
      // Load stats first
      await this.loadComplaintStats();
      // Then load complaint details
      this.loadComplaintDetails(this.complaintId);
    } else {
      this.showError('No complaint ID specified');
    }
  }

  async loadComplaintStats() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/complaints/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const stats = await response.json();
        this.updateComplaintStats(stats);
      } else {
        console.error('Failed to load dashboard stats');
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  }
  
  updateComplaintStats(stats) {
    // Update high priority count
    const highPriorityElement = document.querySelector('.stat-high');
    if (highPriorityElement) {
      highPriorityElement.textContent = stats.highPriorityCount;
      // Add class to parent stat card
      const highPriorityCard = highPriorityElement.closest('.stat-card');
      if (highPriorityCard) {
        highPriorityCard.classList.add('high-priority');
      }
    }
    
    // Update moderate priority count
    const moderatePriorityElement = document.querySelector('.stat-moderate');
    if (moderatePriorityElement) {
      moderatePriorityElement.textContent = stats.moderatePriorityCount;
      // Add class to parent stat card
      const moderatePriorityCard = moderatePriorityElement.closest('.stat-card');
      if (moderatePriorityCard) {
        moderatePriorityCard.classList.add('moderate-priority');
      }
    }
    
    // Update low priority count
    const lowPriorityElement = document.querySelector('.stat-low');
    if (lowPriorityElement) {
      lowPriorityElement.textContent = stats.lowPriorityCount;
      // Add class to parent stat card
      const lowPriorityCard = lowPriorityElement.closest('.stat-card');
      if (lowPriorityCard) {
        lowPriorityCard.classList.add('low-priority');
      }
    }
    
    // Update resolved count
    const resolvedElement = document.querySelector('.stat-resolved');
    if (resolvedElement) {
      resolvedElement.textContent = stats.resolvedCount;
      // Add class to parent stat card
      const resolvedCard = resolvedElement.closest('.stat-card');
      if (resolvedCard) {
        resolvedCard.classList.add('resolved-status');
      }
    }
    
    // Update in progress count
    const progressElement = document.querySelector('.stat-progress');
    if (progressElement) {
      progressElement.textContent = stats.inProgressCount;
      // Add class to parent stat card
      const progressCard = progressElement.closest('.stat-card');
      if (progressCard) {
        progressCard.classList.add('progress-status');
      }
    }
    
    // Update pending count
    const pendingElement = document.querySelector('.stat-pending');
    if (pendingElement) {
      pendingElement.textContent = stats.pendingCount;
      // Add class to parent stat card
      const pendingCard = pendingElement.closest('.stat-card');
      if (pendingCard) {
        pendingCard.classList.add('pending-status');
      }
    }
    
    // Show the stats container
    const statsContainer = document.getElementById('complaint-stats');
    if (statsContainer) {
      statsContainer.style.display = 'grid';
    }
  }

  async loadComplaintDetails(complaintId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/complaints/${complaintId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const complaint = await response.json();
        this.renderComplaintDetails(complaint);
      } else if (response.status === 404) {
        this.showError('Complaint not found');
      } else {
        this.showError('Failed to load complaint details');
      }
    } catch (error) {
      console.error('Error loading complaint:', error);
      this.showError('Error loading complaint details');
    }
  }

  renderComplaintDetails(complaint) {
    const container = document.getElementById('complaint-detail-container');
    
    // Format dates
    const createdAt = new Date(complaint.created_at).toLocaleString();
    
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

    // Create HTML for complaint details
    const html = `
      <div class="glass-panel" style="margin-bottom: 2rem;">
        <div class="card-header" style="margin-bottom: 1rem;">
          <h3 class="card-title">${complaint.title}</h3>
          <div>
            <span class="priority-badge ${priorityClass}" style="margin-right: 1rem;">${complaint.priority}</span>
            <span class="status-badge" style="${statusStyle}">${complaint.status}</span>
          </div>
        </div>
        
        <div class="card-content">
          <p><strong>Description:</strong></p>
          <p>${complaint.description}</p>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-top: 1rem;">
            <div>
              <p><strong>Submitted:</strong> ${createdAt}</p>
              <p><strong>Phone:</strong> ${complaint.phone}</p>
              <p><strong>Address:</strong> ${complaint.street || 'Not provided'}</p>
            </div>
            
            <div>
              <p><strong>Location:</strong></p>
              <p>Latitude: ${complaint.latitude || 'Not provided'}</p>
              <p>Longitude: ${complaint.longitude || 'Not provided'}</p>
            </div>
            
            <div>
              <p><strong>AI Analysis Scores:</strong></p>
              <p>Text Analysis: ${complaint.ai_score_text}/50</p>
              <p>Image Analysis: ${complaint.ai_score_image}/20</p>
              <p>Location Analysis: ${complaint.ai_score_location}/30</p>
              <p><strong>Total Score:</strong> ${complaint.ai_score_total}/100</p>
            </div>
          </div>
          
          ${complaint.ComplaintImages && complaint.ComplaintImages.length > 0 ? `
          <div style="margin-top: 1rem;">
            <p><strong>Attached Images:</strong></p>
            <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 0.5rem;">
              ${complaint.ComplaintImages.map(image => `
                <div style="flex: 1 1 200px;">
                  <img src="/${image.image_path}" alt="Complaint image" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}
        </div>
      </div>
      
      ${complaint.ComplaintMessages && complaint.ComplaintMessages.length > 0 ? `
      <div class="glass-panel">
        <h3 style="margin-bottom: 1rem;">Messages</h3>
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${complaint.ComplaintMessages.map(message => {
            const timestamp = new Date(message.timestamp).toLocaleString();
            const isFromAdmin = message.sender_type === 'ADMIN';
            return `
              <div style="display: flex; ${isFromAdmin ? 'justify-content: flex-end;' : ''}">
                <div class="glass-panel" style="max-width: 80%; ${isFromAdmin ? 'background: rgba(189, 0, 255, 0.1);' : ''}">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <strong>${isFromAdmin ? 'Administrator' : 'Citizen'}</strong>
                    <span style="font-size: 0.8rem; opacity: 0.7;">${timestamp}</span>
                  </div>
                  <p>${message.message_text}</p>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      ` : `
      <div class="glass-panel">
        <h3 style="margin-bottom: 1rem;">Messages</h3>
        <p>No messages yet.</p>
      </div>
      `}
    `;
    
    container.innerHTML = html;
  }

  showError(message) {
    const container = document.getElementById('complaint-detail-container');
    container.innerHTML = `
      <div class="glass-panel" style="text-align: center; padding: 2rem;">
        <p style="color: var(--neon-red);">${message}</p>
        <button class="neon-button" onclick="window.location.href='track-complaint.html'" style="margin-top: 1rem;">Back to My Complaints</button>
      </div>
    `;
  }
}

// Initialize the view when the page loads
document.addEventListener('DOMContentLoaded', () => {
  window.viewComplaint = new ViewComplaint();
});