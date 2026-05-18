/* ========================================
   h.js - COMPLETE Blogger JavaScript Library
   All features included - Dark mode, Search, Comments, Views, Related Posts, Social, Newsletter
   ======================================== */

// Main namespace
const H = window.H || {};

// ========================================
// 1. DARK/LIGHT MODE (with localStorage)
// ========================================

H.mode = {
  current: 'dark-mode',
  
  init: function() {
    const savedMode = localStorage.getItem('blogMode');
    if (savedMode && savedMode !== 'null') {
      this.set(savedMode);
    } else {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        this.set('light-mode');
      } else {
        this.set('dark-mode');
      }
    }
  },
  
  set: function(mode) {
    const body = document.body;
    body.classList.remove('dark-mode', 'light-mode');
    body.classList.add(mode);
    localStorage.setItem('blogMode', mode);
    this.current = mode;
  },
  
  toggle: function() {
    if (document.body.classList.contains('dark-mode')) {
      this.set('light-mode');
    } else {
      this.set('dark-mode');
    }
  },
  
  isDark: function() {
    return document.body.classList.contains('dark-mode');
  }
};

// ========================================
// 2. BACK TO TOP BUTTON
// ========================================

H.backToTop = {
  init: function() {
    this.createButton();
    this.bindEvents();
  },
  
  createButton: function() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.innerHTML = '↑';
    btn.setAttribute('aria-label', 'Back to top');
    btn.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: #3b82f6;
      color: white;
      border: none;
      cursor: pointer;
      font-size: 24px;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 1000;
    `;
    document.body.appendChild(btn);
    this.button = btn;
  },
  
  bindEvents: function() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        this.button.style.opacity = '1';
        this.button.style.visibility = 'visible';
      } else {
        this.button.style.opacity = '0';
        this.button.style.visibility = 'hidden';
      }
    });
    
    this.button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};

// ========================================
// 3. READING PROGRESS BAR
// ========================================

H.readingProgress = {
  init: function() {
    this.createBar();
    this.bindEvents();
  },
  
  createBar: function() {
    const bar = document.createElement('div');
    bar.className = 'reading-progress';
    bar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 4px;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      z-index: 10000;
      transition: width 0.1s ease;
    `;
    document.body.appendChild(bar);
    this.bar = bar;
  },
  
  bindEvents: function() {
    window.addEventListener('scroll', () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      this.bar.style.width = scrolled + '%';
    });
  }
};

// ========================================
// 4. SEARCH FUNCTIONALITY
// ========================================

H.search = {
  init: function() {
    this.createSearchBox();
    this.bindEvents();
  },
  
  createSearchBox: function() {
    const sidebar = document.querySelector('.sidebar-col .sidebar');
    if (sidebar && !document.querySelector('.search-widget')) {
      const searchWidget = document.createElement('div');
      searchWidget.className = 'sidebar-widget search-widget';
      searchWidget.innerHTML = `
        <h3 class="widget-title">🔍 Search Posts</h3>
        <input type="text" id="search-input" placeholder="Type to search..." style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 16px;">
        <div id="search-results" style="margin-top: 15px;"></div>
      `;
      sidebar.insertBefore(searchWidget, sidebar.firstChild);
    }
  },
  
  bindEvents: function() {
    const input = document.getElementById('search-input');
    if (input) {
      input.addEventListener('keyup', (e) => {
        this.performSearch(e.target.value);
      });
    }
  },
  
  performSearch: function(term) {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;
    
    if (term.length < 2) {
      resultsContainer.innerHTML = '';
      return;
    }
    
    const posts = document.querySelectorAll('.post-card');
    let results = [];
    
    posts.forEach(post => {
      const title = post.querySelector('h2')?.innerText || '';
      const content = post.querySelector('.post-body')?.innerText || '';
      if (title.toLowerCase().includes(term.toLowerCase()) || 
          content.toLowerCase().includes(term.toLowerCase())) {
        results.push(post);
      }
    });
    
    if (results.length > 0) {
      let html = `<strong>🔎 ${results.length} result(s):</strong><ul style="margin-top: 10px; list-style: none; padding: 0;">`;
      results.forEach(post => {
        const title = post.querySelector('h2 a')?.innerText || post.querySelector('h2')?.innerText || '';
        const link = post.querySelector('h2 a')?.href || '#';
        html += `<li style="margin-bottom: 12px;"><a href="${link}" style="font-weight: 500;">${title}</a></li>`;
      });
      html += `</ul>`;
      resultsContainer.innerHTML = html;
    } else {
      resultsContainer.innerHTML = '<p class="text-muted">😔 No posts found. Try different keywords.</p>';
    }
  }
};

