# modern-go-cdn
Create Modern Template Blogger Using "H" Framework

# How to Use h.js in Your Template
Add this to your template's <head> or before </body>:
```xml
<script src='https://your-cdn-or-local/h.js'></script>
Or paste the entire JavaScript directly before </body>:

```xml
<script>
  // PASTE THE ENTIRE h.js CODE HERE
</script>
```

## Features You Can Enable/Disable
Feature	            Setting	                What it does
Dark mode	        darkMode: true	        Remembers user preference
Back to top	        backToTop: true	Shows   button after scrolling
Reading progress	readingProgress: true	Top bar shows scroll %
Search	            search: true	        Adds search box to sidebar
Lazy load	        lazyLoad: true	        Images load when visible
Mobile menu	        mobileMenu: true	    Hamburger menu on phones
Copy code	        copyCode: false	        Adds copy button to code blocks
Share buttons	    shareButtons: false	    Twitter/Facebook share

## How to Call Functions Manually
```javascript
// Toggle dark/light mode
H.mode.toggle();

// Check if dark mode is on
if (H.mode.isDark()) {
  console.log('Dark mode active');
}

// Show a notification
H.notify('Post published!', 'success');
H.notify('Something went wrong', 'error');
H.notify('New update available', 'warning');

// Set specific mode
H.mode.set('light-mode');
```

## CSS to Add for Mobile Menu
- Add this to your CSS for mobile menu support:

```css
/* Mobile menu styles */
.mobile-menu-btn {
  display: none;
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: block !important;
  }
  
  .sidebar-col {
    position: fixed;
    top: 0;
    left: -280px;
    width: 280px;
    height: 100%;
    z-index: 1000;
    transition: left 0.3s ease;
    overflow-y: auto;
  }
  
  .sidebar-col.mobile-open {
    left: 0;
  }
}
```
## Extending h.js - Add Your Own Functions
```javascript
// Add to H object
H.myCustomFeature = {
  init: function() {
    console.log('My custom feature loaded');
  },
  
  doSomething: function() {
    alert('Custom action!');
  }
};

// Call it
H.myCustomFeature.init();

// ## Quick Reference
Function	                    Purpose
H.mode.toggle()	                Switch dark/light mode
H.mode.set('dark-mode')	        Force specific mode
H.notify('message', 'type')	    Show toast notification
H.backToTop	                    Scroll to top button
H.search	                    Live search posts
H.readingProgress	            Scroll progress bar
```

# How to Customize Social Links
- Update your social media URLs:

```javascript
// Add this after H.init()
H.socialFollow.updateLinks({
  twitter: 'https://twitter.com/modern_go',
  facebook: 'https://facebook.com/modernGo',
  instagram: 'https://instagram.com/modern.go',
  youtube: 'https://youtube.com/@modernGo',
  github: 'https://github.com/modern-go',
  pinterest: 'https://pinterest.com/modernGo'
});
```

## How to Connect Newsletter to Real Email Service
## ## ## Replace the sendToEmailService function with your API: ## ## ##
```javascript
sendToEmailService: function(email) {
  // Example: Send to ConvertKit
  fetch('https://api.convertkit.com/v3/forms/YOUR_FORM_ID/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: 'YOUR_API_KEY',
      email: email
    })
  });
  
  // Example: Send to Mailchimp
  // Example: Send to Google Sheets (via Apps Script)
}
```
## Disable Features You Don't Want
```javascript
document.addEventListener('DOMContentLoaded', () => {
  H.init({
    darkMode: true,
    backToTop: true,
    readingProgress: false,  // Turn off
    search: true,
    views: true,
    relatedPosts: true,
    socialFollow: true,
    newsletter: true,
    comments: true,          // Turn off if you use Blogger comments
    lazyLoad: true,
    mobileMenu: true,
    shareButtons: true,
    copyCode: false          // Turn off if no code posts
  });
});
```
## This h.js gives you EVERYTHING
✅ Comment system (no external service needed)
✅ Post views counter
✅ Related posts by keyword matching
✅ Social follow buttons
✅ Newsletter signup (ready for Mailchimp/ConvertKit)
✅ Search, dark mode, back to top, and more


# How to Use h.css
## Option 1: Link as external file
```html
<link href='https://your-cdn.com/h.css' rel='stylesheet'/>
```
## Option 2: Paste directly into your template
Add the entire CSS inside your <b:skin> tag:

```xml
<b:skin version='1.2.0'>
  <![CDATA[
    /* PASTE ALL h.css HERE */
  ]]>
