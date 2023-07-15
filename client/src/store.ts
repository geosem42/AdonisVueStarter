import { defineStore } from 'pinia';
import axios from 'axios';
import { getErrorMessage } from './helpers/errorHelpers';
import { useRouter } from 'vue-router';

interface User {
	id: number;
	name?: string;
	email: string;
	remember_me_token: string | null;
	created_at: string;
	updated_at: string;
}

export const useStore = defineStore({
	id: 'main',
	state: () => ({
		isCheckingAuth: true as boolean | null,
		user: null as User | null,
		token: null as string | null,
		emailVerificationStatus: 'pending' as 'pending' | 'success' | 'failed',
		verificationMessage: '',
	}),
	actions: {
		async register({ name, email, password }: { name: string; email: string; password: string }) {
			try {
				const response = await axios.post('/api/register', { name, email, password });
				if (response.data && response.data.user) {

					return response.data.message;
				}
				return false;
			} catch (error: any) {
				throw new Error(getErrorMessage(error));
			}
		},

		async login({ email, password }: { email: string; password: string }) {
			try {
				const response = await axios.post('/api/login', { email, password });
				if (response.data && response.data.token) {
					this.token = response.data.token.token;
					this.user = response.data.user;
					return true;
				}
				return false;
			} catch (error: any) {
				throw new Error(getErrorMessage(error));
			}
		},

		async logout() {
			try {
				await axios.post('/api/auth/logout');
				this.user = null;
				this.token = null;
			} catch (error) {
				console.error('Error logging out', error);
			}
		},

		async checkAuthentication() {
			this.isCheckingAuth = true;
			try {
				const response = await axios.get('/api/auth/isAuthenticated');
				if (response.data.isAuthenticated) {
					this.user = response.data.user;
				}
			} catch (error) {
				console.error('Error checking authentication', error);
			} finally {
				this.isCheckingAuth = false;
			}
		},

		async updateProfile(name: string, email: string, password: string) {
			try {
				const response = await axios.put('/api/auth/update', { name, email, password });
				this.user = response.data.user;
				return { success: true };
			} catch (error: any) {
				console.error('Error updating profile', error);
				throw error;
			}
		},

		async deleteAccount() {
			try {
				await axios.delete('/api/auth/delete-account');
				this.user = null;
				this.token = null;
				return { success: true };
			} catch (error: any) {
				console.error('Error deleting account', error);
				const errorMessage = getErrorMessage(error);
				return { success: false, errorMessage };
			}
		},

		async verifyEmail(token: string) {
			try {
				this.emailVerificationStatus = 'pending';
				const response = await axios.get(`/api/verify?token=${token}`);
				if (response.data && response.data.message) {
					this.verificationMessage = response.data.message;
					this.emailVerificationStatus = 'success';
					return true;
				}
				return false;
			} catch (error: any) {
				this.emailVerificationStatus = 'failed';
				this.verificationMessage = getErrorMessage(error);
				throw new Error(this.verificationMessage);
			}
		},

	},
});