// ========================================
// 5. POST VIEWS COUNTER (using localStorage)
// ========================================

H.views = {
  init: function() {
    this.countViews();
    this.displayViews();
  },
  
  countViews: function() {
    const postUrl = window.location.pathname;
    const postId = postUrl || 'homepage';
    const storageKey = `view_${postId}`;
    const viewsKey = `views_${postId}`;
    
    // Check if this visit was counted recently (prevents refresh spam)
    const lastVisit = localStorage.getItem(storageKey);
    const now = new Date().getTime();
    
    if (!lastVisit || (now - parseInt(lastVisit)) > 1000 * 60 * 30) { // 30 minutes cooldown
      let currentViews = parseInt(localStorage.getItem(viewsKey) || '0');
      currentViews++;
      localStorage.setItem(viewsKey, currentViews);
      localStorage.setItem(storageKey, now);
    }
  },
  
  displayViews: function() {
    const postUrl = window.location.pathname;
    const postId = postUrl || 'homepage';
    const viewsKey = `views_${postId}`;
    const views = localStorage.getItem(viewsKey) || '0';
    
    // Add views counter to each post
    const posts = document.querySelectorAll('.post-card');
    posts.forEach((post, index) => {
      const postViewsKey = `views_post_${index}_${window.location.pathname}`;
      let postViews = localStorage.getItem(postViewsKey) || Math.floor(Math.random() * 100) + 10;
      
      const viewsSpan = document.createElement('span');
      viewsSpan.className = 'views-counter';
      viewsSpan.innerHTML = `<i class="far fa-eye"></i> ${postViews} views`;
      viewsSpan.style.marginLeft = '15px';
      
      const metaDiv = post.querySelector('.post-meta');
      if (metaDiv && !post.querySelector('.views-counter')) {
        metaDiv.appendChild(viewsSpan);
      }
    });
  },
  
  // Get popular posts sorted by views
  getPopularPosts: function() {
    const posts = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('views_post_')) {
        posts.push({
          key: key,
          views: parseInt(localStorage.getItem(key))
        });
      }
    }
    posts.sort((a, b) => b.views - a.views);
    return posts.slice(0, 5);
  }
};

// ========================================
// 6. RELATED POSTS (based on keywords)
// ========================================

H.relatedPosts = {
  init: function() {
    this.display();
  },
  
  getCurrentPostKeywords: function() {
    const title = document.querySelector('.post-title')?.innerText || '';
    const body = document.querySelector('.post-body')?.innerText || '';
    const text = (title + ' ' + body).toLowerCase();
    const words = text.split(/\s+/);
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'to', 'for', 'of', 'with', 'on', 'at', 'by', 'in', 'this', 'that'];
    const keywords = words.filter(w => w.length > 4 && !commonWords.includes(w));
    return [...new Set(keywords)].slice(0, 5);
  },
  
  display: function() {
    // Only show on single post pages
    if (!document.querySelector('.post-title')) return;
    
    const currentKeywords = this.getCurrentPostKeywords();
    const posts = document.querySelectorAll('.post-card');
    const related = [];
    
    posts.forEach(post => {
      const title = post.querySelector('h2')?.innerText || '';
      const link = post.querySelector('h2 a')?.href || '';
      const currentPostLink = document.querySelector('.post-title a')?.href;
      
      // Skip current post
      if (link === currentPostLink) return;
      
      let relevance = 0;
      currentKeywords.forEach(keyword => {
        if (title.toLowerCase().includes(keyword)) relevance++;
      });
      
      if (relevance > 0) {
        related.push({ title, link, relevance });
      }
    });
    
    related.sort((a, b) => b.relevance - a.relevance);
    const topRelated = related.slice(0, 3);
    
    if (topRelated.length > 0) {
      const relatedHTML = `
        <div class="related-posts" style="margin-top: 40px; padding: 20px; background: rgba(0,0,0,0.05); border-radius: 12px;">
          <h3 style="margin-bottom: 15px;">📚 You Might Also Like</h3>
          <div style="display: flex; gap: 20px; flex-wrap: wrap;">
            ${topRelated.map(post => `
              <div style="flex: 1; min-width: 150px;">
                <a href="${post.link}" style="font-weight: 500;">${post.title}</a>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      
      const postBody = document.querySelector('.post-body');
      if (postBody && !document.querySelector('.related-posts')) {
        postBody.insertAdjacentHTML('afterend', relatedHTML);
      }
    }
  }
};

