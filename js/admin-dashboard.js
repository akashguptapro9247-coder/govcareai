// Admin Dashboard JavaScript

// API Configuration - Use the base URL from main.js
const API_BASE_URL = window.API_BASE_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? '' // Empty string means relative URLs for local development
  : 'https://your-backend-domain.com'); // Replace with your actual backend domain

class AdminDashboard {
  constructor() {
    this.complaints = [];
    this.filteredComplaints = [];
    this.init();
  }

  async init() {
    await this.loadComplaints();
    await this.loadDashboardStats();
    this.setupEventListeners();
    this.renderComplaints();
  }

  async loadComplaints() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/complaints/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        this.complaints = await response.json();
        this.filteredComplaints = [...this.complaints];
        console.log('Complaints loaded:', this.complaints);
        // Update dashboard stats when complaints are loaded
        await this.loadDashboardStats();
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
    
    // Add priority and status classes to the complaint card for styling
    const cardPriorityClass = `priority-${complaint.priority.toLowerCase()}`;
    const cardStatusClass = `status-${complaint.status.toLowerCase().replace(' ', '-')}`;
    
    return `
      <div class="complaint-card ${cardPriorityClass} ${cardStatusClass}" data-complaint-id="${complaint.complaint_id}" style="--index: ${this.complaints.indexOf(complaint)}">
        <!-- Collapsible Header -->
        <div class="collapsible-header" onclick="adminDashboard.toggleComplaintDetails(${complaint.complaint_id})">
          <div class="card-header">
            <h3 class="card-title">${complaint.title}</h3>
            <span class="priority-badge ${priorityClass}">${complaint.priority}</span>
          </div>
          <div class="card-preview">
            <p><strong>Description:</strong> ${complaint.description.substring(0, 100)}${complaint.description.length > 100 ? '...' : ''}</p>
          </div>
        </div>
        
        <!-- Collapsible Content -->
        <div class="collapsible-content" id="complaint-details-${complaint.complaint_id}" style="display: none;">
          <div class="card-content">
            <div class="complaint-details">
              <p><strong>Name:</strong> ${complaint.Citizen ? complaint.Citizen.full_name : 'Not available'}</p>
              <p><strong>Email:</strong> ${complaint.Citizen ? complaint.Citizen.gmail : 'Not available'}</p>
              <p><strong>Phone:</strong> ${complaint.phone}</p>
              <p><strong>Street:</strong> ${complaint.street || 'Not provided'}</p>
              <p><strong>Description:</strong> ${complaint.description}</p>
              <p><strong>Coordinates:</strong> ${complaint.latitude}, ${complaint.longitude}</p>
              <p><strong>AI Scores:</strong> Text: ${complaint.ai_score_text}, Image: ${complaint.ai_score_image}, Location: ${complaint.ai_score_location}, Total: ${complaint.ai_score_total}</p>
              <p><strong>Created At:</strong> ${createdAt}</p>
            </div>
            
            <div class="complaint-actions">
              <div class="priority-status-controls">
                <label for="priority-select-${complaint.complaint_id}">Set Priority:</label>
                <select id="priority-select-${complaint.complaint_id}" class="priority-select" onchange="adminDashboard.changePriority(${complaint.complaint_id})">
                  <option value="HIGH" ${complaint.priority === 'HIGH' ? 'selected' : ''}>HIGH</option>
                  <option value="MODERATE" ${complaint.priority === 'MODERATE' ? 'selected' : ''}>MODERATE</option>
                  <option value="LOW" ${complaint.priority === 'LOW' ? 'selected' : ''}>LOW</option>
                </select>
                
                <label for="status-select-${complaint.complaint_id}">Set Status:</label>
                <select id="status-select-${complaint.complaint_id}" class="status-select" onchange="adminDashboard.changeStatus(${complaint.complaint_id})">
                  <option value="PENDING" ${complaint.status === 'PENDING' ? 'selected' : ''}>PENDING</option>
                  <option value="IN PROGRESS" ${complaint.status === 'IN PROGRESS' ? 'selected' : ''}>IN PROGRESS</option>
                  <option value="RESOLVED" ${complaint.status === 'RESOLVED' ? 'selected' : ''}>RESOLVED</option>
                </select>
              </div>
              
              <div class="action-buttons">
                <button class="neon-button blue" onclick="adminDashboard.sendMessage(${complaint.complaint_id})">SEND MESSAGE</button>
                <button class="neon-button purple" onclick="adminDashboard.viewImages(${complaint.complaint_id})">VIEW IMAGES</button>
                <button class="neon-button cyan" onclick="adminDashboard.viewMessages(${complaint.complaint_id})">VIEW MESSAGES</button>
                <button class="neon-button green" onclick="adminDashboard.viewMap(${complaint.complaint_id})">VIEW MAP</button>
                <button class="neon-button red" onclick="adminDashboard.deleteComplaint(${complaint.complaint_id})">DELETE</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  toggleComplaintDetails(complaintId) {
    const content = document.getElementById(`complaint-details-${complaintId}`);
    if (content.style.display === 'none') {
      content.style.display = 'block';
    } else {
      content.style.display = 'none';
    }
  }
  
  openSettings() {
    // Create settings modal
    const settingsModal = document.createElement('div');
    settingsModal.className = 'settings-modal-overlay';
    settingsModal.innerHTML = `
      <div class="settings-modal">
        <div class="settings-header">
          <h2>SYSTEM SETTINGS</h2>
          <button class="settings-close-btn" onclick="this.closest('.settings-modal-overlay').remove()">×</button>
        </div>
        <div class="settings-content">
          <div class="system-info-section">
            <h3>Database Connectivity</h3>
            <div class="info-item">
              <span class="info-label">Database Status:</span>
              <span class="info-value status-indicator" id="db-status">Checking...</span>
            </div>
            <div class="info-item">
              <span class="info-label">Connection Pool:</span>
              <span class="info-value" id="db-pool">N/A</span>
            </div>
            <div class="info-item">
              <span class="info-label">Tables:</span>
              <span class="info-value" id="db-tables">N/A</span>
            </div>
          </div>
          
