import { pool } from '../database';

export interface User {
  id: number;
  username: string;
  password: string;
  twofa_secret?: string;
}

export const findUserByUsername = async (username: string): Promise<User | null> => {
  const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return res.rows[0] || null;
};

export const createUser = async (
  username: string,
  hashedPassword: string,
  twofaSecret: string | null
): Promise<User> => {
  const res = await pool.query(
    'INSERT INTO users (username, password, twofa_secret) VALUES ($1, $2, $3) RETURNING *',
    [username, hashedPassword, twofaSecret]
  );
  return res.rows[0];
};

export const setTwoFASecret = async (userId: number, secret: string): Promise<void> => {
  await pool.query('UPDATE users SET twofa_secret = $1 WHERE id = $2', [secret, userId]);
};