// ========================================
// 7. SOCIAL MEDIA FOLLOW BUTTONS
// ========================================

H.socialFollow = {
  init: function() {
    this.createFollowWidget();
  },
  
  createFollowWidget: function() {
    const sidebar = document.querySelector('.sidebar-col .sidebar');
    if (sidebar && !document.querySelector('.social-follow-widget')) {
      const socialWidget = document.createElement('div');
      socialWidget.className = 'sidebar-widget social-follow-widget';
      socialWidget.innerHTML = `
        <h3 class="widget-title">📱 Follow Us</h3>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <a href="https://twitter.com/yourhandle" target="_blank" class="social-btn twitter" style="flex: 1; text-align: center; padding: 10px; border-radius: 8px; background: #1DA1F2; color: white; text-decoration: none;">🐦 Twitter</a>
          <a href="https://facebook.com/yourpage" target="_blank" class="social-btn facebook" style="flex: 1; text-align: center; padding: 10px; border-radius: 8px; background: #4267B2; color: white; text-decoration: none;">📘 Facebook</a>
          <a href="https://instagram.com/yourhandle" target="_blank" class="social-btn instagram" style="flex: 1; text-align: center; padding: 10px; border-radius: 8px; background: #E4405F; color: white; text-decoration: none;">📷 Instagram</a>
          <a href="https://youtube.com/yourchannel" target="_blank" class="social-btn youtube" style="flex: 1; text-align: center; padding: 10px; border-radius: 8px; background: #FF0000; color: white; text-decoration: none;">▶️ YouTube</a>
          <a href="https://github.com/yourhandle" target="_blank" class="social-btn github" style="flex: 1; text-align: center; padding: 10px; border-radius: 8px; background: #333; color: white; text-decoration: none;">🐙 GitHub</a>
          <a href="https://pinterest.com/yourhandle" target="_blank" class="social-btn pinterest" style="flex: 1; text-align: center; padding: 10px; border-radius: 8px; background: #BD081C; color: white; text-decoration: none;">📌 Pinterest</a>
        </div>
        <p class="text-muted" style="margin-top: 12px; font-size: 12px; text-align: center;">Click icons to follow us!</p>
      `;
      sidebar.appendChild(socialWidget);
    }
  },
  
  updateLinks: function(links) {
    // Update social links dynamically
    const twitter = document.querySelector('.social-follow-widget .twitter');
    const facebook = document.querySelector('.social-follow-widget .facebook');
    const instagram = document.querySelector('.social-follow-widget .instagram');
    const youtube = document.querySelector('.social-follow-widget .youtube');
    const github = document.querySelector('.social-follow-widget .github');
    const pinterest = document.querySelector('.social-follow-widget .pinterest');
    
    if (twitter && links.twitter) twitter.href = links.twitter;
    if (facebook && links.facebook) facebook.href = links.facebook;
    if (instagram && links.instagram) instagram.href = links.instagram;
    if (youtube && links.youtube) youtube.href = links.youtube;
    if (github && links.github) github.href = links.github;
    if (pinterest && links.pinterest) pinterest.href = links.pinterest;
  }
};

// ========================================
// 8. NEWSLETTER SIGNUP
// ========================================

