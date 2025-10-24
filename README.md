# Prism Insights - AI-Powered Business Intelligence

## 🚀 Quick Start

### 1. Test Backend Locally
```bash
test-local.bat
```
Server starts on: http://localhost:8000

### 2. Test Backend API
```bash
test-backend.bat
```

### 3. Start Frontend
```bash
npm install
npm run dev
```
Visit: http://localhost:3000

### 4. Deploy to EC2
See: `DEPLOY.md`

---

# Prism Insights - AI-Powered Business Intelligence Platform

A modern, AI-driven business intelligence platform built with Next.js 15 and AWS Bedrock Agents. Prism Insights provides intelligent analytics across multiple business domains including client profitability, software licensing, sales pipeline optimization, and more.

## Features

### AI-Powered Agents

- **Client Profitability Intelligence** - Analyzes client profitability, predicts churn risk, and identifies optimization opportunities
- **Software License Intelligence** - Monitors license usage, identifies cost savings, and optimizes software spend
- **Sales Pipeline Optimization** - Optimizes sales processes and identifies revenue opportunities
- **Resource Allocation & Margin Optimizer** - Optimizes resource allocation and project margins
- **Departmental Spend Analytics** - Tracks and analyzes departmental spending patterns
- **Vendor & Contract Management** - Manages vendor relationships and contract lifecycles

### Modern UI/UX

- Beautiful landing page with smooth animations powered by Framer Motion
- Interactive dashboards with real-time data visualization using Recharts
- Dark mode support with next-themes
- Responsive design with Tailwind CSS 4
- Accessible components built with Radix UI primitives
- Toast notifications with Sonner

### Technical Highlights

- Built with Next.js 15 App Router for optimal performance
- TypeScript for type safety and better developer experience
- AWS Bedrock Agent integration for AI capabilities
- Server-side API routes for secure AWS communication
- State management with Zustand
- Modern React 19 features

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── api/              # Next.js API routes for backend logic
│   │   ├── dashboard/        # Dashboard pages for each agent
│   │   │   ├── client-profitability/
│   │   │   ├── software-license/
│   │   │   ├── sales-pipeline/
│   │   │   ├── resource-allocation/
│   │   │   ├── departmental-spend/
│   │   │   └── vendor-management/
│   │   ├── layout.tsx        # Root layout with theme provider
│   │   ├── page.tsx          # Landing page
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── agent/            # Agent-specific components
│   │   ├── charts/           # Chart components for data visualization
│   │   ├── dashboard/        # Dashboard layout components
│   │   ├── landing/          # Landing page sections
│   │   └── ui/               # Reusable UI components (buttons, cards, etc.)
│   ├── lib/
│   │   ├── api/              # API client utilities
│   │   ├── bedrock/          # AWS Bedrock integration logic
│   │   ├── agents.ts         # Agent configurations and metadata
│   │   ├── chart-utils.ts    # Chart helper functions
│   │   └── utils.ts          # General utility functions
│   └── types/
│       └── index.ts          # TypeScript type definitions
├── infrastructure/           # AWS CDK infrastructure code
├── public/                   # Static assets
└── package.json             # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 20+ installed
- AWS account with Bedrock access
- AWS credentials with appropriate permissions

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your AWS configuration:

```env
# AWS Bedrock Agent Configuration (Server-side only)
BEDROCK_AGENT_ID=your-agent-id
BEDROCK_AGENT_ALIAS_ID=your-alias-id

SOFTWARE_LICENSE_AGENT_ID=your-agent-id
SOFTWARE_LICENSE_AGENT_ALIAS_ID=your-alias-id

SALES_PIPELINE_AGENT_ID=your-agent-id
SALES_PIPELINE_AGENT_ALIAS_ID=your-alias-id

AWS_REGION=us-east-2

# AWS Credentials (Server-side only - NOT exposed to client)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://your-api-gateway-url
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Infrastructure Deployment

The platform includes AWS CDK infrastructure for deploying Bedrock Agents, Lambda functions, DynamoDB tables, and supporting services.

```bash
cd infrastructure
npm install
npm run deploy
```

For detailed deployment instructions, see the infrastructure documentation:
- [Infrastructure Quickstart](infrastructure/QUICKSTART.md)
- [Bedrock Agent Deployment](infrastructure/BEDROCK_AGENT_DEPLOYMENT.md)
- [Software License Agent Setup](infrastructure/SOFTWARE_LICENSE_AGENT_DEPLOYMENT.md)
- [Sales Pipeline Agent Setup](infrastructure/SALES_PIPELINE_AGENT_DEPLOYMENT.md)

## Available Scripts

```bash
npm run dev      # Start development server on port 3000
npm run build    # Build production-ready application
npm run start    # Start production server
```

## Tech Stack

### Frontend
- **Framework:** Next.js 15.5.5 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI (Avatar, Dialog, Dropdown, Tabs, Tooltip)
- **Animations:** Framer Motion 12
- **Charts:** Recharts 3
- **State Management:** Zustand 5
- **Icons:** Lucide React
- **Notifications:** Sonner

### Backend & Infrastructure
- **Cloud Provider:** AWS
- **AI/ML:** AWS Bedrock Agents
- **Infrastructure as Code:** AWS CDK (TypeScript)
- **Database:** Amazon DynamoDB
- **Storage:** Amazon S3
- **Compute:** AWS Lambda
- **AI Services:** AWS Comprehend, AWS Textract

## Dashboard Features

Each agent dashboard includes:

- **Real-time Metrics** - Key performance indicators and business metrics
- **Interactive Charts** - Data visualizations with drill-down capabilities
- **AI Chat Interface** - Natural language queries powered by Bedrock agents
- **Actionable Insights** - AI-generated recommendations and alerts
- **Export Capabilities** - Download reports and data exports

## AWS Bedrock Integration

The platform integrates with AWS Bedrock agents through secure server-side API routes:

- Agent invocations are proxied through Next.js API routes
- AWS credentials are never exposed to the client
- Session management for conversation context
- Streaming responses for real-time interaction
- Error handling and retry logic

### Security Best Practices

- All AWS credentials stored server-side only
- Environment variables validated at runtime
- API routes implement proper authentication
- CORS policies properly configured
- IAM roles follow principle of least privilege

## Development

### Adding a New Agent

1. Add agent configuration to `src/lib/agents.ts`
2. Create dashboard page in `src/app/dashboard/[agent-id]/page.tsx`
3. Implement agent-specific components in `src/components/agent/`
4. Configure AWS Bedrock agent in infrastructure stack
5. Deploy infrastructure and update environment variables

### Styling Guidelines

- Use Tailwind utility classes for styling
- Follow the existing color scheme and design tokens
- Ensure responsive design for all screen sizes (mobile, tablet, desktop)
- Test dark mode compatibility for all components
- Maintain consistent spacing and typography

### Code Quality

- Write TypeScript with strict type checking enabled
- Follow React best practices and hooks rules
- Keep components small, focused, and reusable
- Use meaningful variable and function names
- Add comments for complex logic
- Write unit tests for critical functionality

## Deployment

### Production Build

```bash
npm run build
npm run start
```

### Environment Variables

Ensure all required environment variables are set in your production environment:

- `BEDROCK_AGENT_ID` - Primary Bedrock agent ID
- `BEDROCK_AGENT_ALIAS_ID` - Primary agent alias ID
- `AWS_REGION` - AWS region (e.g., us-east-2)
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `NEXT_PUBLIC_API_BASE_URL` - API Gateway URL

### Recommended Platforms

- **Vercel** - Optimized for Next.js with zero configuration
- **AWS Amplify** - Integrated with AWS services
- **AWS EC2** - Full control with Docker containers
- **Any Node.js hosting** - Compatible with standard Node.js environments

## Troubleshooting

### Common Issues

**Issue: "Access Denied" when calling Bedrock**
- Verify AWS credentials have `bedrock:InvokeAgent` permission
- Check that agent ID and alias ID are correct in `.env.local`
- Ensure the agent is deployed and active in AWS console

**Issue: Charts not rendering**
- Ensure data is in the correct format expected by Recharts
- Check browser console for JavaScript errors
- Verify chart component props are properly typed

**Issue: Dark mode not working**
- Clear browser cache and local storage
- Verify next-themes provider is wrapping the app
- Check that theme toggle component is properly connected

**Issue: API routes returning 500 errors**
- Check server logs for detailed error messages
- Verify environment variables are loaded correctly
- Ensure AWS credentials have necessary permissions

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with proper testing
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request with detailed description

## License

This project is private and proprietary.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Powered by [AWS Bedrock](https://aws.amazon.com/bedrock/)
- Charts by [Recharts](https://recharts.org/)

---

Built by the Prism Insights team
