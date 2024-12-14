import dbConnect from '@/lib/database/config';
import User from '@/models/User';

export async function verifyPin(userId: string, pin: string): Promise<boolean> {
  await dbConnect();
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  return user.verifyPin(pin);
}

export async function setPin(userId: string, pin: string): Promise<void> {
  await dbConnect();
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  await user.setPin(pin);
}

export async function resetPin(userId: string): Promise<string> {
  await dbConnect();
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  return user.resetPin();
}

export async function changePin(userId: string, currentPin: string, newPin: string): Promise<void> {
  await dbConnect();
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  await user.changePin(currentPin, newPin);
}

export async function checkUserHasPin(userId: string): Promise<boolean> {
  await dbConnect();
  const user = await User.findById(userId);
  return user?.security.pin.enabled || false;
}