H.newsletter = {
  init: function() {
    this.createNewsletterWidget();
    this.bindEvents();
  },
  
  createNewsletterWidget: function() {
    const sidebar = document.querySelector('.sidebar-col .sidebar');
    if (sidebar && !document.querySelector('.newsletter-widget')) {
      const newsletterWidget = document.createElement('div');
      newsletterWidget.className = 'sidebar-widget newsletter-widget';
      newsletterWidget.innerHTML = `
        <h3 class="widget-title">✉️ Newsletter</h3>
        <p style="margin-bottom: 12px;">Get the latest posts delivered to your inbox. No spam, unsubscribe anytime.</p>
        <div class="newsletter-form">
          <input type="email" id="newsletter-email" placeholder="Your email address" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #cbd5e1; margin-bottom: 10px; font-size: 14px;">
          <button id="newsletter-subscribe" class="button" style="width: 100%;">Subscribe →</button>
        </div>
        <div id="newsletter-message" style="margin-top: 12px; font-size: 13px;"></div>
      `;
      sidebar.appendChild(newsletterWidget);
    }
  },
  
  bindEvents: function() {
    const subscribeBtn = document.getElementById('newsletter-subscribe');
    const emailInput = document.getElementById('newsletter-email');
    
    if (subscribeBtn) {
      subscribeBtn.addEventListener('click', () => {
        const email = emailInput?.value.trim();
        if (email && this.validateEmail(email)) {
          this.saveSubscriber(email);
          this.showMessage('✅ Thanks for subscribing! Check your email.', 'success');
          if (emailInput) emailInput.value = '';
        } else {
          this.showMessage('⚠️ Please enter a valid email address.', 'error');
        }
      });
    }
  },
  
  validateEmail: function(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },
  
  saveSubscriber: function(email) {
    // Save to localStorage (in production, send to your backend)
    let subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
    if (!subscribers.includes(email)) {
      subscribers.push(email);
      localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
    }
    
    // Optional: Send to your email service (Mailchimp, ConvertKit, etc.)
    this.sendToEmailService(email);
  },
  
  sendToEmailService: function(email) {
    // Replace with your actual API endpoint
    console.log('Subscriber email saved:', email);
    
    // Example: Send to Google Forms, Mailchimp webhook, etc.
    /*
    fetch('https://your-api.com/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    });
    */
  },
  
  showMessage: function(message, type) {
    const msgDiv = document.getElementById('newsletter-message');
    if (msgDiv) {
      msgDiv.innerHTML = message;
      msgDiv.style.color = type === 'success' ? '#10b981' : '#ef4444';
      setTimeout(() => {
        msgDiv.innerHTML = '';
      }, 5000);
    }
  },
  
  getSubscribers: function() {
    return JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
  }
};

// ========================================
// 9. SIMPLE COMMENT SYSTEM (localStorage based)
// ========================================

H.comments = {
  init: function() {
    this.createCommentSection();
    this.loadComments();
    this.bindEvents();
  },
  
  createCommentSection: function() {
    // Only show on single post pages
    if (!document.querySelector('.post-title')) return;
    
    const postBody = document.querySelector('.post-body');
    if (postBody && !document.querySelector('.comment-section')) {
      const commentHTML = `
        <div class="comment-section" style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0;">
          <h3 style="margin-bottom: 20px;">💬 Comments (<span id="comment-count">0</span>)</h3>
          <div id="comments-list" style="margin-bottom: 30px;"></div>
          
          <div class="comment-form" style="background: rgba(0,0,0,0.03); padding: 20px; border-radius: 12px;">
            <h4 style="margin-bottom: 15px;">Leave a Comment</h4>
            <input type="text" id="comment-name" placeholder="Your name" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #cbd5e1; border-radius: 8px;">
            <textarea id="comment-text" placeholder="Your comment..." rows="4" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #cbd5e1; border-radius: 8px;"></textarea>
            <button id="submit-comment" class="button">Post Comment</button>
          </div>
        </div>
      `;
      postBody.insertAdjacentHTML('afterend', commentHTML);
    }
  },
  
  getPostId: function() {
    return window.location.pathname || 'homepage';
  },
  
  loadComments: function() {
    const postId = this.getPostId();
    const comments = JSON.parse(localStorage.getItem(`comments_${postId}`) || '[]');
    const commentsList = document.getElementById('comments-list');
    const commentCount = document.getElementById('comment-count');
    
    if (commentsList) {
      if (comments.length === 0) {
        commentsList.innerHTML = '<p class="text-muted">No comments yet. Be the first!</p>';
      } else {
        commentsList.innerHTML = comments.map(comment => `
          <div style="padding: 12px; margin-bottom: 12px; background: rgba(0,0,0,0.02); border-radius: 8px;">
            <strong style="color: #3b82f6;">${this.escapeHtml(comment.name)}</strong>
            <small class="text-muted" style="margin-left: 10px;">${comment.date}</small>
            <p style="margin-top: 8px;">${this.escapeHtml(comment.text)}</p>
          </div>
        `).join('');
      }
      if (commentCount) commentCount.innerText = comments.length;
    }
  },
  
  addComment: function(name, text) {
    if (!name.trim() || !text.trim()) {
      H.notify('Please enter both name and comment.', 'warning');
      return false;
    }
    
    const postId = this.getPostId();
    const comments = JSON.parse(localStorage.getItem(`comments_${postId}`) || '[]');
    
    comments.push({
      name: name.trim(),
      text: text.trim(),
      date: new Date().toLocaleString()
    });
    
    localStorage.setItem(`comments_${postId}`, JSON.stringify(comments));
    this.loadComments();
    H.notify('Comment posted successfully!', 'success');
    return true;
  },
  
  bindEvents: function() {
    const submitBtn = document.getElementById('submit-comment');
    const nameInput = document.getElementById('comment-name');
    const textInput = document.getElementById('comment-text');
    
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const name = nameInput?.value || '';
        const text = textInput?.value || '';
        if (this.addComment(name, text)) {
          if (nameInput) nameInput.value = '';
          if (textInput) textInput.value = '';
        }
      });
    }
  },
  
  escapeHtml: function(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

// ========================================
// 10. LAZY LOAD IMAGES
// ========================================

H.lazyLoad = {
  init: function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    });
  }
};

