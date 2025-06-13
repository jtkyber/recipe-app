import { useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { createRef } from 'react';
import { db } from '../db';
import { useAppDispatch } from '../redux/hooks';
import { setUser } from '../redux/slices/userSlice';
import styles from '../styles/auth/login_form.module.scss';
import type { IAxiosErrorData } from '../types/errors';
import type { IUser } from '../types/user';
import { setCookie } from '../utils/cookies';
import SpecialInput from './special_input';

function LoginForm() {
	const formRef = createRef<HTMLFormElement>();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const login = async (e: any): Promise<any> => {
		try {
			// Prevent page reload but still check validity of inputs
			if (!formRef.current?.checkValidity()) return;
			e.preventDefault();

			const username = formRef.current?.querySelector('#username') as HTMLInputElement;
			const password = formRef.current?.querySelector('#password') as HTMLInputElement;

			if (!(username?.value && password?.value)) return;

			const res = await axios.post('http://localhost:3000/login', {
				username: username.value.trim(),
				password: password.value,
			});

			if (!res) throw new Error('Login failed');

			const data: IUser = await res.data;

			setCookie('id', data.id.toString(), 7);

			dispatch(setUser(data));

			if (data.id > 0) {
				if (data.savedRecipes?.length) {
					await db.savedRecipes.where('id').noneOf(data.savedRecipes).delete();
				} else await db.savedRecipes.clear();

				navigate({ to: '/search' });
			}
		} catch (error: any) {
			const err: IAxiosErrorData = error.response?.data;
			console.error(err || error);
		}
	};

	return (
		<form ref={formRef} action='' className={styles.login_form}>
			<SpecialInput
				placeholder={'username'}
				inputAttr={{ id: 'username', type: 'text', maxLength: 36, required: true }}
			/>

			<SpecialInput
				placeholder={'password'}
				inputAttr={{ id: 'password', type: 'password', required: true }}
			/>
			<div className={styles.submitBtnContainer}>
				<button type='submit' onClick={login}>
					Join
				</button>
			</div>
		</form>
	);
}

export default LoginForm;