</b:skin>
```

## CSS File Structure Summary
Section	            What it contains
Reset & Base	    Normalizes all browsers
Typography	        Headings, paragraphs, links
Forms & Buttons	    Inputs, selects, buttons
Layout System	    Container, grid, flex
Components	        Cards, widgets, header, footer
Dark Mode	        Complete dark theme
Light Mode	        Complete light theme
Responsive	        Mobile, tablet breakpoints
Utilities	        Margin, padding, colors, flex
Animations	        Fade in, pulse, slide up
Print	            Print-friendly styles

## Quick CSS Class Reference
```css
/* Layout */
.container    - Centers content
.row          - Flex row with gap
.col-main     - Main content column
.col-sidebar  - Sidebar column

/* Components */
.card         - White box with shadow
.post-card    - Blog post card
.sidebar-widget - Sidebar widget
.blog-header  - Top gradient bar

/* Utilities */
.text-center  - Center text
.mt-3         - Margin top 1rem
.mb-4         - Margin bottom 1.5rem
.flex         - Display flex
.gap-3        - Gap 1rem

/* Colors */
.text-primary - Blue text
.text-muted   - Gray text
.bg-primary   - Blue background
```

# How to Use These Components
## Example HTML for each component:
```html
<!-- Navbar -->
<nav class="navbar">
  <div class="navbar-container">
    <div class="navbar-logo"><a href="/">Logo</a></div>
    <button class="navbar-toggle">☰</button>
    <ul class="navbar-menu">
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </div>
</nav>

<!-- Badges -->
<span class="badge badge-primary">New</span>
<span class="badge badge-success">Popular</span>

<!-- Tabs -->
<div class="tabs">
  <button class="tab-btn active">Tab 1</button>
  <button class="tab-btn">Tab 2</button>
</div>
<div class="tab-content active">Content 1</div>
<div class="tab-content">Content 2</div>

<!-- Accordion -->
<div class="accordion-item">
  <div class="accordion-header">Section 1</div>
  <div class="accordion-content">Content here...</div>
</div>

<!-- Tooltip -->
<span class="tooltip" data-tooltip="Tooltip text">Hover me</span>

<!-- Rating -->
<div class="rating">
  <span class="rating-star">★</span>
  <span class="rating-star">★</span>
  <span class="rating-star">★</span>
</div>

<!-- CTA Box -->
<div class="cta">
  <h2>Ready to Start?</h2>
  <button class="button">Get Started</button>
</div>

<!-- Pricing Card -->
<div class="pricing-card featured">
  <div class="pricing-badge">Best Value</div>
  <h3>Pro Plan</h3>
  <div class="pricing-price">$29<span>/month</span></div>
  <button class="button">Buy Now</button>
</div>

<!-- Testimonial -->
<div class="testimonial">
  <p class="testimonial-quote">"Great product!"</p>
  <div class="testimonial-author">
    <img src="avatar.jpg" alt="Author">
    <div>
      <h4>John Doe</h4>
      <p>Happy Customer</p>
    </div>
  </div>
</div>

<!-- Author Bio -->
<div class="author-bio">
  <img src="author.jpg" alt="Author">
  <div>
    <h3>About the Author</h3>
    <p>John is a blogger and developer...</p>
  </div>
</div>
```

# Components Summary
#	Component	Use case
1	Navbar	        Site navigation menu
2	Breadcrumbs	    Page location indicator
3	Tabs	        Organize content
4	Accordion	    FAQ sections
5	Modal	        Popup dialogs
6	Badges	        Status, labels, tags
7	Progress Bar	Skills, loading
8	Tooltip	        Help text on hover
9	Dropdown	    Menu options
10	Slider	        Image carousel
11	Spinner	        Loading indicator
12	Rating	        Star ratings
13	Avatar	        Profile pictures
14	Social Icons	Follow links
15	CTA	            Call to action
16	Pricing Card	Pricing tables
17	Testimonial	    Customer reviews
18	Stats	        Numbers counter
19	Feature Grid	Product features
20	Author Bio	    Post author info

## ## ## You now have a complete UI library! ## ## ##

# h.css = Full styling (base + 20 components)      ##
# h.js = All JavaScript features                   ##
# Template = Structure                ## ## ## ## ## ## ##