          <div class="system-info-section">
            <h3>API Connectivity</h3>
            <div class="info-item">
              <span class="info-label">API Status:</span>
              <span class="info-value status-indicator" id="api-status">Checking...</span>
            </div>
            <div class="info-item">
              <span class="info-label">Response Time:</span>
              <span class="info-value" id="api-response">N/A</span>
            </div>
            <div class="info-item">
              <span class="info-label">Active Endpoints:</span>
              <span class="info-value" id="api-endpoints">N/A</span>
            </div>
          </div>
          
          <div class="system-info-section">
            <h3>System Performance</h3>
            <div class="info-item">
              <span class="info-label">Server Status:</span>
              <span class="info-value status-indicator" id="server-status">Checking...</span>
            </div>
            <div class="info-item">
              <span class="info-label">Memory Usage:</span>
              <span class="info-value" id="memory-usage">N/A</span>
            </div>
            <div class="info-item">
              <span class="info-label">CPU Usage:</span>
              <span class="info-value" id="cpu-usage">N/A</span>
            </div>
          </div>
          
          <div class="settings-actions">
            <button class="neon-button red" onclick="adminDashboard.testDatabaseConnection()">TEST DB CONNECTION</button>
            <button class="neon-button blue" onclick="adminDashboard.testApiEndpoints()">TEST API</button>
            <button class="neon-button green" onclick="adminDashboard.refreshSystemInfo()">REFRESH</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(settingsModal);
    
