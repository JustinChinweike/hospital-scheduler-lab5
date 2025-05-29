import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { findUserByUsername, createUser, setTwoFASecret } from '../models/userModel';

export const signup = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

  // Check if user exists
  const existingUser = await findUserByUsername(username);
  if (existingUser) return res.status(400).json({ message: 'User already exists' });

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user with empty 2FA secret
  const user = await createUser(username, hashedPassword, null);

  // Generate 2FA secret
  const twofaSecret = speakeasy.generateSecret({ name: `HospitalScheduler (${username})` });
  // Save secret to user
  await setTwoFASecret(user.id, twofaSecret.base32);

  // Generate QR code for authenticator apps
  const otpauthUrl = twofaSecret.otpauth_url as string;
  const qrCodeDataURL = await QRCode.toDataURL(otpauthUrl);

  res.status(201).json({ message: 'User created', qrCode: qrCodeDataURL });
};

export const verify2fa = async (req: Request, res: Response) => {
  const { username, token } = req.body;
  if (!username || !token) return res.status(400).json({ message: 'Username and 2FA token required' });

  const user = await findUserByUsername(username);
  if (!user || !user.twofa_secret) return res.status(400).json({ message: 'User not found or 2FA not setup' });

  // Verify token
  const verified = speakeasy.totp.verify({
    secret: user.twofa_secret,
    encoding: 'base32',
    token,
    window: 1,
  });
  if (!verified) return res.status(400).json({ message: 'Invalid 2FA token' });

  res.status(200).json({ message: '2FA verified' });
};

export const login = async (req: Request, res: Response) => {
  const { username, password, token } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

  const user = await findUserByUsername(username);
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  // Check password
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return res.status(400).json({ message: 'Invalid credentials' });

  // If 2FA enabled (secret exists), require token
  if (user.twofa_secret) {
    if (!token) return res.status(401).json({ message: '2FA token required' });
    const verified = speakeasy.totp.verify({
      secret: user.twofa_secret,
      encoding: 'base32',
      token,
      window: 1,
    });
    if (!verified) return res.status(403).json({ message: 'Invalid 2FA token' });
  }

  // Create JWT
  const jwtPayload = { username: user.username, id: user.id };
  const jwtSecret = process.env.JWT_SECRET as string;
  const jwtOptions: jwt.SignOptions = { expiresIn: process.env.JWT_EXPIRATION || '7d' as any };
  const authToken = jwt.sign(jwtPayload, jwtSecret, jwtOptions);

  res.status(200).json({ token: authToken });
};
