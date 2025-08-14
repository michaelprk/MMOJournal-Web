import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export default function ResetPassword() {
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	// Supabase v2 handles the token in the URL automatically when this page loads
	useEffect(() => {
		// on page load, supabase picks up access_token from URL for password recovery session
		const hash = window.location.hash;
		if (hash && hash.includes('type=recovery')) {
			// nothing else needed; user is authenticated for password update
		}
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		setMessage(null);
		setError(null);
		try {
			if (!password || password.length < 8) throw new Error('Password must be at least 8 characters');
			if (password !== confirm) throw new Error('Passwords do not match');
			const { error: err } = await supabase.auth.updateUser({ password });
			if (err) throw err;
			setMessage('Your password has been updated successfully. You can now sign in with your new password.');
		} catch (e: any) {
			setError(e?.message || 'Failed to reset password');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
			<div style={{ width: '100%', maxWidth: 420, background: 'rgba(0,0,0,0.85)', border: '2px solid #ffd700', borderRadius: 12, color: '#fff', padding: 20 }}>
				<h1 style={{ margin: 0, marginBottom: 12, textAlign: 'center', color: '#ffd700' }}>Reset Password</h1>
				<p style={{ color: '#ccc', marginTop: 0, marginBottom: 16, textAlign: 'center' }}>
					Enter a new password for your account.
				</p>
				<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
					<input
						placeholder="New password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						style={{
							width: '100%', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,215,0,0.4)', borderRadius: 8, color: '#fff', padding: '10px 12px'
						}}
						required
					/>
					<input
						placeholder="Confirm password"
						type="password"
						value={confirm}
						onChange={(e) => setConfirm(e.target.value)}
						style={{
							width: '100%', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,215,0,0.4)', borderRadius: 8, color: '#fff', padding: '10px 12px'
						}}
						required
					/>
					<button
						type="submit"
						disabled={submitting}
						style={{
							background: '#ffd700', color: '#000', border: 'none', borderRadius: 8, padding: '10px 12px', fontWeight: 800, cursor: 'pointer', opacity: submitting ? 0.7 : 1
						}}
					>
						{submitting ? 'Updating…' : 'Update password'}
					</button>
				</form>
				{message && <div style={{ marginTop: 12, color: '#9ae6b4' }}>{message}</div>}
				{error && <div style={{ marginTop: 12, color: '#fecaca' }}>{error}</div>}
			</div>
		</div>
	);
}