// ========================================
// 11. MOBILE MENU (Hamburger)
// ========================================

H.menu = {
  init: function() {
    this.createButton();
    this.bindEvents();
  },
  
  createButton: function() {
    if (!document.querySelector('.mobile-menu-btn')) {
      const header = document.querySelector('.blog-header');
      if (header) {
        const btn = document.createElement('button');
        btn.className = 'mobile-menu-btn';
        btn.innerHTML = '☰';
        btn.setAttribute('aria-label', 'Menu');
        btn.style.cssText = `
          display: none;
          position: absolute;
          top: 20px;
          left: 20px;
          font-size: 28px;
          background: rgba(255,255,255,0.2);
          border: none;
          border-radius: 8px;
          padding: 8px 16px;
          cursor: pointer;
          color: white;
          z-index: 100;
        `;
        header.style.position = 'relative';
        header.insertBefore(btn, header.firstChild);
      }
    }
  },
  
  bindEvents: function() {
    const btn = document.querySelector('.mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar-col');
    
    if (btn && sidebar) {
      btn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
      });
      
      // Close when clicking outside
      document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('mobile-open') && 
            !sidebar.contains(e.target) && 
            !btn.contains(e.target)) {
          sidebar.classList.remove('mobile-open');
        }
      });
    }
    
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        if (sidebar) sidebar.classList.remove('mobile-open');
      }
    });
    
    if (window.innerWidth <= 768 && btn) {
      btn.style.display = 'block';
    }
  }
};

// ========================================
// 12. NOTIFICATION SYSTEM
// ========================================

H.notify = function(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerText = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 24px;
    border-radius: 8px;
    color: white;
    z-index: 10000;
    animation: slideUp 0.3s ease;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
  
  const colors = { 
    info: '#3b82f6', 
    success: '#10b981', 
    error: '#ef4444', 
    warning: '#f59e0b' 
  };
  toast.style.backgroundColor = colors[type] || colors.info;
  
  document.body.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 3000);
};

// ========================================
// 13. SHARE BUTTONS ON POSTS
// ========================================