    // Load system information
    this.loadSystemInfo();
  }
  
  async loadSystemInfo() {
    // Test database connection
    await this.testDatabaseConnection();
    
    // Test API endpoints
    await this.testApiEndpoints();
    
    // Get basic system info
    this.getSystemInfo();
  }
  
  async testDatabaseConnection() {
    try {
      const token = localStorage.getItem('token');
      const startTime = Date.now();
      
      const response = await fetch(`${API_BASE_URL}/api/health/database`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      if (response.ok) {
        const data = await response.json();
        document.getElementById('db-status').textContent = 'CONNECTED';
        document.getElementById('db-status').className = 'info-value status-indicator connected';
        document.getElementById('db-pool').textContent = data.pool || 'N/A';
        document.getElementById('db-tables').textContent = data.tables || 'N/A';
      } else {
        document.getElementById('db-status').textContent = 'FAILED';
        document.getElementById('db-status').className = 'info-value status-indicator failed';
        document.getElementById('db-pool').textContent = 'N/A';
        document.getElementById('db-tables').textContent = 'N/A';
      }
    } catch (error) {
      console.error('Database test error:', error);
      document.getElementById('db-status').textContent = 'ERROR';
      document.getElementById('db-status').className = 'info-value status-indicator failed';
    }
  }
  
  async testApiEndpoints() {
    try {
      const token = localStorage.getItem('token');
      const startTime = Date.now();
      
      const response = await fetch(`${API_BASE_URL}/api/health/api`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      if (response.ok) {
        const data = await response.json();
        document.getElementById('api-status').textContent = 'ACTIVE';
        document.getElementById('api-status').className = 'info-value status-indicator connected';
        document.getElementById('api-response').textContent = `${responseTime}ms`;
        document.getElementById('api-endpoints').textContent = data.endpoints || 'N/A';
      } else {
        document.getElementById('api-status').textContent = 'FAILED';
        document.getElementById('api-status').className = 'info-value status-indicator failed';
      }
    } catch (error) {
      console.error('API test error:', error);
      document.getElementById('api-status').textContent = 'ERROR';
      document.getElementById('api-status').className = 'info-value status-indicator failed';
    }
  }
  
  getSystemInfo() {
    // For now, we'll simulate system info
    document.getElementById('server-status').textContent = 'RUNNING';
    document.getElementById('server-status').className = 'info-value status-indicator connected';
    document.getElementById('memory-usage').textContent = '45%';
    document.getElementById('cpu-usage').textContent = '23%';
  }
  
  async refreshSystemInfo() {
    await this.loadSystemInfo();
  }

  changePriority(complaintId) {
    const selectElement = document.getElementById(`priority-select-${complaintId}`);
    const newPriority = selectElement.value;
    
    // Update the complaint priority
    this.updateComplaint(complaintId, { priority: newPriority });
  }

  changeStatus(complaintId) {
    const selectElement = document.getElementById(`status-select-${complaintId}`);
    const newStatus = selectElement.value;
    
    // Update the complaint status
    this.updateComplaint(complaintId, { status: newStatus });
  }

  sendMessage(complaintId) {
    const message = prompt('Enter your message:');
    if (message) {
      this.sendComplaintMessage(complaintId, message);
    }
  }

  async sendComplaintMessage(complaintId, messageText) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/complaints/${complaintId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message_text: messageText,
          sender_type: 'ADMIN'
        })
      });

      if (response.ok) {
        alert('Message sent successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to send message: ${error.message}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message. Please try again.');
    }
  }

  async viewImages(complaintId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/complaints/${complaintId}/images`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const images = await response.json();
        console.log('Images received:', images);
        
        if (images.length === 0) {
          alert('No images found for this complaint.');
          return;
        }
        
        // Create a modal to display images
        let imagesHtml = '<div style="max-width: 800px; margin: 0 auto;">';
        imagesHtml += '<h3>Complaint Images</h3>';
        images.forEach((image, index) => {
          console.log('Image path:', image.image_path);
          // Ensure proper path format for image display
          const imagePath = image.image_path.replace(/\\/g, '/');
          // Check if the image path already includes uploads/ or if we need to add it
          const srcPath = imagePath.startsWith('uploads/') ? `/${imagePath}` : `/uploads/${imagePath}`;
          imagesHtml += `<div style="margin: 15px 0;">
            <p>Image ${index + 1}:</p>
            <img src="${srcPath}" alt="Complaint image" style="max-width: 100%; height: auto; border: 1px solid #00f3ff; border-radius: 5px;" onerror="this.onerror=null; this.parentElement.innerHTML='<p style=\"color: #ff6b6b;\">Image could not be loaded</p><p style=\"font-size: 0.8rem; color: #aaa; margin-top: 5px;\">File: ${imagePath}</p>'">
            <p style="font-size: 0.8rem; color: #aaa; margin-top: 5px;">File: ${imagePath}</p>
            <button class="neon-button download-btn" onclick="adminDashboard.downloadImage('${srcPath}', '${imagePath}')" style="margin-top: 10px; padding: 8px 15px; font-size: 0.9rem;">Download Image</button>
          </div>`;
        });
        imagesHtml += '</div>';
        
        // Show images in a popup/modal
        const modal = document.createElement('div');
        modal.innerHTML = `
          <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
          ">
            <div style="
              background: #000;
              border: 2px solid #00f3ff;
              border-radius: 10px;
              padding: 20px;
              max-width: 90%;
              max-height: 90%;
              overflow: auto;
              position: relative;
            ">
              <button onclick="this.closest('div').parentElement.remove()" style="
                position: absolute;
                top: 10px;
                right: 10px;
                background: #ff0000;
                color: white;
                border: none;
                padding: 8px 12px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
              ">×</button>
              ${imagesHtml}
            </div>
          </div>
        `;
        
        document.body.appendChild(modal);
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch images:', errorData);
        alert(`Failed to fetch images for this complaint: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      alert('Error fetching images. Please try again. Check console for details.');
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

  deleteComplaint(complaintId) {
    if (confirm('Are you sure you want to delete this complaint? This action cannot be undone.')) {
      this.performDeleteComplaint(complaintId);
    }
  }

  async performDeleteComplaint(complaintId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/complaints/${complaintId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Complaint deleted successfully!');
        // Reload complaints to reflect the deletion
        await this.loadComplaints();
        this.renderComplaints();
      } else {
        const error = await response.json();
        alert(`Failed to delete complaint: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting complaint:', error);
      alert('Error deleting complaint. Please try again.');
    }
  }
    
  async viewMessages(complaintId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/complaints/${complaintId}/messages`, {
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
    
  downloadImage(imageSrc, imageName) {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = imageSrc;
    // Extract just the filename from the path for the download
    const filename = imageName.split('/').pop().split('\\').pop();
    link.download = filename;
      
    // Trigger the download
    document.body.appendChild(link);
    link.click();
      
    // Clean up
    document.body.removeChild(link);
  }
    
  setPriority(complaintId) {
    const newPriority = prompt('Enter new priority (HIGH, MODERATE, LOW):');
    if (newPriority && ['HIGH', 'MODERATE', 'LOW'].includes(newPriority.toUpperCase())) {
      this.updateComplaint(complaintId, { priority: newPriority.toUpperCase() });
    } else if (newPriority) {
      alert('Invalid priority. Please enter HIGH, MODERATE, or LOW.');
    }
  }

  setStatus(complaintId) {
    const newStatus = prompt('Enter new status (PENDING, IN PROGRESS, RESOLVED):');
    if (newStatus && ['PENDING', 'IN PROGRESS', 'RESOLVED'].includes(newStatus.toUpperCase())) {
      this.updateComplaint(complaintId, { status: newStatus.toUpperCase() });
    } else if (newStatus) {
      alert('Invalid status. Please enter PENDING, IN PROGRESS, or RESOLVED.');
    }
  }

  async loadDashboardStats() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/complaints/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const stats = await response.json();
        this.updateDashboardStats(stats);
      } else {
        console.error('Failed to load dashboard stats');
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  }
  
  updateDashboardStats(stats) {
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
  }
  
  async updateComplaint(complaintId, updates) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/complaints/${complaintId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        alert('Complaint updated successfully!');
        
        // Find the complaint in the array and update it
        const complaintIndex = this.complaints.findIndex(c => c.complaint_id === complaintId);
        if (complaintIndex !== -1) {
          // Update the complaint object with new values
          this.complaints[complaintIndex] = { ...this.complaints[complaintIndex], ...updates };
          
          // Update the filtered complaints as well
          const filteredIndex = this.filteredComplaints.findIndex(c => c.complaint_id === complaintId);
          if (filteredIndex !== -1) {
            this.filteredComplaints[filteredIndex] = { ...this.filteredComplaints[filteredIndex], ...updates };
          }
          
          // Update the status class on the complaint card
          if (updates.status) {
            const complaintCard = document.querySelector(`[data-complaint-id="${complaintId}"]`);
            if (complaintCard) {
              // Remove old status classes
              complaintCard.classList.remove('status-pending', 'status-in-progress', 'status-resolved');
              
              // Add new status class
              const newStatusClass = `status-${updates.status.toLowerCase().replace(' ', '-')}`;
              complaintCard.classList.add(newStatusClass);
            }
          }
        }
        
        // Re-render only the updated complaint
        this.renderComplaints();
      } else {
        const error = await response.json();
        alert(`Failed to update complaint: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating complaint:', error);
      alert('Error updating complaint. Please try again.');
    }
  }
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
  window.adminDashboard = new AdminDashboard();
});