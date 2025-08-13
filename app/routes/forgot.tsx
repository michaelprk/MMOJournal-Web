import React, { useState } from 'react';
import { supabase } from '../services/supabase';

export default function ForgotPassword() {
	const [email, setEmail] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		setMessage(null);
		setError(null);
		try {
			const url = window.location.origin + '/reset';
			const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
				redirectTo: url,
			});
			if (err) throw err;
			setMessage(
				"If an account exists for that email, we've sent a reset link. Please check your inbox (and spam)."
			);
		} catch (e: any) {
			setError(e?.message || 'Failed to send reset email');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
			<div style={{ width: '100%', maxWidth: 420, background: 'rgba(0,0,0,0.55)', border: '2px solid #ffd700', borderRadius: 12, color: '#fff', padding: 20 }}>
				<h1 style={{ margin: 0, marginBottom: 12, textAlign: 'center', color: '#ffd700' }}>Forgot Password</h1>
				<p style={{ color: '#ccc', marginTop: 0, marginBottom: 16, textAlign: 'center' }}>
					Enter your email address and we'll send you a link to reset your password.
				</p>
				<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
					<input
						placeholder="Email address"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
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
						{submitting ? 'Sending…' : 'Send reset link'}
					</button>
				</form>
				{message && <div style={{ marginTop: 12, color: '#9ae6b4' }}>{message}</div>}
				{error && <div style={{ marginTop: 12, color: '#fecaca' }}>{error}</div>}
			</div>
		</div>
	);
}


