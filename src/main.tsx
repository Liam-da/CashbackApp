import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ConvexReactClient } from 'convex/react'
import App from './App.tsx'
import './styles/globals.css'
import { BasketProvider } from './context/BasketContext.tsx'
import { ScanProvider } from './context/ScanContext.tsx'

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const convexUrl = import.meta.env.VITE_CONVEX_URL

if (!clerkPublishableKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY')
}

if (!convexUrl) {
  throw new Error('Missing VITE_CONVEX_URL')
}

const convex = new ConvexReactClient(convexUrl)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <BasketProvider>
          <ScanProvider>
            <App />
          </ScanProvider>
        </BasketProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </StrictMode>,
)

