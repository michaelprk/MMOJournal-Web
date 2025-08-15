#!/usr/bin/env bash
set -euo pipefail

# MMOJournal – quick pre-launch verification
# - Checks security headers in vercel.json
# - Runs npm audit (prod only) and prints a short summary

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VERCEL_FILE="$ROOT_DIR/vercel.json"

echo "==> Checking security headers in vercel.json"
if [[ ! -f "$VERCEL_FILE" ]]; then
  echo "ERROR: vercel.json not found at $VERCEL_FILE" >&2
  exit 1
fi

missing=()

contains() {
  local pattern="$1"
  if ! grep -qE "$pattern" "$VERCEL_FILE"; then
    missing+=("$2")
  fi
}

# Content-Security-Policy (required directives)
contains '"key"\s*:\s*"Content-Security-Policy"' "CSP header key missing"
contains "default-src ',self'" "CSP: default-src 'self' missing"
contains "script-src 'self'" "CSP: script-src 'self' missing"
contains "style-src 'self' 'unsafe-inline'" "CSP: style-src 'self' 'unsafe-inline' missing"
contains "img-src 'self' data: https:" "CSP: img-src 'self' data: https: missing"
contains "connect-src 'self' https: wss:" "CSP: connect-src 'self' https: wss: missing"
contains "object-src none|object-src 'none'" "CSP: object-src 'none' missing"

# HSTS
contains '"key"\s*:\s*"Strict-Transport-Security"' "HSTS header key missing"
contains 'max-age=31536000' "HSTS: max-age=31536000 missing"
contains 'includeSubDomains' "HSTS: includeSubDomains missing"

# X-Content-Type-Options
contains '"key"\s*:\s*"X-Content-Type-Options"' "X-Content-Type-Options header key missing"
contains 'nosniff' "X-Content-Type-Options: nosniff missing"

# Referrer-Policy
contains '"key"\s*:\s*"Referrer-Policy"' "Referrer-Policy header key missing"
contains 'strict-origin-when-cross-origin' "Referrer-Policy: strict-origin-when-cross-origin missing"

# Permissions-Policy
contains '"key"\s*:\s*"Permissions-Policy"' "Permissions-Policy header key missing"
contains "geolocation=\(\), camera=\(\), microphone=\()" "Permissions-Policy: geolocation/camera/microphone disabled missing"

if (( ${#missing[@]} > 0 )); then
  echo "Security headers check: MISSING items detected:" >&2
  for m in "${missing[@]}"; do echo " - $m"; done
else
  echo "Security headers check: OK"
fi

echo
echo "==> Running npm audit (production)"
audit_summary=""
if audit_output=$(npm audit --omit=dev 2>&1); then
  # Try to extract the standard summary line
  if summary_line=$(echo "$audit_output" | grep -E "found [0-9]+ (high|moderate|low|critical)? vulnerabilities|found [0-9]+ vulnerabilities" | tail -n1); then
    audit_summary="$summary_line"
  else
    audit_summary="npm audit completed"
  fi
  echo "$audit_summary"
else
  echo "npm audit failed to run:" >&2
  echo "$audit_output" >&2
fi

echo
echo "==> Reminders"
if (( ${#missing[@]} > 0 )); then
  echo "- Fix missing security headers in vercel.json"
fi
if echo "$audit_summary" | grep -Eq "found [1-9]"; then
  echo "- Review and address npm audit vulnerabilities (consider 'npm audit fix' and pin upgrades)"
else
  echo "- No audit vulnerabilities detected (prod)"
fi
echo "- Verify RLS in Supabase (see docs/rls_policies.sql) and test DSAR flows"

echo
echo "Done"


