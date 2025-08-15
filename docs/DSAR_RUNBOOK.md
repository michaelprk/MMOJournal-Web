### MMOJournal – DSAR Runbook (Export/Delete)

Version: 2025-08-14

### Export (Self-Service)

1) Sign in as the user.
2) Click “Account” in the signed-in bar → “Download My Data (JSON)”.
3) Confirm a `.json` file downloads containing:
   - `profile` row
   - `pokemon_builds` rows
   - `shiny_hunts` rows (including phases within same table)
4) Provide the file to the requester securely.

If UI export is unavailable:
- Use Supabase Table Editor to export CSV/JSON from each table filtered by `user_id = <auth.uid()>`.

Screenshots:
- [ ] screenshot placeholder: Account → Download My Data button
- [ ] screenshot placeholder: exported JSON file in downloads

### Deletion (Self-Service for app tables)

1) Sign in as the user.
2) Click “Account” → “Delete Account…”.
3) Type `DELETE` and click “Confirm Delete”. This removes:
   - `pokemon_builds` where `user_id = auth.uid()`
   - `shiny_hunts` where `user_id = auth.uid()`
   - `profiles` where `user_id = auth.uid()`
4) User is signed out automatically.

Screenshots:
- [ ] screenshot placeholder: Account → Delete Account confirmation field
- [ ] screenshot placeholder: post-delete sign-in screen

Note: Supabase Auth identity deletion
- The app does not delete the Supabase auth user. An admin should delete the auth user from Supabase Dashboard → Authentication → Users.
- Optional: run `auth.admin.deleteUser('<user-id>')` from a secure server/edge function with service role (not from the client).

### Verification

- After deletion, in Supabase Table Editor, confirm zero rows remain for the user across `profiles`, `pokemon_builds`, `shiny_hunts`.
- In Authentication → Users, confirm the account is removed if requested and approved.

### Response Timelines
### Consent (if analytics ever enabled)

- Current state: No non-essential cookies or analytics are used by the app. If analytics are introduced later, add a consent banner with Accept/Reject stored in localStorage and ensure scripts load only after Accept.
- To revoke consent (future): clear the localStorage key (e.g., `mmojournal:consent=none`) and reload the page.


- Acknowledge DSAR within legal timeframes (typically 30 days). Track in ticket.


