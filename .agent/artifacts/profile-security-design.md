# Profile Security Settings Design (2026)

## Design Philosophy

This is a **ruthless, taste-obsessed** security settings interface built for 2026. Zero compromise on clarity, motion quality, or visual hierarchy.

---

## What Was Wrong (2021 Patterns)

### Before:
- Generic "Change Password" form with no context
- No provider awareness (Google vs manual auth)
- No device tracking or session management
- Flat visual hierarchy
- No progressive disclosure
- Zero security indicators or feedback
- Inline error messages that break layout
- No password strength validation

### Why It's Weak:
- **No situational awareness**: Treats all users the same regardless of auth method
- **Poor information scent**: Users can't tell what's safe/dangerous
- **No feedback loops**: Password changes happen in a black box
- **2021 aesthetics**: Flat, generic, no personality

---

## 2026 Shape

### Information Architecture

```
Profile Settings
├── Profile Header (always visible)
│   ├── Avatar with gradient + ring
│   ├── Name, email, role badge
│   └── Auth provider badge (Google/Manual)
│
├── Profile Tab
│   └── Basic info editing
│
└── Security Tab
    ├── Authentication Method (top, always visible)
    │   ├── Visual provider indicator
    │   └── Active status badge
    │
    ├── Password Management (conditional)
    │   ├── Google users without password: "Add Password" CTA
    │   ├── Google users with password: Standard change flow
    │   ├── Manual users: Standard change flow
    │   └── Real-time password strength indicator
    │
    └── Active Sessions
        ├── Device cards with metadata
        ├── Current device indicator
        └── Revoke action for other devices
```

### Design Tokens (OKLCH)

**Why OKLCH?**
- Perceptually uniform color space
- Better interpolation than HSL
- 2026 standard for modern web

**Security State Colors:**
```css
--success: oklch(0.6 0.118 184.704)    /* Green - safe actions */
--warning: oklch(0.828 0.189 84.429)   /* Yellow - caution */
--danger: oklch(0.577 0.245 27.325)    /* Red - destructive */
```

**Password Strength:**
- Weak (< 40%): Red
- Good (40-70%): Yellow
- Strong (70%+): Green

**Semantic Backgrounds:**
```css
bg-[oklch(...)]/10     /* 10% opacity for subtle backgrounds */
border-[oklch(...)]/30 /* 30% opacity for borders */
text-[oklch(...)]      /* Full opacity for text */
```

---

## Component Breakdown

### 1. Authentication Method Card

**Purpose:** Immediate visual confirmation of how user signed in

**Design:**
- Icon-first layout (Google logo or Key icon)
- Provider name + email context
- "Active" badge with checkmark
- Muted background to separate from actionable items

**Microcopy:**
- Google: "Signed in with {email}"
- Manual: "Standard authentication"

### 2. Password Management (Conditional UI)

**Three States:**

#### State A: Google User, No Password
```
[Add Password Button]
```
- Progressive disclosure
- Click reveals full form
- Cancel button to collapse