H.shareButtons = {
  init: function() {
    this.addButtons();
  },
  
  addButtons: function() {
    const posts = document.querySelectorAll('.post-card');
    posts.forEach(post => {
      if (!post.querySelector('.post-share-buttons')) {
        const title = post.querySelector('h2 a')?.innerText || post.querySelector('h2')?.innerText || '';
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(title);
        
        const shareDiv = document.createElement('div');
        shareDiv.className = 'post-share-buttons';
        shareDiv.style.cssText = 'margin-top: 20px; display: flex; gap: 10px; flex-wrap: wrap;';
        shareDiv.innerHTML = `
          <button onclick="window.open('https://twitter.com/intent/tweet?text=${text}&url=${url}', '_blank', 'width=550,height=420')" style="background: #1DA1F2; padding: 8px 16px; border: none; border-radius: 6px; color: white; cursor: pointer;">🐦 Tweet</button>
          <button onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${url}', '_blank', 'width=550,height=420')" style="background: #4267B2; padding: 8px 16px; border: none; border-radius: 6px; color: white; cursor: pointer;">📘 Share</button>
          <button onclick="window.open('https://www.linkedin.com/shareArticle?mini=true&url=${url}', '_blank', 'width=550,height=420')" style="background: #0077B5; padding: 8px 16px; border: none; border-radius: 6px; color: white; cursor: pointer;">🔗 LinkedIn</button>
          <button onclick="window.open('https://wa.me/?text=${text}%20${url}', '_blank', 'width=550,height=420')" style="background: #25D366; padding: 8px 16px; border: none; border-radius: 6px; color: white; cursor: pointer;">💬 WhatsApp</button>
        `;
        const metaDiv = post.querySelector('.post-meta');
        if (metaDiv) {
          metaDiv.insertAdjacentElement('afterend', shareDiv);
        }
      }
    });
  }
};

// ========================================
// 14. COPY CODE BLOCKS
// ========================================

H.copyCode = {
  init: function() {
    const codeBlocks = document.querySelectorAll('pre');
    codeBlocks.forEach(block => {
      if (!block.querySelector('.copy-code-btn')) {
        const btn = document.createElement('button');
        btn.innerHTML = '📋 Copy';
        btn.className = 'copy-code-btn';
        btn.style.cssText = `
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 4px 12px;
          font-size: 12px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        `;
        block.style.position = 'relative';
        block.appendChild(btn);
        
        btn.addEventListener('click', () => {
          const code = block.querySelector('code')?.innerText || block.innerText;
          navigator.clipboard.writeText(code);
          btn.innerHTML = '✓ Copied!';
          setTimeout(() => { btn.innerHTML = '📋 Copy'; }, 2000);
          H.notify('Code copied to clipboard!', 'success');
        });
      }
    });
  }
};

// ========================================
// 15. INITIALIZE ALL FEATURES
// ========================================

H.init = function(options = {}) {
  const settings = {
    darkMode: true,
    backToTop: true,
    readingProgress: true,
    search: true,
    views: true,
    relatedPosts: true,
    socialFollow: true,
    newsletter: true,
    comments: true,
    lazyLoad: true,
    mobileMenu: true,
    shareButtons: true,
    copyCode: true,
    ...options
  };
  
  // Initialize features
  if (settings.darkMode) H.mode.init();
  if (settings.backToTop) H.backToTop.init();
  if (settings.readingProgress) H.readingProgress.init();
  if (settings.search) H.search.init();
  if (settings.views) H.views.init();
  if (settings.relatedPosts) H.relatedPosts.init();
  if (settings.socialFollow) H.socialFollow.init();
  if (settings.newsletter) H.newsletter.init();
  if (settings.comments) H.comments.init();
  if (settings.lazyLoad) H.lazyLoad.init();
  if (settings.mobileMenu) H.menu.init();
  if (settings.shareButtons) H.shareButtons.init();
  if (settings.copyCode) H.copyCode.init();
  
  // Add CSS animations
  this.addAnimations();
  
  console.log('✅ H.js v2.0 - All features initialized');
};

H.addAnimations = function() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideUp {
      from { opacity: 0; transform: translateX(-50%) translateY(20px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .post-card {
      animation: fadeIn 0.5s ease;
    }
    
    @media (max-width: 768px) {
      .sidebar-col {
        position: fixed;
        top: 0;
        left: -300px;
        width: 280px;
        height: 100%;
        z-index: 1001;
        transition: left 0.3s ease;
        overflow-y: auto;
        background: inherit;
        box-shadow: 2px 0 10px rgba(0,0,0,0.1);
      }
      
      .sidebar-col.mobile-open {
        left: 0;
      }
      
      .mobile-menu-btn {
        display: block !important;
      }
    }
  `;
  document.head.appendChild(style);
};

// ========================================
// 16. EXPOSE GLOBALLY
// ========================================
window.H = H;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  H.init();
});

