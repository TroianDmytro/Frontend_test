# Cabinet Page

A new comprehensive dashboard page based on the Figma design, featuring a dark theme and modern UI components.

## Features

### 📊 Charts and Analytics
- **Weekly Progress Chart**: Cubic interpolation line chart showing progress across different courses
- **Progress Circles**: Donut charts showing completion percentages (35% and 50%)
- Built with Chart.js and react-chartjs-2

### 🎯 Task Management
- **Task Cards**: Interactive cards showing current assignments
- **Difficulty Indicators**: Visual badges showing task complexity (Simple/Complex)
- **Add Task**: Plus button for creating new tasks
- **Notification Icons**: Bell icons for task updates

### 📅 Calendar Integration
- **Monthly View**: June 2024 calendar with highlighted current date (17/06)
- **Event Indicators**: Color-coded dots showing different course events
- **Responsive Design**: Adapts to different screen sizes

### 📈 Event Timeline
- **Activity Feed**: Chronological list of recent activities
- **Tab Navigation**: Personal, Feedback, and Statistics views
- **Real-time Updates**: Shows submission times and deadlines

### 🎨 Course Cards
- **Portfolio Items**: Poster and redesign project cards
- **Status Indicators**: "Awaiting Review" and "Graded" states
- **Course Links**: Direct navigation to specific courses
- **Progress Tracking**: Visual progress indicators

### 🔔 Live Stream Section
- **Upcoming Events**: Live Q&A sessions and webinars
- **Registration**: Direct registration links
- **Event Details**: Time, date, and topic information

## Technical Implementation

### Fonts Used
- **TT Autonomous Trial Variable**: Main headings and titles
- **TT Autonomous Mono Trl**: Navigation and UI elements
- **Inter**: Body text and descriptions

### Color Palette
- **Primary Background**: #121212 (Dark)
- **Primary Text**: #F5F5F5 (Light Gray)
- **Accent Blue**: #1951F3
- **Accent Purple**: #6E00BB
- **Border Gray**: #C9CBD3
- **Muted Gray**: #A1A1A1

### Components Structure
```
Cabinet.tsx
├── Header (Notifications, User Profile, Settings)
├── Main Quote Section
├── Weekly Progress Chart
├── Task Management Section
├── Event Flow Timeline
├��─ Calendar Component
├── Course Cards Grid
├── Progress Circles
└── Live Stream Card
```

## Charts Configuration

### Line Chart (Weekly Progress)
- **Type**: Line chart with cubic interpolation
- **Data**: Multi-course progress tracking
- **Styling**: Custom colors and responsive design
- **Interaction**: Hover tooltips and smooth animations

### Donut Charts (Progress Indicators)
- **Type**: Doughnut charts
- **Purpose**: Show completion percentages
- **Styling**: Custom colors matching the design
- **Animation**: Smooth loading transitions

## Responsive Design

The page is designed for 1920x1080 resolution but includes responsive scaling:
- **1440px**: 85% scale
- **1200px**: 70% scale
- **Mobile**: Further optimizations needed

## Navigation

Access the page via: `/cabinet-new`

The old cabinet page remains accessible at: `/Cabinet`

## Dependencies

- **Chart.js**: ^4.x
- **react-chartjs-2**: ^5.x
- **React**: ^18.x
- **TypeScript**: ~5.6.x
- **Tailwind CSS**: ^3.x

## Future Enhancements

1. **Real-time Data**: Connect to backend APIs
2. **Interactive Elements**: Click handlers for all components
3. **Mobile Optimization**: Full responsive design
4. **Animation Framework**: Framer Motion integration
5. **State Management**: Redux or Zustand for complex interactions
6. **Accessibility**: ARIA labels and keyboard navigation
7. **Internationalization**: Multi-language support
