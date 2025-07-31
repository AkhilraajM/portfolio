# Portfolio Website - Akhilraaj M

## Overview

This is a personal portfolio website for Akhilraaj M, a Technical Specialist with 7+ years of experience in automotive ADAS systems and software engineering. The website is built as a static single-page application featuring a modern, animated interface with a dark theme and neon accents.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Type**: Static Single Page Application (SPA)
- **Structure**: Traditional HTML/CSS/JavaScript architecture
- **Styling**: Modular CSS with CSS custom properties for theming
- **Navigation**: Smooth scrolling with active section highlighting
- **Responsiveness**: Mobile-first responsive design

### Key Design Decisions
- **Static Site**: Chosen for simplicity, fast loading, and easy deployment without backend requirements
- **Vanilla JavaScript**: Selected over frameworks for lightweight performance and direct DOM control
- **Modular CSS**: Organized into separate files (base, components, animations, responsive) for maintainability
- **CSS Variables**: Used for consistent theming and easy color scheme management

## Key Components

### HTML Structure
- **Main File**: `index.html` - Single page containing all sections
- **Sections**: Hero, About, Experience, Skills, Projects, Contact
- **Navigation**: Fixed header with smooth scrolling links
- **SEO**: Proper meta tags, semantic HTML structure

### CSS Architecture
- **`base.css`**: CSS variables, reset styles, typography, background patterns
- **`components.css`**: Component-specific styles (navbar, cards, buttons, forms)
- **`animations.css`**: Keyframe animations and transition effects
- **`responsive.css`**: Media queries and responsive breakpoints

### JavaScript Modules
- **`main.js`**: Core functionality (navigation, typing animation, scroll effects, form handling)
- **`animations.js`**: Advanced animation controller with Intersection Observer API
- **`mobile.js`**: Mobile-specific optimizations and touch gesture handling

## Data Flow

### User Interaction Flow
1. **Page Load**: Initialize all JavaScript modules and set up observers
2. **Navigation**: Smooth scroll to sections with active link highlighting
3. **Scroll Events**: Trigger animations and update navigation state
4. **Form Interaction**: Contact form validation and submission handling
5. **Mobile Interaction**: Touch gestures and mobile menu functionality

### Animation System
- **Intersection Observer**: Triggers animations when elements enter viewport
- **CSS Animations**: Handles visual effects (fade, slide, scale, glow effects)
- **Performance**: Respects user's reduced motion preferences

## External Dependencies

### Fonts and Icons
- **Google Fonts**: Inter font family for typography
- **Font Awesome**: Icon library (v6.5.1) with CDN fallback
- **Fallback Strategy**: Local fallbacks for offline scenarios

### Third-party Services
- **CDN**: Font Awesome icons loaded via CDN with backup
- **Web Fonts**: Google Fonts with system font fallbacks

## Deployment Strategy

### Static Hosting
- **Architecture**: Client-side only, no server requirements
- **Deployment**: Can be hosted on any static hosting service
- **Performance**: Optimized for fast loading with preloaded resources
- **SEO**: Meta tags and semantic structure for search engine optimization

### Browser Compatibility
- **Modern Browsers**: Designed for current browser versions
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Mobile Support**: Responsive design with touch optimization

### Performance Optimizations
- **Resource Loading**: Preloaded critical fonts and icons
- **Animation Performance**: Hardware-accelerated CSS animations
- **Reduced Motion**: Accessibility support for motion-sensitive users
- **Mobile Optimization**: Touch-friendly interface and gesture support