#### State B: Google User, Adding Password
```
New Password: [input with strength meter]
Confirm Password: [input]
[Add Password] [Cancel]
```
- No "Current Password" field (they don't have one)
- Strength meter appears on first keystroke
- Cancel collapses form

#### State C: Manual User or Google User with Password
```
Current Password: [input]
New Password: [input with strength meter]
Confirm Password: [input]
[Update Password]
```
- Standard 3-field flow
- Strength meter on new password

**Password Strength Indicator:**
- Real-time calculation (8+ chars, uppercase, lowercase, numbers, symbols)
- Animated progress bar (300ms transition)
- Color-coded label (Weak/Good/Strong)
- Positioned below new password field

### 3. Active Sessions (Device Management)

**Layout:**
- Staggered fade-in animation (100ms delay per item)
- Device icon (Monitor/Smartphone) in colored circle
- Metadata grid: Browser, Location, Last Active
- "This device" badge for current session
- Revoke button (X icon) for other devices

**Hover States:**
- Card background: `hover:bg-muted/30`
- Revoke button: `hover:bg-destructive/10`
- 200ms transition

**Device Card Structure:**
```
[Icon] Device Name [This device badge]
       Browser
       Location
       Last Active
                                    [X Revoke]
```

---

## Motion Quality (60ms Feel)

### Micro-animations

**Password Strength Bar:**
```css
transition: all 300ms ease-out
```
- Width animates as user types
- Color transitions smoothly
- No janky jumps

**Device Cards:**
```css
animation: fadeInUp 0.3s ease-out ${index * 0.1}s both
```
- Stagger by 100ms per card
- Feels alive, not static
- Only on mount, not on every render

**Global Messages:**
```css
animate-in slide-in-from-top-2 duration-200
```
- Slides in from top
- 200ms duration
- Auto-dismisses after 3s

**Button States:**
- Implicit hover/active states from shadcn
- Scale + opacity on press (built into Button component)

### View Transitions (Future)

When View Transitions API is stable:
```tsx
// Wrap password form reveal
<div style={{ viewTransitionName: 'password-form' }}>
  {showAddPassword && <PasswordForm />}
</div>
```

---

## Accessibility (a11y)

### Keyboard Navigation
- All interactive elements focusable
- Logical tab order (top to bottom)
- Focus visible states (ring-2 ring-ring)

### Screen Readers
- Semantic HTML (Card, Label, Input)
- Icon-only buttons have aria-labels
- Status messages announced via role="status"

### Color Contrast
- OKLCH ensures perceptual uniformity
- Text colors meet WCAG AA (4.5:1)
- Icons paired with text labels

### Form Validation
- HTML5 required attributes
- Client-side validation before submit
- Error messages in accessible format

---

## Anti-Patterns Avoided

### ❌ Don't:
1. **Show password change to Google users without context**
   - They might not have a password yet
   - Confusing UX

2. **Use generic error messages**
   - "Passwords do not match" ✅
   - "Error" ❌

3. **Hide device list behind "Manage devices" link**
   - Security info should be visible
   - No unnecessary clicks

4. **Use red/green only for password strength**
   - Also use labels (Weak/Good/Strong)
   - Colorblind accessible

5. **Inline error messages that shift layout**
   - Use fixed-position global message
   - No layout shift

### ✅ Do:
1. **Provider-aware UI**
   - Detect Google vs manual auth
   - Show relevant options only

2. **Progressive disclosure**
   - Hide "Add Password" form until needed
   - Reduce cognitive load

3. **Real-time feedback**
   - Password strength as you type
   - No surprises on submit

4. **Clear visual hierarchy**
   - Icons + titles for sections
   - Muted backgrounds for info
   - Primary buttons for actions

---

## Visual Direction

### Typography
- Headings: `font-display` (Outfit)
- Body: `font-sans` (Inter)
- Weights: 400 (regular), 500 (medium), 700 (bold)

### Spacing
- Section gaps: `space-y-6` (24px)
- Form fields: `space-y-5` (20px)
- Card padding: `p-4` (16px)

### Borders & Shadows
- Card borders: `border-border/50` (50% opacity)
- Shadows: `shadow-sm` (subtle)
- Rounded corners: `rounded-lg` (12px)

### Interactive Elements
- Input height: `h-11` (44px - touch-friendly)
- Button size: `size-lg` (larger hit targets)
- Icon size: `w-5 h-5` (20px - visible but not overwhelming)

---

## Backend Integration Points

### Current (Mock Data)
```tsx
const isGoogleUser = user?.email?.includes("google") || false
const hasPassword = !isGoogleUser
const mockDevices = [...]
```

### Production (TODO)
```tsx
// 1. Check user.firebaseUid from backend
const isGoogleUser = !!user?.firebaseUid

// 2. Check user.passwordHash from backend
const hasPassword = !!user?.passwordHash

// 3. Fetch devices from API
useEffect(() => {
  fetch('/api/auth/sessions')
    .then(res => res.json())
    .then(data => setDevices(data.sessions))
}, [])

// 4. Revoke device session
const handleRevokeDevice = async (deviceId: string) => {
  await fetch(`/api/auth/sessions/${deviceId}`, { method: 'DELETE' })
  setDevices(devices.filter(d => d.id !== deviceId))
}
```

### API Endpoints Needed
```
GET  /api/auth/sessions          # List active sessions
POST /api/auth/sessions          # Create new session (on login)
DELETE /api/auth/sessions/:id    # Revoke session
POST /api/auth/password/add      # Add password (Google users)
PUT  /api/auth/password/change   # Change password (existing)
```

---

## Concrete Recommendations

### Immediate (Done)
✅ Provider-aware password management
✅ Password strength indicator
✅ Device session UI with mock data
✅ OKLCH color system
✅ Micro-animations
✅ Progressive disclosure

### Next Steps (Backend Integration)
1. **Add `firebaseUid` and `passwordHash` to User type**
   ```ts
   export interface User {
     // ... existing fields
     firebaseUid?: string
     passwordHash?: string
   }
   ```

2. **Create Session model in Prisma**
   ```prisma
   model Session {
     id          String   @id @default(uuid())
     userId      String
     deviceName  String
     deviceType  String
     browser     String
     location    String
     ipAddress   String
     lastActive  DateTime @default(now())
     createdAt   DateTime @default(now())
     user        User     @relation(fields: [userId], references: [id])
   }
   ```

3. **Implement session tracking middleware**
   - Capture device info on login
   - Update lastActive on each request
   - Store in database

4. **Add password management endpoints**
   - `/api/auth/password/add` (for Google users)
   - `/api/auth/password/change` (for all users)
   - Validate current password before change

### Future Enhancements
- **Two-factor authentication (2FA)**
  - Add 2FA section below password management
  - QR code for authenticator apps
  - Backup codes

- **Security activity log**
  - Recent logins
  - Password changes
  - Failed login attempts

- **Email notifications**
  - New device login
  - Password changed
  - Suspicious activity

- **Passkey support**
  - WebAuthn integration
  - Biometric authentication
  - 2026 standard

---

## Design Principles Summary

1. **Clarity over cleverness**
   - No hidden features
   - Obvious actions

2. **Context-aware UI**
   - Different flows for different users
   - No one-size-fits-all

3. **Real-time feedback**
   - Password strength
   - Form validation
   - Success/error states

4. **Motion with purpose**
   - Staggered animations guide attention
   - Smooth transitions reduce jarring changes
   - 60ms feel = instant, not laggy

5. **Accessibility first**
   - Keyboard navigation
   - Screen reader support
   - Color contrast

6. **2026 aesthetics**
   - OKLCH colors
   - Modern typography
   - Subtle shadows
   - Gradient accents

---

## Conclusion

This is **strong**. It's not a 2021 settings page. It's a 2026 security interface that:
- Knows who you are (Google vs manual)
- Shows what you need (conditional UI)
- Guides you with feedback (strength meter, messages)
- Feels premium (OKLCH, animations, typography)
- Scales to production (clear backend integration points)

**Next:** Connect to backend APIs for real device tracking and password management.
